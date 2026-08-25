'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DetectionService } from '@/lib/firebase/firestore';
import { DiseaseDetection, DISEASE_DISPLAY_NAMES } from '@/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

export default function ExpertReviewPage() {
    const { user } = useAuth();
    const [selectedDetection, setSelectedDetection] = useState<DiseaseDetection | null>(null);

    // Fetch pending reviews
    const { data: pendingReviews = [], isLoading, isError } = useQuery({
        queryKey: ['pendingReviews'],
        queryFn: async () => {
            const reviews = await DetectionService.getPendingReviews();
            return reviews as DiseaseDetection[];
        }
    });

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-extrabold text-emerald-950 mb-3 tracking-tight">
                        Expert Review Queue
                    </h1>
                    <p className="text-lg text-emerald-700/80 font-medium">
                        Review detections with confidence below 70% threshold
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <h3 className="text-sm font-medium text-emerald-700/70 mb-2">Pending Reviews</h3>
                        <p className="text-4xl font-extrabold text-yellow-600">
                            {isLoading ? '...' : pendingReviews.length}
                        </p>
                    </Card>
                    <Card>
                        <h3 className="text-sm font-medium text-emerald-700/70 mb-2">Avg Confidence</h3>
                        <p className="text-4xl font-extrabold text-orange-600">
                            {pendingReviews.length > 0
                                ? Math.round(
                                    (pendingReviews.reduce(
                                        (sum, d) => sum + (d.mlClassification?.confidence || 0),
                                        0
                                    ) /
                                        pendingReviews.length) *
                                    100
                                )
                                : 0}
                            %
                        </p>
                    </Card>
                    <Card>
                        <h3 className="text-sm font-medium text-emerald-700/70 mb-2">Today&apos;s Reviews</h3>
                        <p className="text-4xl font-extrabold text-emerald-600">0</p>
                    </Card>
                </div>

                {/* Review Cards */}
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                    </div>
                ) : isError ? (
                    <Card className="p-16 text-center bg-red-50/40 border-dashed border-2 border-red-200 shadow-none">
                        <div className="text-6xl mb-6">⚠️</div>
                        <h2 className="text-2xl font-bold text-red-900 mb-2">
                            Failed to load reviews
                        </h2>
                        <p className="text-red-700/70">
                            There was an error fetching the data. Please try again later.
                        </p>
                    </Card>
                ) : pendingReviews.length === 0 ? (
                    <Card className="p-16 text-center bg-emerald-50/40 border-dashed border-2 border-emerald-200 shadow-none">
                        <div className="text-6xl mb-6">✅</div>
                        <h2 className="text-2xl font-bold text-emerald-950 mb-2">
                            All Caught Up!
                        </h2>
                        <p className="text-emerald-700/70">
                            No pending expert reviews at the moment. Great job!
                        </p>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {pendingReviews.map((detection) => (
                            <DetectionCard
                                key={detection.id}
                                detection={detection}
                                onSelect={() => setSelectedDetection(detection)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Review Modal */}
            <ReviewModal
                isOpen={!!selectedDetection}
                detection={selectedDetection}
                onClose={() => setSelectedDetection(null)}
                expertId={user?.uid}
            />
        </div>
    );
}

function DetectionCard({
    detection,
    onSelect,
}: {
    detection: DiseaseDetection;
    onSelect: () => void;
}) {
    const confidence = Math.round((detection.mlClassification?.confidence || 0) * 100);
    const diseaseName = detection.mlClassification?.disease ? (DISEASE_DISPLAY_NAMES[detection.mlClassification.disease] || 'Unknown') : 'Unknown';

    return (
        <Card className="p-0 overflow-hidden group hover:-translate-y-1 transition-transform duration-300 flex flex-col">
            <div className="aspect-video bg-emerald-100/50 relative overflow-hidden">
                <Image
                    src={detection.imageUrl || '/placeholder.jpg'}
                    alt="Detection"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-yellow-700 px-3 py-1 rounded-full text-xs font-bold shadow-sm flex items-center gap-1 border border-yellow-200">
                    ⚠️ {confidence}% Conf.
                </div>
            </div>

            <div className="p-5 flex flex-col flex-1">
                <div className="mb-4">
                    <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1 block">AI Prediction</span>
                    <h3 className="text-xl font-bold text-emerald-950">{diseaseName}</h3>
                    <p className="text-xs text-emerald-500 mt-1">ID: {detection.detectionId?.slice(0, 8) || 'Unknown'}</p>
                </div>

                <div className="space-y-2 text-sm text-emerald-800 mb-6 flex-1 bg-emerald-50/50 border border-emerald-100 rounded-lg p-3">
                    <p className="flex items-center gap-2">📍 {detection.location?.latitude?.toFixed(4)}, {detection.location?.longitude?.toFixed(4)}</p>
                    <p className="flex items-center gap-2">👨‍🌾 Farmer: {detection.farmerId?.slice(0, 8) || 'Unknown'}</p>
                    <p className="flex items-center gap-2">🕒 {detection.timestamp?.toDate ? new Date(detection.timestamp.toDate()).toLocaleString() : 'Recent'}</p>
                </div>

                <Button onClick={onSelect} className="w-full">
                    Review Detection
                </Button>
            </div>
        </Card>
    );
}

function ReviewModal({
    isOpen,
    detection,
    onClose,
    expertId
}: {
    isOpen: boolean;
    detection: DiseaseDetection | null;
    onClose: () => void;
    expertId?: string;
}) {
    const queryClient = useQueryClient();
    const [confirmedDisease, setConfirmedDisease] = useState<string>('');
    const [notes, setNotes] = useState('');

    const mutation = useMutation({
        mutationFn: async () => {
            if (!detection || !expertId) return;
            await DetectionService.updateExpertReview(
                detection.id,
                expertId,
                confirmedDisease,
                notes
            );
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['pendingReviews'] });
            toast.success('Review submitted successfully');
            onClose();
            // Reset state
            setConfirmedDisease('');
            setNotes('');
        },
        onError: (error) => {
            console.error(error);
            toast.error('Failed to submit review');
        }
    });

    if (!detection) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Expert Review">
            <div className="space-y-6">
                <div className="aspect-video relative rounded-xl overflow-hidden bg-emerald-950 shadow-inner">
                    <Image
                        src={detection.imageUrl || '/placeholder.jpg'}
                        alt="Detection for review"
                        fill
                        className="object-contain"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                    <div>
                        <p className="text-xs text-emerald-600 font-semibold uppercase">AI Prediction</p>
                        <p className="text-lg font-bold text-emerald-950">{detection.mlClassification?.disease ? DISEASE_DISPLAY_NAMES[detection.mlClassification.disease] : 'Unknown'}</p>
                    </div>
                    <div>
                        <p className="text-xs text-emerald-600 font-semibold uppercase">Confidence</p>
                        <p className="text-lg font-bold text-emerald-950">{((detection.mlClassification?.confidence || 0) * 100).toFixed(1)}%</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-emerald-900 mb-2">Confirm Diagnosis</label>
                    <select 
                        className="w-full border border-emerald-200 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white text-emerald-950"
                        value={confirmedDisease}
                        onChange={(e) => setConfirmedDisease(e.target.value)}
                    >
                        <option value="" disabled>Select the confirmed disease...</option>
                        {Object.entries(DISEASE_DISPLAY_NAMES).map(([key, name]) => (
                            <option key={key} value={key}>{name}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-emerald-900 mb-2">Expert Notes</label>
                    <textarea 
                        className="w-full border border-emerald-200 rounded-lg p-3 h-32 resize-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-emerald-950"
                        placeholder="Provide details on the visual symptoms, recommended treatment, or reasons for overriding the AI prediction..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                    ></textarea>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-emerald-100">
                    <Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>
                        Cancel
                    </Button>
                    <Button 
                        onClick={() => mutation.mutate()} 
                        isLoading={mutation.isPending}
                        disabled={!confirmedDisease || !expertId}
                    >
                        Submit Review
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
