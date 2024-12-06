// home/page.tsx

import { cookies } from 'next/headers';
import axios from 'axios';
import LogoutButton from '@/components/LogOutBtn';
import { redirect } from 'next/navigation';
// import styled from 'styled-components';

// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
// `;

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return redirect('/api/auth/login');
  }

  try {
    const userInfoResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${token}` },
    });

    const user = {
      id: userInfoResponse.data.sub,
      name: userInfoResponse.data.name,
      email: userInfoResponse.data.email,
      picture: userInfoResponse.data.picture || '',
    };

    return (
      <div style={{
        backgroundColor: '#0073b1',
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
        alignContent:'center',
        justifyContent:'center',
        margin:'0 auto',
        marginTop:'10%',
        width:'35%',
        borderRadius:'15px'}}>
        <p style={{margin:'0 auto', marginTop:'15px'}}>Name: {user.name}</p>
        <p style={{margin:'0 auto', marginTop:'15px'}}>User ID: {user.id}</p>
        <p style={{margin:'0 auto', marginTop:'15px'}}>Email: {user.email}</p>
        {user.picture && <img src={user.picture} alt="Profile" 
          style={{width:'100px',
            borderRadius: '50%',
            margin:'0 auto',
            marginTop:'15px',
            marginBottom:'15px'
          }}/>}
        <LogoutButton />
      </div>
    );
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    return <div>Failed to load profile</div>;
  }
}
