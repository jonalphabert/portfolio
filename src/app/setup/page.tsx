import { Metadata } from 'next';
import SetupForm from '@/components/auth/SetupForm';

export const metadata: Metadata = {
  title: 'Admin Setup | Portfolio',
  description: 'Create your admin account to get started with managing your portfolio',
};

export default function AdminSetupPage() {
  return <SetupForm />;
}