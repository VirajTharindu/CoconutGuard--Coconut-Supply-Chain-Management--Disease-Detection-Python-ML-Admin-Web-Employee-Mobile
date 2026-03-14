'use client';

import { useState, useEffect } from 'react';
import { UserService } from '@/lib/firebase/firestore';
import { User } from '@/types';

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [roleFilter, setRoleFilter] = useState<'all' | 'farmer' | 'expert' | 'admin'>('all');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const allUsers = await UserService.getAllUsers();
            setUsers(allUsers as User[]);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = roleFilter === 'all'
        ? users
        : users.filter((user) => user.role === roleFilter);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            👥 User Management
                        </h1>
                        <p className="text-gray-600">Manage farmers, experts, and admins</p>
                    </div>
                    <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700">
                        + Add User
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500">Total Users</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{users.length}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500">Farmers</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">
                            {users.filter((u) => u.role === 'farmer').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500">Experts</h3>
                        <p className="text-3xl font-bold text-blue-600 mt-2">
                            {users.filter((u) => u.role === 'expert').length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500">Admins</h3>
                        <p className="text-3xl font-bold text-purple-600 mt-2">
                            {users.filter((u) => u.role === 'admin').length}
                        </p>
                    </div>
                </div>

                {/* Filter */}
                <div className="bg-white rounded-lg shadow mb-6 p-2 flex gap-2">
                    {(['all', 'farmer', 'expert', 'admin'] as const).map((role) => (
                        <button
                            key={role}
                            onClick={() => setRoleFilter(role)}
                            className={`px-4 py-2 rounded-lg font-medium capitalize ${roleFilter === role
                                    ? 'bg-emerald-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {role}
                        </button>
                    ))}
                </div>

                {/* User Table */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Loading users...</p>
                    </div>
                ) : filteredUsers.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <div className="text-6xl mb-4">👤</div>
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">No Users Found</h2>
                        <p className="text-gray-500">
                            {roleFilter === 'all'
                                ? 'No users in the system'
                                : `No ${roleFilter}s registered`}
                        </p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Role
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Contact
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Region
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredUsers.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${user.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : user.role === 'expert'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}
                                            >
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {user.phone}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            {user.location?.region || 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <button className="text-emerald-600 hover:text-emerald-900 mr-4">
                                                Edit
                                            </button>
                                            <button className="text-red-600 hover:text-red-900">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
