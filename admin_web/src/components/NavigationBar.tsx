import Link from 'next/link';

export default function NavigationBar() {
    return (
        <nav className="bg-emerald-800 text-white shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                        <span className="text-2xl">🥥</span>
                        Coconut Guard Admin
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-1">
                        <NavLink href="/" label="Dashboard" icon="📊" />
                        <NavLink href="/expert-review" label="Expert Review" icon="👨‍⚕️" />
                        <NavLink href="/supply-chain" label="Supply Chain" icon="🏭" />
                        <NavLink href="/analytics" label="Analytics" icon="📈" />
                        <NavLink href="/users" label="Users" icon="👥" />
                    </div>

                    {/* User Menu */}
                    <div className="flex items-center gap-3">
                        <div className="hidden sm:block text-right">
                            <p className="font-medium text-sm">Admin User</p>
                            <p className="text-xs text-emerald-200">admin@coconutguard.com</p>
                        </div>
                        <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center font-bold">
                            A
                        </div>
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
}: {
    href: string;
    label: string;
    icon: string;
}) {
    return (
        <Link
            href={href}
            className="px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
        >
            <span>{icon}</span>
            <span className="font-medium">{label}</span>
        </Link>
    );
}
