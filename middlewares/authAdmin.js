// import { clerkClient } from "@clerk/nextjs/server";

// const authAdmin = async (userId) => {
//     try {
//         if(!userId) return false;

//         // Defensive: ensure clerkClient.users exists (helps debug bundling issues)
//         if (!clerkClient || !clerkClient.users || typeof clerkClient.users.getUser !== "function") {
//         console.error("authAdmin: clerkClient.users.getUser is not available", { clerkClientType: typeof clerkClient });
//         return false;
//         }

//         // const client = await clerkClient();
//         const user = await clerkClient.users.getUser(userId);
        
//         return process.env.ADMIN_EMAILS.split(",").includes(user.emailAddresses[0].emailAddress);
//     }
//     catch (error) {
//         console.error("Error in authAdmin middleware:", error);
//         return false;
//     }
// }
// export default authAdmin;



import { clerkClient } from "@clerk/nextjs/server";

const authAdmin = async (userId) => {
  try {
    if (!userId) return false;

    // support both clerkClient shapes: object or function that returns client
    const client = typeof clerkClient === "function" ? await clerkClient() : clerkClient;

    if (!client || !client.users || typeof client.users.getUser !== "function") {
      console.error("authAdmin: clerkClient.users.getUser is not available", { clerkClientType: typeof clerkClient });
      return false;
    }

    const user = await client.users.getUser(userId);
    const email = user?.emailAddresses?.[0]?.emailAddress;
    if (!email) return false;

    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map(e => e.trim().toLowerCase())
      .filter(Boolean);

    return adminEmails.includes(email.toLowerCase());
  } catch (error) {
    console.error("Error in authAdmin middleware:", error);
    return false;
  }
};

export default authAdmin;

