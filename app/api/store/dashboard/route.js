import { NextResponse } from "next/server";
import { authSeller } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";


//Get dashboard data for seller(total products, total orders, total sales)
export async function GET(request) {
    try {
        const {userId} = getAuth(request);
        const storeId = await authSeller(userId);

        //Get All order of the seller
        const orders = await prisma.order.findMany({
            where: {storeId}});

        //Get All products eith ratings of the seller
        const products = await prisma.product.findMany({
            where: {storeId}});
        const ratings = await prisma.rating.findMany({
            where: {productId: {in: products.map((product) => product.id)}},
            include: {user: true, product: true}
        });

        const dashboardData = {
            ratings,
            totalOrders: orders.length,
            totalEarnings: Math.round(orders.reduce((acc, order)=> acc + order.total, 0)),
            totalProducts: products.length
        };
        return NextResponse.json(dashboardData, {status: 200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({error: error.code || error.message}, {status: 400});
    }
}