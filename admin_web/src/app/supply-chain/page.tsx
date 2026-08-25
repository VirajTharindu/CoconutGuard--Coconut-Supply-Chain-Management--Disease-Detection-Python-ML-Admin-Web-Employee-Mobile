'use client';

import { useState } from 'react';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { SupplyChainService, FirestoreService, COLLECTIONS } from '@/lib/firebase/firestore';
import { SupplyChainNode } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { DocumentSnapshot } from 'firebase/firestore';

export default function SupplyChainPage() {
    const [filter, setFilter] = useState<string>('all');
    const [isAddNodeModalOpen, setIsAddNodeModalOpen] = useState(false);

    const { 
        data, 
        isLoading, 
        isError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['supplyChainNodes'],
        queryFn: async ({ pageParam = null }) => {
            return await SupplyChainService.getAllNodes(20, pageParam as DocumentSnapshot | null);
        },
        getNextPageParam: (lastPage: { data: unknown[], lastDoc: DocumentSnapshot | null }) => lastPage.lastDoc || undefined,
        initialPageParam: null as DocumentSnapshot | null,
    });

    const nodes = data?.pages.flatMap((page) => page.data as SupplyChainNode[]) || [];

    const filteredNodes = filter === 'all' 
        ? nodes 
        : nodes.filter((node) => node.type === filter);

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-extrabold text-emerald-950 mb-3 tracking-tight">
                            Supply Chain Management
                        </h1>
                        <p className="text-lg text-emerald-700/80 font-medium">Manage supply nodes and track coconut distribution</p>
                    </div>
                    <Button onClick={() => setIsAddNodeModalOpen(true)}>
                        + Add Node
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
                    <StatCard title="Total Nodes" count={isLoading ? '...' : nodes.length} icon="🏭" color="bg-blue-500" />
                    <StatCard title="Farmers" count={isLoading ? '...' : nodes.filter(n => n.type === 'farmer').length} icon="🧑‍🌾" color="bg-emerald-600" />
                    <StatCard title="Collectors" count={isLoading ? '...' : nodes.filter(n => n.type === 'collector').length} icon="📦" color="bg-yellow-500" />
                    <StatCard title="Wholesalers" count={isLoading ? '...' : nodes.filter(n => n.type === 'wholesaler').length} icon="🏪" color="bg-purple-500" />
                    <StatCard title="Retailers" count={isLoading ? '...' : nodes.filter(n => n.type === 'retailer').length} icon="🛒" color="bg-pink-500" />
                </div>

                {/* Filter Tabs */}
                <div className="bg-emerald-100/60 backdrop-blur-md rounded-xl p-2 flex flex-wrap gap-2 w-fit mb-6 shadow-sm border border-emerald-200/80">
                    {['all', 'farmer', 'collector', 'wholesaler', 'retailer'].map((type) => (
                        <button
                            key={type}
                            onClick={() => setFilter(type)}
                            className={`px-5 py-2 rounded-lg text-sm font-semibold capitalize transition-all duration-200 ${filter === type
                                    ? 'bg-emerald-600 text-white shadow-md'
                                    : 'text-emerald-800 hover:bg-emerald-200/60'
                                }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Node List */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                    </div>
                ) : isError ? (
                    <Card className="p-16 text-center bg-red-50/40 border-dashed border-2 border-red-200 shadow-none flex flex-col items-center">
                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">⚠️</div>
                        <h2 className="text-2xl font-bold text-red-900 mb-2">Failed to load nodes</h2>
                        <p className="text-red-700/70 mb-6 max-w-md">There was an error fetching the supply chain data. Please try again.</p>
                    </Card>
                ) : filteredNodes.length === 0 ? (
                    <Card className="p-16 text-center bg-emerald-50/40 border-dashed border-2 border-emerald-200 shadow-none flex flex-col items-center">
                        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center text-4xl mb-6 shadow-inner">📦</div>
                        <h2 className="text-2xl font-bold text-emerald-950 mb-2">No Supply Chain Nodes</h2>
                        <p className="text-emerald-700/70 mb-6 max-w-md">Add nodes to start tracking the supply chain flow and monitoring prices across the network.</p>
                        <Button onClick={() => setIsAddNodeModalOpen(true)}>Add First Node</Button>
                    </Card>
                ) : (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredNodes.map((node) => (
                                <NodeCard key={node.id} node={node} />
                            ))}
                        </div>
                        {hasNextPage && filter === 'all' && (
                            <div className="flex justify-center mt-8">
                                <Button 
                                    onClick={() => fetchNextPage()} 
                                    isLoading={isFetchingNextPage}
                                    variant="secondary"
                                >
                                    Load More Nodes
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <AddNodeModal isOpen={isAddNodeModalOpen} onClose={() => setIsAddNodeModalOpen(false)} />
        </div>
    );
}

function StatCard({ title, count, icon, color }: { title: string; count: number | string; icon: string; color: string }) {
    return (
        <Card className="p-5 flex flex-col items-center text-center justify-center">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl text-white shadow-inner mb-3 ${color}`}>
                {icon}
            </div>
            <p className="text-2xl font-extrabold text-emerald-950 leading-tight mb-1">{count}</p>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-600">{title}</h3>
        </Card>
    );
}

function NodeCard({ node }: { node: SupplyChainNode }) {
    const typeColors: Record<string, string> = {
        farmer: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        collector: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        distributor: 'bg-blue-100 text-blue-800 border-blue-200',
        wholesaler: 'bg-purple-100 text-purple-800 border-purple-200',
        retailer: 'bg-pink-100 text-pink-800 border-pink-200',
    };

    return (
        <Card className="flex flex-col h-full group">
            <div className="flex items-start justify-between mb-4 gap-2">
                <h3 className="text-lg font-bold text-emerald-950 leading-tight group-hover:text-emerald-700 transition-colors line-clamp-2">{node.name}</h3>
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold capitalize border whitespace-nowrap ${typeColors[node.type]}`}>
                    {node.type}
                </span>
            </div>

            <div className="space-y-2 text-sm text-emerald-800 mb-6 flex-1 bg-emerald-50/50 border border-emerald-100 rounded-lg p-3">
                <p className="flex items-center gap-2 truncate" title={`${node.location.latitude}, ${node.location.longitude}`}>
                    <span className="text-emerald-500">📍</span> {node.location.latitude.toFixed(4)}, {node.location.longitude.toFixed(4)}
                </p>
                <p className="flex items-center gap-2">
                    <span className="text-emerald-500">📞</span> {node.contactInfo.phone}
                </p>
                {node.contactInfo.email && (
                    <p className="flex items-center gap-2 truncate" title={node.contactInfo.email}>
                        <span className="text-emerald-500">📧</span> {node.contactInfo.email}
                    </p>
                )}
            </div>

            {node.currentPrices && node.currentPrices.length > 0 && (
                <div className="border-t border-emerald-100 pt-4 mb-4">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-600 mb-3">Current Prices (₹/kg)</h4>
                    <div className="space-y-2">
                        {node.currentPrices.map((price, idx) => (
                            <div key={idx} className="flex justify-between items-center text-sm bg-emerald-50/70 border border-emerald-100 px-2.5 py-1.5 rounded-lg">
                                <span className="capitalize text-emerald-800 font-medium">{price.qualityGrade}</span>
                                <span className="font-bold text-emerald-700">₹{price.pricePerKg}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-auto pt-4 grid grid-cols-2 gap-3">
                <Button variant="secondary" className="py-2 text-xs">Edit Node</Button>
                <Button variant="ghost" className="py-2 text-xs">Details</Button>
            </div>
        </Card>
    );
}

function AddNodeModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const queryClient = useQueryClient();
    const [name, setName] = useState('');
    const [type, setType] = useState<'farmer' | 'collector' | 'wholesaler' | 'retailer'>('farmer');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    const mutation = useMutation({
        mutationFn: async () => {
            const newNode = {
                nodeId: 'NODE-' + Date.now().toString().slice(-6),
                name,
                type,
                location: { latitude: 7.87, longitude: 80.77 }, // Default
                contactInfo: { phone, email }
            };
            await FirestoreService.addDocument(COLLECTIONS.SUPPLY_CHAIN_NODES, newNode);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['supplyChainNodes'] });
            toast.success('Supply node added successfully');
            onClose();
            setName(''); setPhone(''); setEmail(''); setType('farmer');
        },
        onError: (error) => {
            console.error('Error adding node:', error);
            toast.error('Failed to add supply node');
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add Supply Chain Node">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-emerald-900 mb-1">Entity Name</label>
                    <input type="text" required value={name} onChange={e => setName(e.target.value)} className="w-full border border-emerald-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-950" placeholder="Coconut Co." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-emerald-900 mb-1">Node Type</label>
                        <select value={type} onChange={e => setType(e.target.value as 'farmer' | 'collector' | 'wholesaler' | 'retailer')} className="w-full border border-emerald-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-emerald-950">
                            <option value="farmer">Farmer</option>
                            <option value="collector">Collector</option>
                            <option value="wholesaler">Wholesaler</option>
                            <option value="retailer">Retailer</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-emerald-900 mb-1">Phone Number</label>
                        <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-emerald-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-950" placeholder="+94 XX XXX XXXX" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-emerald-900 mb-1">Email Address (Optional)</label>
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full border border-emerald-200 rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-950" placeholder="contact@example.com" />
                </div>
                
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex gap-3 items-start mt-4">
                    <span className="text-xl">ℹ️</span>
                    <p className="text-sm text-emerald-800">You can add exact GPS coordinates and configure real-time prices after creating the node via the Edit Node panel.</p>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-emerald-100 mt-6">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={mutation.isPending}>Cancel</Button>
                    <Button type="submit" isLoading={mutation.isPending}>Add Node</Button>
                </div>
            </form>
        </Modal>
    );
}
