import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    console.error('Authorization code is missing');
    return new NextResponse('Authorization code is missing', { status: 400 });
  }

  try {
    const tokenResponse = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          code,
          redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET,
        },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    const userInfoResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const user = {
      id: userInfoResponse.data.sub,
      name: userInfoResponse.data.name,
      email: userInfoResponse.data.email,
      picture: userInfoResponse.data.picture || '',
    };

    // console.log('User Info:', user);
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
    const homeUrl = `${baseUrl}/home`;

    const response = NextResponse.redirect(homeUrl);
    response.cookies.set('token', accessToken, { httpOnly: true, maxAge: 60 * 60 * 24 }); // Expires in 1 day

    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error during callback processing:', error.response?.data || error.message);
    } else {
      console.error('Error during callback processing:', error);
    }
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
