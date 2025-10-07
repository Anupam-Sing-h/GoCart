import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";

//Get dashboard data for Admin (total users, total stores, total approved stores, total pending stores and many more...)

export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const isAdmin = await authAdmin(userId);
        if(!isAdmin) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        //Get Totatl orders
        const orders = await prisma.order.count();
        //Get total stores on App
        const stores = await prisma.store.count();
        //Get all orders includeonly createdAt anf total & calculate total sales or revenue
        const allOrders = await prisma.order.findMany({
            select: { createdAt: true, total: true }
        });

        let totalRevenue = 0;
        allOrders.forEach(order => {
            totalRevenue += order.total;
        });

        const revenue = totalRevenue.toFixed(2);
        //total products on App
        const products = await prisma.product.count();
        
        const dashboardData = {
            orders,
            stores,
            products,
            revenue,
            allOrders
        };

        return NextResponse.json({dashboardData}, {status: 200});

    
    }catch (error) {
        console.error("Error in admin dashboard GET route:", error);
        return NextResponse.json({error: error.code || error.message}, {status: 500});
    }
}
