import authSeller from "@/middlewares/authSeller";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import imagekit from "@/configs/imageKit"

//Adding a new product in the store
export async function POST(request) {
    try {
        const {userId} = getAuth(request);

        if(!userId){
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

        const storeId = await authSeller(userId);

        if(!storeId){
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

        const formData = await request.formData();
        const name = formData.get("name");
        const description = formData.get("description");
        const mrp = Number(formData.get("mrp"));
        const price = Number(formData.get("price"));
        const category = formData.get("category");
        const images = formData.getAll("images");

        //checking all the fields
        if(!name || !description || !mrp || !price || !category || images.length === 0){
            return NextResponse.json({message: "All fields are required"}, {status: 400});
        }

        //converting the image into binary formate for uploading 
        const imagesUrl = await Promise.all(images.map(async (image) => {
            // const buffer = Buffer.form(await images.arrayBuffer());
            const buffer = Buffer.from(await image.arrayBuffer());
            //uploading the image to imageKit
            const response = await imagekit.upload({
                    file : buffer,
                    // fileName : images.name,
                    fileName: image.name,
                    folder : "products"
                });
            //Optimizing the uploaded image url
            const Url = imagekit.url({
                path: response.filePath,
                transformation: [
                    {quality: "auto"},
                    {format: "webp"},
                    {width: "1024"}
                    ]
                });
            return Url;
        }))
        
        //saving the product to the database
        await prisma.product.create({
            data: {
                name,
                description,
                mrp,
                price,
                category,
                images: imagesUrl,
                storeId
            }
        });

        return NextResponse.json({message: "Product added successfully"}, {status: 201});


    } catch (error) {
        console.log(error);
        return NextResponse.json({error: error.code || error.message}, {status: 500});
    }
}


//Get all the products of the store
export async function GET(request) {
        const {userId} = getAuth(request);

    try {
        if(!userId){
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

        const storeId = await authSeller(userId);

        if(!storeId){
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

        const products = await prisma.product.findMany({
            where: {storeId}
        });
        return NextResponse.json({products}, {status: 200});
        
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: error.code || error.message}, {status: 500});
    }
}
