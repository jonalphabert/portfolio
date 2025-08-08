import { MinimalCenteredFooter } from '@/components/footers/minimal-centered-footer';
import { AnimatedIndicatorNavbar } from '@/components/navbars/animated-indicator-navbar';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Jonathan's Portfolio",
  description: 'Portfolio website for Jonathan',
};

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className='relative'>
        <AnimatedIndicatorNavbar />
        {children}
        <MinimalCenteredFooter />
      </div>
    </>
  );
}
