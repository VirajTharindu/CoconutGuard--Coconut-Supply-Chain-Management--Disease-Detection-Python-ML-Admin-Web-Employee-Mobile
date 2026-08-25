'use client';

import { useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserService, FirestoreService, COLLECTIONS } from '@/lib/firebase/firestore';
import { User } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { Timestamp, DocumentSnapshot } from 'firebase/firestore';

export default function UsersPage() {
    const [roleFilter, setRoleFilter] = useState<'all' | 'farmer' | 'expert' | 'admin'>('all');
    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

    const { 
        data, 
        isLoading, 
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['users'],
        queryFn: async ({ pageParam = null }) => {
            return await UserService.getAllUsers(20, pageParam as DocumentSnapshot | null);
        },
        getNextPageParam: (lastPage: { data: unknown[], lastDoc: DocumentSnapshot | null }) => lastPage.lastDoc || undefined,
        initialPageParam: null as DocumentSnapshot | null,
    });

    const users = data?.pages.flatMap((page) => page.data as User[]) || [];

    const filteredUsers = roleFilter === 'all'
        ? users
        : users.filter((user) => user.role === roleFilter);

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-emerald-950 mb-3 tracking-tight">
                            User Management
                        </h1>
                        <p className="text-lg text-emerald-700/80 font-medium">Manage farmers, experts, and admins</p>
                    </div>
                    <Button onClick={() => setIsAddUserModalOpen(true)}>
                        + Add User
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card>
                        <h3 className="text-sm font-medium text-emerald-700/70 mb-2">Total Users</h3>
                        <p className="text-3xl font-extrabold text-emerald-950">{isLoading ? '...' : users.length}</p>
                    </Card>
                    <Card>
                        <h3 className="text-sm font-medium text-emerald-700/70 mb-2">Farmers</h3>
                        <p className="text-3xl font-extrabold text-emerald-600">
                            {isLoading ? '...' : users.filter((u) => u.role === 'farmer').length}
                        </p>
                    </Card>
                    <Card>
                        <h3 className="text-sm font-medium text-emerald-700/70 mb-2">Experts</h3>
                        <p className="text-3xl font-extrabold text-blue-600">
                            {isLoading ? '...' : users.filter((u) => u.role === 'expert').length}
                        </p>
                    </Card>
                    <Card>
                        <h3 className="text-sm font-medium text-emerald-700/70 mb-2">Admins</h3>
                        <p className="text-3xl font-extrabold text-purple-600">
                            {isLoading ? '...' : users.filter((u) => u.role === 'admin').length}
                        </p>
                    </Card>
                </div>

                {/* Filter */}
                <div className="bg-emerald-100/60 backdrop-blur-md rounded-xl p-2 flex gap-2 w-fit mb-6 shadow-sm border border-emerald-200/80">
                    {(['all', 'farmer', 'expert', 'admin'] as const).map((role) => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={`px-6 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${roleFilter === role
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'text-emerald-800 hover:bg-emerald-200/60'
                                }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>

                {/* User Table */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                    </div>
                ) : isError ? (
                    <Card className="p-16 text-center bg-red-50/40 border-dashed border-2 border-red-200 shadow-none">
                        <div className="text-6xl mb-6">⚠️</div>
                        <h2 className="text-2xl font-bold text-red-900 mb-2">Failed to load users</h2>
                        <p className="text-red-700/70">Please check your connection and try again.</p>
                    </Card>
                ) : filteredUsers.length === 0 ? (
                    <Card className="p-16 text-center bg-emerald-50/40 border-dashed border-2 border-emerald-200 shadow-none">
                        <div className="text-6xl mb-6">👤</div>
                        <h2 className="text-2xl font-bold text-emerald-950 mb-2">No Users Found</h2>
                        <p className="text-emerald-700/70">
                            {roleFilter === 'all'
                                ? 'No users in the system'
                                : `No ${roleFilter}s registered`}
                        </p>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        <Card className="p-0 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-emerald-50/70 border-b border-emerald-100 text-xs uppercase tracking-wider text-emerald-700 font-semibold">
                                        <th className="p-4">Name</th>
                                        <th className="p-4">Role</th>
                                        <th className="p-4">Contact</th>
                                        <th className="p-4">Region</th>
                                        <th className="p-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-emerald-100">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id} className="hover:bg-emerald-50/60 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-emerald-950">{user.name}</div>
                                                        <div className="text-xs text-emerald-600/70">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`inline-flex px-2 py-1 rounded-md text-xs font-bold capitalize ${
                                                        user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                                                        user.role === 'expert' ? 'bg-blue-100 text-blue-700' : 
                                                        'bg-emerald-100 text-emerald-800'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm text-emerald-800">{user.phone}</td>
                                            <td className="p-4 text-sm text-emerald-800">{user.location?.region || 'N/A'}</td>
                                            <td className="p-4 text-right">
                                                <button className="text-emerald-600 hover:text-emerald-800 font-medium text-sm mr-3 transition-colors">Edit</button>
                                                <button className="text-red-500 hover:text-red-700 font-medium text-sm transition-colors">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                    
                    {hasNextPage && roleFilter === 'all' && (
                        <div className="flex justify-center mt-6">
                            <Button 
                                onClick={() => fetchNextPage()} 
                                isLoading={isFetchingNextPage}
                                variant="secondary"
                            >
                                Load More Users
                            </Button>
                        </div>
                    )}
                </div>
                )}
            </div>

            <AddUserModal 
                isOpen={isAddUserModalOpen} 
                onClose={() => setIsAddUserModalOpen(false)} 
            />
        </div>
    );
}

function AddUserModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const queryClient = useQueryClient();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<'farmer' | 'expert' | 'admin'>('farmer');
    const [phone, setPhone] = useState('');

    const mutation = useMutation({
        mutationFn: async () => {
            const newUser = {
                uid: 'temp-uid-' + Date.now(),
                name,
                email,
                role,
                phone,
                location: { lat: 0, lng: 0, region: 'Unknown' },
                createdAt: Timestamp.now()
            };
            await FirestoreService.addDocument(COLLECTIONS.USERS, newUser);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            toast.success('User added successfully');
            onClose();
            setName(''); setEmail(''); setRole('farmer'); setPhone('');
        },
        onError: (error) => {
            console.error('Error adding user:', error);
            toast.error('Failed to add user');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New User">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-emerald-900 mb-1">Full Name</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full border border-emerald-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-950" placeholder="John Doe" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-emerald-900 mb-1">Email Address</label>
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-emerald-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-950" placeholder="john@example.com" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-emerald-900 mb-1">Role</label>
                        <select value={role} onChange={e => setRole(e.target.value as 'farmer' | 'expert' | 'admin')} className="w-full border border-emerald-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-emerald-950">
                            <option value="farmer">Farmer</option>
                            <option value="expert">Expert</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-emerald-900 mb-1">Phone Number</label>
                        <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-emerald-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-950" placeholder="+94 77 123 4567" />
                    </div>
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-emerald-100 mt-6">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
                    <Button type="submit" isLoading={mutation.isPending}>Add User</Button>
                </div>
            </form>
        </Modal>
    );
}
