'use client';

import { useState, useEffect } from 'react';
import { SupplyChainService } from '@/lib/firebase/firestore';
import { SupplyChainNode } from '@/types';

export default function SupplyChainPage() {
    const [nodes, setNodes] = useState<SupplyChainNode[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        loadNodes();
    }, []);

    const loadNodes = async () => {
        setLoading(true);
        try {
            const allNodes = await SupplyChainService.getAllNodes();
            setNodes(allNodes as SupplyChainNode[]);
        } catch (error) {
            console.error('Error loading supply chain nodes:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredNodes =
        filter === 'all' ? nodes : nodes.filter((node) => node.type === filter);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        🏭 Supply Chain Management
                    </h1>
                    <p className="text-gray-600">
                        Manage supply nodes and track coconut distribution
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                    <StatCard
                        title="Total Nodes"
                        count={nodes.length}
                        icon="🏭"
                        color="bg-blue-500"
                    />
                    <StatCard
                        title="Farmers"
                        count={nodes.filter((n) => n.type === 'farmer').length}
                        icon="🧑‍🌾"
                        color="bg-green-500"
                    />
                    <StatCard
                        title="Collectors"
                        count={nodes.filter((n) => n.type === 'collector').length}
                        icon="📦"
                        color="bg-yellow-500"
                    />
                    <StatCard
                        title="Wholesalers"
                        count={nodes.filter((n) => n.type === 'wholesaler').length}
                        icon="🏪"
                        color="bg-purple-500"
                    />
                    <StatCard
                        title="Retailers"
                        count={nodes.filter((n) => n.type === 'retailer').length}
                        icon="🛒"
                        color="bg-pink-500"
                    />
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-lg shadow mb-6 p-2 flex gap-2">
                    {['all', 'farmer', 'collector', 'wholesaler', 'retailer'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${filter === type
                                    ? 'bg-emerald-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Node List */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Loading supply chain nodes...</p>
                    </div>
                ) : filteredNodes.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">
                            No Supply Chain Nodes
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Add nodes to start tracking the supply chain
                        </p>
                        <button className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700">
                            Add New Node
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredNodes.map((node) => (
                            <NodeCard key={node.id} node={node} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

// Stat Card
function StatCard({
    title,
    count,
    icon,
    color,
}: {
    title: string;
    count: number;
    icon: string;
    color: string;
}) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">{title}</h3>
                <span className={`${color} text-white px-2 py-1 rounded-lg text-xl`}>
                    {icon}
                </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{count}</p>
        </div>
    );
}

// Node Card
function NodeCard({ node }: { node: SupplyChainNode }) {
    const typeColors: Record<string, string> = {
        farmer: 'bg-green-100 text-green-800',
        collector: 'bg-yellow-100 text-yellow-800',
        distributor: 'bg-blue-100 text-blue-800',
        wholesaler: 'bg-purple-100 text-purple-800',
        retailer: 'bg-pink-100 text-pink-800',
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">{node.name}</h3>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${typeColors[node.type]
                        }`}
                >
                    {node.type}
                </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
                <p className="flex items-center gap-2">
                    📍 {node.location.latitude.toFixed(4)}, {node.location.longitude.toFixed(4)}
                </p>
                <p className="flex items-center gap-2">
                    📞 {node.contactInfo.phone}
                </p>
                {node.contactInfo.email && (
                    <p className="flex items-center gap-2">
                        📧 {node.contactInfo.email}
                    </p>
                )}
            </div>

            {/* Current Prices */}
            {node.currentPrices && node.currentPrices.length > 0 && (
                <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">
                        Current Prices
                    </h4>
                    <div className="space-y-1">
                        {node.currentPrices.map((price, idx) => (
                            <div
                                key={idx}
                                className="flex justify-between text-sm"
                            >
                                <span className="capitalize text-gray-600">
                                    {price.qualityGrade}:
                                </span>
                                <span className="font-semibold text-emerald-600">
                                    ₹{price.pricePerKg}/kg
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2">
                <button className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium hover:bg-emerald-100">
                    Edit
                </button>
                <button className="px-4 py-2 bg-gray-50 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-100">
                    View Details
                </button>
            </div>
        </div>
    );
}
