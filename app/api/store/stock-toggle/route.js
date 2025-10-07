import { NextResponse } from "next/server";
import { authSeller } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";

//toggle stock status of a product
export async function POST(request) {
    try {
        const {userId} = getAuth(request);
        const {productId} = await request.json();

        if(!productId){
            return NextResponse.json({error: "missing details: productId"}, {status: 400});
        }

        const storeId = await authSeller(userId);

        if(!storeId){
            return NextResponse.json({message: "Unauthorized"}, {status: 401});
        }

        //check if the products exits ?
        const product = await prisma.product.findFirst({
            where: {
                id: productId,
                storeId: storeId
            }
        });

        if(!product){
            return NextResponse.json({error: "Product not found"}, {status: 404});
        }

        await prisma.product.update({
            where: {id: productId},
            data: {inStock: !product.inStock }
            });

            return NextResponse.json({message: "Stock status updated successfully"}, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: error.code || error.message}, {status: 400});
    }
}
