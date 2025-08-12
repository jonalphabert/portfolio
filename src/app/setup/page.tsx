import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Setup | Portfolio',
  description: 'Create your admin account to get started with managing your portfolio',
};

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/store/auth';
import { UserPlus, Mail, User, Lock } from 'lucide-react';
import SetupGuard from '@/components/admin/SetupGuard';

export default function AdminSetupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { setupAdmin } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      const success = await setupAdmin(username, email, password);
      if (success) {
        router.push('/admin');
      } else {
        setError('Setup failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred during setup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SetupGuard>
      <div className='bg-muted/30 flex min-h-screen items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full'>
            <UserPlus className='text-primary h-6 w-6' />
          </div>
          <CardTitle className='text-2xl'>Admin Setup</CardTitle>
          <p className='text-muted-foreground'>Create your admin account to get started</p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <div>
              <Label className='mb-2' htmlFor='username'>
                Username
              </Label>
              <div className='relative'>
                <User className='text-muted-foreground absolute top-3 left-3 h-4 w-4' />
                <Input
                  id='username'
                  type='text'
                  placeholder='Enter username'
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className='pl-10'
                  required
                />
              </div>
            </div>

            <div>
              <Label className='mb-2' htmlFor='email'>
                Email
              </Label>
              <div className='relative'>
                <Mail className='text-muted-foreground absolute top-3 left-3 h-4 w-4' />
                <Input
                  id='email'
                  type='email'
                  placeholder='Enter email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className='pl-10'
                  required
                />
              </div>
            </div>

            <div>
              <Label className='mb-2' htmlFor='password'>
                Password
              </Label>
              <div className='relative'>
                <Lock className='text-muted-foreground absolute top-3 left-3 h-4 w-4' />
                <Input
                  id='password'
                  type='password'
                  placeholder='Enter password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className='pl-10'
                  required
                />
              </div>
            </div>

            <div>
              <Label className='mb-2' htmlFor='confirmPassword'>
                Confirm Password
              </Label>
              <div className='relative'>
                <Lock className='text-muted-foreground absolute top-3 left-3 h-4 w-4' />
                <Input
                  id='confirmPassword'
                  type='password'
                  placeholder='Confirm password'
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className='pl-10'
                  required
                />
              </div>
            </div>

            {error && <p className='text-destructive text-sm'>{error}</p>}

            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading ? 'Setting up...' : 'Complete Setup'}
            </Button>
          </form>
        </CardContent>
      </Card>
      </div>
    </SetupGuard>
  );
}
