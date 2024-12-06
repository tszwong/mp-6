// app/api/auth/login/route.ts

import { NextResponse } from 'next/server';

export async function GET() {
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.LINKEDIN_REDIRECT_URI}&scope=openid%20profile%20email`;
    return NextResponse.redirect(authUrl);    
}
