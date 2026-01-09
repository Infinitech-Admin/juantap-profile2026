'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EmailVerifiedSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 3000); // Redirect after 3 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
      <h1 className="text-2xl font-semibold text-green-600 mb-2">✅ Email Verified!</h1>
      <p className="text-gray-700">Redirecting to login...</p>
    </div>
  );
}
