import { getAuth } from "@clerk/nextjs/server";
import authAdmin from "@/middlewares/authAdmin";
import { NextResponse } from "next/server";

// Auth Admin
export async function GET(request) {
    try {
        const { userId } = getAuth(request);
        const isAdmin = await authAdmin(userId);

        if(!isAdmin) {
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }

        return NextResponse.json({isAdmin: true}, {status: 200});
    } catch (error) {
        console.error("Error in is-admin route:", error);
        return NextResponse.json({error: error.code || error.message || "Internal Server Error"}, {status: 500});
    }
}

