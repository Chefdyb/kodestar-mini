'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import db from '@/lib/db';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { string } from 'zod';
import Lottie from 'react-lottie-player';
import Animation from '@/lottifiles/Animation.json';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Basic client-side validation
    if (!email || !password) {
      setError('Email and password are required');
      toast.error('Email and password are required');
      setLoading(false);
      return;
    }

    try {
      // Fetch the user from the database
      const user = await db.users.get({ email });
      user && console.log(user);

      // Check if user exists and password matches
      if (user && user.password === password) {
        toast.success('Login successful!');
        // redirect to editor page
        sessionStorage.setItem(
          'auth-session-kodestar',
          JSON.stringify(user.id)
        );
        router.push('/home');
      } else {
        toast.error(`Invalid email or password`);

        return;
      }
    } catch (err) {
      console.error('Error fetching user:', err);
      setError('An error occurred while logging in. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className='  h-screen flex items-center justify-center bg-stone-800 '>
      <section className=' relative  rounded-md   flex items-center justify-center  max-w-4xl w-full gap-20 '>
        {/* <Link href="/admin/create-user" className=" absolute top-4 right-10 ">
          <Button variant={"secondary"}>Register</Button>
        </Link> */}
        <div className='h-full hidden md:block flex-1 '>
          <Lottie
            className='w-full h-full'
            loop
            animationData={Animation}
            play
          />
        </div>
        <div className='flex-1 relative'>
          <div className='flex-1 font-mono flex flex-col justify-between  text-center  h-full gap-16 bg-yellow-800/10 p-10 rounded-3xl'>
            <h1 className='font-bold text-yellow-500 text-3xl'>Login</h1>
            <div className='flex flex-col gap-6 '>
              <div className='grid gap-2'>
                <Label
                  htmlFor='email'
                  className='text-left text-lg  font-bold text-gray-400'>
                  Email
                </Label>
                <Input
                  id='email'
                  type='email'
                  placeholder='m@knust.edu.gh'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className='focus:border-yellow-500/60 border-gray-400 font-semibold text-lg py-6 px-4 border text-gray-300'
                  onFocus={() => setError(null)}
                />
              </div>
              <div className='grid gap-2'>
                <Label
                  htmlFor='password'
                  className='text-left text-lg  font-bold text-gray-300'>
                  Password
                </Label>
                <Input
                  id='password'
                  type='password'
                  onFocus={() => setError(null)}
                  value={password}
                  className='focus:border-yellow-500/60 border-gray-400 font-semibold text-lg py-6 px-4 border text-gray-300'
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className='text-destructive'>{error}</p>}
            </div>
            <Button
              className='w-full p-6 text-lg font-medium bg-yellow-700 hover:bg-yellow-700/70 '
              //@ts-ignore
              onClick={handleSubmit}
              disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
