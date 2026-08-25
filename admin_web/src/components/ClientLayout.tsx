'use client';

import { usePathname } from 'next/navigation';
import NavigationBar from '@/components/NavigationBar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isLoginPage = pathname === '/login';

    return (
        <>
            {!isLoginPage && <NavigationBar />}
            <main>{children}</main>
        </>
    );
}
