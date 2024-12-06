// app/page.tsx

import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function HomePage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  return (
    <main style={{ textAlign: 'center', padding: '2rem' }}>
      <h1>LinkedIn OAuth App</h1>

      <div style={{ marginTop: '2rem' }}>
        <Link
          href="/api/auth/login"
          style={{
            padding: '1rem 2rem',
            backgroundColor: '#0073b1',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
          }}
        >
          LinkedIn Signin
        </Link>
      </div>
    </main>
  );
}