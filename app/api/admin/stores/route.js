// import { NextResponse } from "next/server";
// import { getAuth } from "@clerk/nextjs/server";
// import authAdmin from "@/middlewares/authAdmin";
// import prisma from "@/lib/prisma";


// //Functon to fetch all Approved Stores
// export async function GET(request) {
//     try {
//         const { userId } = getAuth(request);
//         const isAdmin = await authAdmin(userId);
//         if(!isAdmin) {
//             return NextResponse.json({error: "Unauthorized"}, {status: 401});
//         }

//         const stores = await prisma.store.findMany({
//             where: { status: { in: ["approved"]} },
//             include: { user: true }
//     })
//         return NextResponse.json({stores}, {status: 200});
//     }
//     catch (error) {
//         console.error("Error in api>admin>stores>route.js GET route:", error);
//         return NextResponse.json({error: error.code || error.message || "Internal Server Error"}, {status: 500});
//     }
// }


import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import authAdmin from "@/middlewares/authAdmin";
import prisma from "@/lib/prisma";

// Function to fetch all Approved Stores
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);

    if (!userId || !isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stores = await prisma.store.findMany({
      where: { status: "approved" }, // or in: ["approved"] if you expect multiple
      include: { user: true }
    });

    return NextResponse.json({ stores }, { status: 200 });
  } catch (error) {
    console.error("Error in api>admin>stores>route.js GET route:", error);
    return NextResponse.json(
      { error: error.code || error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}