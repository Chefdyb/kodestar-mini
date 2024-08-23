'use client';
import {
  GlassCard,
  GlassCardContent,
} from '@/components/mycomponents/GlassCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import db, { User } from '@/lib/db';
import React, { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

const Page = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [usersSelect, setUsersSelect] = useState<User | null>(null);
  const [password, setPassword] = useState('');

  useEffect(() => {
    db.users.toArray().then((res) => setUsers(res));
  }, [users]);

  const filteredData = useMemo(() => {
    if (!users) return [];
    return users.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const changePassword = async () => {
    if (!usersSelect) return;
    if (!password) {
      toast.error('Password is required');
      return;
    }
    if (password.length < 5) {
      toast.error('Password must be at least 5 characters long');
      return;
    }
    await db.users.update(usersSelect.id, { password });
    toast.success('Password updated');
    setUsersSelect(null);
  };

  return (
    <div className='flex items-center justify-center  bg-stone-800 h-screen text-gray-400 font-mono font-semibold'>
      <div className='max-w-md flex flex-col gap-3  w-full  '>
        {!usersSelect ? (
          <>
            <div></div>
            <Input
              className=''
              onChange={(e) => setSearchTerm(e.target.value)}></Input>
            <GlassCard className=''>
              <GlassCardContent>
                <div className='w-full h-[480px] overflow-y-auto'>
                  <div className=' space-y-0 mt-2 '>
                    {filteredData.map((item) => {
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            setUsersSelect(item);
                          }}
                          className='py-4 px-2  hover:bg-yellow-800/60 cursor-pointer rounded-lg
                  '>
                          {item.name}
                        </div>
                      );
                    })}
                    {filteredData.length === 0 && (
                      <div>No user found for the search term given</div>
                    )}
                  </div>
                </div>
              </GlassCardContent>
            </GlassCard>
          </>
        ) : (
          <div className='flex gap-2 flex-col'>
            <Input
              onChange={(e) => {
                setPassword(e.target.value);
              }}></Input>
            <Button
              className='bg-yellow-800 hover:bg-yellow-800/60'
              onClick={changePassword}>
              Update Password
            </Button>
          </div>
        )}
      </div>
      <div className='absolute top-2 left-2'>
        <a href='/admin'>admin</a> &gt; <span>change-password</span>
      </div>
    </div>
  );
};

export default Page;
