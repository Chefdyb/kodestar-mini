import {
  GlassCard,
  GlassCardContent,
} from '@/components/mycomponents/GlassCard';
import { Card } from '@/components/ui/card';
import React from 'react';

const Page = () => {
  return (
    <div className='h-screen  bg-stone-800 flex items-center justify-center text-gray-300 font-mono text-xl'>
      <div className='absolute top-2 left-2'>admin</div>
      <div className='flex  gap-3'>
        <a href='/admin/create-user'>
          <GlassCard className='w-56 aspect-square flex items-center justify-center bg-yellow-800 hover:bg-yellow-800/60 cursor-pointer'>
            <GlassCardContent>Create user</GlassCardContent>
          </GlassCard>
        </a>
        <a href='/admin/change-user-password'>
          <GlassCard className='w-56 aspect-square flex items-center justify-center bg-yellow-800 hover:bg-yellow-800/60 cursor-pointer'>
            <GlassCardContent className='text-center'>
              Change User Password
            </GlassCardContent>
          </GlassCard>
        </a>
      </div>
    </div>
  );
};

export default Page;
