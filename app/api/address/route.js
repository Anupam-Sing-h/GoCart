import prisma from "@/lib/prisma"
import { getAuth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"



//function to add the user address
export async function POST(request) {
    try {
        const {userId} = getAuth(request)
        const {address} = await request.json()

        address.userId = userId

        const newAddress = await prisma.address.create({
            data: address
        })
        
        return NextResponse.json({newAddress, message : 'Address added'})

    } catch (error) {
        console.error(error)
        return NextResponse.json({error: error.code || error.message}, {status:400})
    }
}

//Get all the address of the users
export async function GET(request) {
    try {
        const {userId} = getAuth(request)
        const {address} = await prisma.address.findMany({
            where: {userId}
        })
        
        return NextResponse.json({address})

    } catch (error) {
        console.error(error)
        return NextResponse.json({error: error.code || error.message}, {status:400})
    }
}