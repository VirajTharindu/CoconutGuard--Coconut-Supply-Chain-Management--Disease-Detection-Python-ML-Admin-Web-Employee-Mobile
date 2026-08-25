'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { auth } from '@/lib/firebase/config';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';

export default function NavigationBar() {
    const pathname = usePathname();
    const { user } = useAuth();

    const handleSignOut = async () => {
        try {
            await signOut(auth);
            toast.success('Signed out successfully');
        } catch {
            toast.error('Failed to sign out');
        }
    };

    return (
        <nav className="sticky top-0 z-40 w-full bg-emerald-900 border-b border-emerald-800 shadow-lg transition-all">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-emerald-700 rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300 shadow-inner border border-emerald-600">
                            <span className="text-2xl">🥥</span>
                        </div>
                        <span className="font-bold text-xl text-white tracking-tight">
                            Coconut<span className="text-emerald-300">Guard</span>
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-1 bg-emerald-800/60 p-1 rounded-xl border border-emerald-700/50">
                        <NavLink href="/" label="Dashboard" icon="📊" active={pathname === '/'} />
                        <NavLink href="/expert-review" label="Expert Review" icon="👨‍⚕️" active={pathname === '/expert-review'} />
                        <NavLink href="/supply-chain" label="Supply Chain" icon="🏭" active={pathname === '/supply-chain'} />
                        <NavLink href="/analytics" label="Analytics" icon="📈" active={pathname === '/analytics'} />
                        <NavLink href="/users" label="Users" icon="👥" active={pathname === '/users'} />
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center gap-4">
                        {user ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:block text-right">
                                    <p className="font-semibold text-sm text-emerald-100">Administrator</p>
                                    <p className="text-xs text-emerald-400">{user.email}</p>
                                </div>
                                <div className="group relative">
                                    <div className="w-10 h-10 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center font-bold text-white shadow-md cursor-pointer border-2 border-emerald-700 ring-2 ring-transparent group-hover:ring-emerald-400/50 transition-all">
                                        {user.email?.charAt(0).toUpperCase() || 'A'}
                                    </div>
                                    <div className="absolute right-0 mt-2 w-52 bg-emerald-800 rounded-xl shadow-2xl border border-emerald-700 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right scale-95 group-hover:scale-100">
                                        <div className="px-4 py-2 border-b border-emerald-700 mb-1">
                                            <p className="text-xs text-emerald-400 truncate">{user.email}</p>
                                        </div>
                                        <button
                                            onClick={handleSignOut}
                                            className="w-full text-left px-4 py-2 text-sm text-red-300 hover:bg-red-500/20 hover:text-red-200 transition-colors flex items-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                                            Sign out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="w-8 h-8 rounded-full border-2 border-emerald-600 border-t-emerald-300 animate-spin"></div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

function NavLink({
    href,
    label,
    icon,
    active
}: {
    href: string;
    label: string;
    icon: string;
    active: boolean;
}) {
    return (
        <Link
            href={href}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-all duration-200 ${
                active
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/50'
                : 'text-emerald-200 hover:bg-emerald-700/60 hover:text-white'
            }`}
        >
            <span className={active ? 'scale-110 transition-transform' : ''}>{icon}</span>
            <span>{label}</span>
        </Link>
    );
}
