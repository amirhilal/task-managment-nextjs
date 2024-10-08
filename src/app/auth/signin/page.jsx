'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async e => {
    e.preventDefault();
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    if (result.error) {
      console.log(result.error);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="p-2 border border-gray-300 rounded-md"
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="p-2 border border-gray-300 rounded-md"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded-md">
        Sign In
      </button>
    </form>
  );
}
