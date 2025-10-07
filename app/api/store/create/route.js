import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import imagekit from "@/configs/imageKit";

// Create the store
export async function POST(request) {
    try {
        const {userId} = getAuth(request);
        //Get the data from the form
        // const fromData = await request.formData();

        // const {name} = fromData.get("name");
        // const {username} = fromData.get("username");
        // const {description} = fromData.get("description");
        // const {email} = fromData.get("email");
        // const {contact} = fromData.get("contact");
        // const {address} = fromData.get("address");
        // const {image} = fromData.get("image");

        const formData = await request.formData();
        const name = formData.get("name");
        const username = formData.get("username");
        const description = formData.get("description");
        const email = formData.get("email");
        const contact = formData.get("contact");
        const address = formData.get("address");
        const image = formData.get("image");


        if(!name || !username || !description || !email || !contact || !address || !image){
            return NextResponse.json({error: "missing information field"}, {status: 400});
        }

        //Check is user have already registered a store
        const store = await prisma.store.findFirst({
            where: {
                userId: userId
            }
        });
        //If store already registered then return the status of the store
        if(store){
            return NextResponse.json({status: store.status});
        }

        //Check is username is already taken
        const isUsernameTaken = await prisma.store.findFirst({
            where: {
                username: username.toLowerCase()
            }
        });
        if(isUsernameTaken){
            return NextResponse.json({error: "username already taken"}, {status: 400});
        }

        //uploading image to ImageKit
        const buffer = Buffer.from(await image.arrayBuffer());
        const response = await imagekit.upload({
            file: buffer,
            fileName: image.name,
            folder: "logo"
        })

        const optimizedImage = imagekit.url({
            path: response.filePath,
            transformation: [
                {quality: "auto"},
                {format: "webp"},
                {width: "512"}
            ]
        })

        console.log("Creating store for user:", userId);
console.log("Form values:", { name, username, email, image });

        //Create the store
        const newStore = await prisma.store.create({
            data: { 
                userId,
                name,
                description,
                username: username.toLowerCase(),
                email,
                contact,
                address,
                logo: optimizedImage,
            }
        });

        //Link store to user
        await prisma.user.update({
            where: {id: userId},
            data: {store: {connect: {id: newStore.id}}}
        })

        return NextResponse.json({message: "Store created successfully, waiting for admin approval"}, {status: 201});
            
    } catch (error) {
        console.error("STORE_CREATION_ERROR", error);
        return NextResponse.json({error: error.code || error.message || "Internal server error"}, {status: 400});
    }
}

//check is user have already registered a store
//If store already registered then return the status of the store

export async function GET(request) {
    try {
        const {userId} = getAuth(request);
        //Check is user have already registered a store
        const store = await prisma.store.findFirst({
            where: {userId: userId}
            })
            if(store){
                return NextResponse.json({status: store.status});
            }
            return NextResponse.json({status: "Not Registered"});
    } catch (error) {
        console.error("STORE_CREATION_ERROR", error);
        return NextResponse.json({error: error.code || error.message || "Internal server error"}, {status: 400});
    }
}