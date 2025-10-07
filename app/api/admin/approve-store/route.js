import authAdmin from "@/middlewares/authAdmin";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

//Approve sellers
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        const isAdmin = await authAdmin(userId);
        if(!isAdmin) {
            return NextResponseResponse(JSON.stringify({error: "Unauthorized"}), {status: 401});
        }

        const { storeId, status } = await request.json();

        if(status === "approved") {
            //Approve store logic here
            await prisma.store.update({
                where: { id: storeId },
                data: { status: "approved", isActive: true }
            });
        }else if(status === "rejected") {
            //Rejected store logic here
            await prisma.store.update({
                where: { id: storeId },
                data: { status: "rejected", isActive: false }
            });
        }

        return NextResponse.json({message: `Store ${status} successfully`}, {status: 200});
    } catch (error) {
        console.error("Error in approve-store route:", error);
        return NextResponse.json({error: error.code || error.message || "Internal Server Error"}, {status: 400});
    }
}

//Functon to fetch all pending and rejected stores
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const isAdmin = await authAdmin(userId);
        if(!isAdmin) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        const stores = await prisma.store.findMany({
            where: { status: { in: ["pending", "rejected"] } },
            include: { user: true }
    })
        return NextResponse.json({stores}, {status: 200});
    }
    catch (error) {
        console.error("Error in approve-store GET route:", error);
        return NextResponse.json({error: error.code || error.message ||"Internal Server Error"}, {status: 500});
    }
}

