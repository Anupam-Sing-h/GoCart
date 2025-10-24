// 'use client'
// import Link from "next/link"

// const StoreNavbar = ({ storeInfo }) => {


//     return (
//         <div className="flex items-center justify-between px-12 py-3 border-b border-slate-200 transition-all">
//             <Link href="/" className="relative text-4xl font-semibold text-slate-700">
//                 <span className="text-green-600">go</span>cart<span className="text-green-600 text-5xl leading-0">.</span>
//                 <p className="absolute text-xs font-semibold -top-1 -right-11 px-3 p-0.5 rounded-full flex items-center gap-2 text-white bg-green-500">
//                     Store
//                 </p>
//             </Link>
//             <div className="flex items-center gap-3">
//                 <p>Hi, {storeInfo?.name || "Seller"}</p>
//             </div>
//         </div>
//     )
// }

// export default StoreNavbar


'use client'
import Link from "next/link"
import { useUser, UserButton } from "@clerk/nextjs"

const StoreNavbar = ({ storeInfo }) => {
  const { user } = useUser();

  return (
    <div className="flex items-center justify-between px-4 sm:px-8 md:px-12 py-2 sm:py-3 border-b border-slate-200 transition-all">
      <Link 
        href="/" 
        className="relative text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-700"
      >
        <span className="text-green-600">go</span>cart
        <span className="text-green-600 text-3xl sm:text-4xl md:text-5xl leading-0">.</span>

        <p className="absolute text-[10px] sm:text-xs font-semibold -top-2 -right-9 sm:-right-11 px-2 sm:px-3 py-0.5 rounded-full flex items-center gap-1 sm:gap-2 text-white bg-green-500">
          Store
        </p>
      </Link>

      <div className="flex items-center gap-2 sm:gap-3">
        <p className="text-sm sm:text-base">Hi, {user?.firstName}</p>
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  )
}

export default StoreNavbar