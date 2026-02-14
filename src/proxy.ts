import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(req:NextRequest){
    const {pathname} = req.nextUrl

    const publicRoute = ["/login","/register","/api/auth","/favicon.ico","/_next"]
    if(publicRoute.some((path)=>pathname.startsWith(path))) {
        return NextResponse.next()
    }

    const token = await getToken({req,secret:process.env.AUTH_SECRET})

    if(!token){
        const loginURL = new URL("/login",req.url)
        loginURL.searchParams.set("callbackUrl",req.url)
        return NextResponse.redirect(loginURL)

    }

    const role = token.role
    if(pathname.startsWith("/user") && role!=="user")
        return NextResponse.redirect(new URL("/unauthorized",req.url))

    if(pathname.startsWith("/delivery") && role!=="deliveryBoy")
        return NextResponse.redirect(new URL("/unauthorized",req.url))

    if(pathname.startsWith("/admin") && role!=="admin")
        return NextResponse.redirect(new URL("/unauthorized",req.url))

    return NextResponse.next()
}

export const config= {
    matcher: '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)',
}