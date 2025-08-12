import { Metadata } from 'next';
import LoginForm from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Admin Login | Portfolio',
  description: 'Sign in to your admin dashboard to manage your portfolio content',
};

export default function AdminLoginPage() {
  return <LoginForm />;
}