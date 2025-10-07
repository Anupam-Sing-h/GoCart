import { getAuth } from "@clerk/nextjs/server";
import  authAdmin  from "@/middlewares/authAdmin";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";



export async function POST(request) {
    try {
        const {userId} = getAuth(request)
        const isAdmin = await authAdmin(userId)

        if(!isAdmin) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        }

        const {coupon} = await request.json()
        coupon.code = coupon.code.toUpperCase()

        await prisma.coupon.create({data: coupon})

        return NextResponse.json({ message: "Coupon created successfully" }, { status: 201 })

    } catch (error) { 
        console.error("Error in POST /coupon:", error);
        return NextResponse.json({ error: error.code || error.message}, { status: 500 });
    }
}

// DELETE /api/admin/coupon
export async function DELETE(request) {
    try {
        const {userId} = getAuth(request)
        const isAdmin = await authAdmin(userId)
        if(!isAdmin) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        } 

        const {searchParams} = request.nextUrl
        const code = searchParams.get("code")

        await prisma.coupon.delete({where: {code}})
        return NextResponse.json({message: "Coupon deleted successfully"})
    }catch (error) {
        console.log(error)
        return NextResponse.json({error : error.code || error.message}, {status: 400})
    }
}


//Get all the coupons
export async function GET(request) {
    try {
         const {userId} = getAuth(request)
        const isAdmin = await authAdmin(userId)
        if(!isAdmin) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401})
        } 

        const coupons = await prisma.coupon.findMany({orderBy: {createdAt: 'desc'}})
        return NextResponse.json({coupons})
    } catch (error) {
        console.log(error)
        return NextResponse.json({error : error.code || error.message}, {status: 400})
    }
}