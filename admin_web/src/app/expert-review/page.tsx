'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { DetectionService } from '@/lib/firebase/firestore';
import { DiseaseDetection, DISEASE_DISPLAY_NAMES } from '@/types';

export default function ExpertReviewPage() {
    const [pendingReviews, setPendingReviews] = useState<DiseaseDetection[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDetection, setSelectedDetection] = useState<DiseaseDetection | null>(null);

    useEffect(() => {
        loadPendingReviews();
    }, []);

    const loadPendingReviews = async () => {
        setLoading(true);
        try {
            const reviews = await DetectionService.getPendingReviews();
            setPendingReviews(reviews as DiseaseDetection[]);
        } catch (error) {
            console.error('Error loading pending reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        👨‍⚕️ Expert Review Queue
                    </h1>
                    <p className="text-gray-600">
                        Review detections with confidence below 70% threshold
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500">Pending Reviews</h3>
                        <p className="text-3xl font-bold text-yellow-600 mt-2">
                            {pendingReviews.length}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500">Avg Confidence</h3>
                        <p className="text-3xl font-bold text-orange-600 mt-2">
                            {pendingReviews.length > 0
                                ? Math.round(
                                    (pendingReviews.reduce(
                                        (sum, d) => sum + d.mlClassification.confidence,
                                        0
                                    ) /
                                        pendingReviews.length) *
                                    100
                                )
                                : 0}
                            %
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-sm font-medium text-gray-500">Today&apos;s Reviews</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">0</p>
                    </div>
                </div>

                {/* Review Cards */}
                {loading ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Loading pending reviews...</p>
                    </div>
                ) : pendingReviews.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                        <div className="text-6xl mb-4">✅</div>
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">
                            All Caught Up!
                        </h2>
                        <p className="text-gray-500">
                            No pending expert reviews at the moment
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

            {/* Review Modal (simplified) */}
            {selectedDetection && (
                <ReviewModal
                    detection={selectedDetection}
                    onClose={() => setSelectedDetection(null)}
                    onReviewed={loadPendingReviews}
                />
            )}
        </div>
    );
}

// Detection Card Component
function DetectionCard({
    detection,
    onSelect,
}: {
    detection: DiseaseDetection;
    onSelect: () => void;
}) {
    const confidence = Math.round(detection.mlClassification.confidence * 100);
    const diseaseName = DISEASE_DISPLAY_NAMES[detection.mlClassification.disease];

    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
            <div className="aspect-video bg-gray-200 relative">
                <Image
                    src={detection.imageUrl || '/placeholder.jpg'}
                    alt="Detection"
                    fill
                    className="object-cover"
                />
                <div className="absolute top-2 right-2 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                    {confidence}% Confidence
                </div>
            </div>

            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{diseaseName}</h3>
                    <span className="text-sm text-gray-500">
                        ID: {detection.detectionId.slice(0, 8)}
                    </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>
                        📍 Location: {detection.location.latitude.toFixed(4)},{' '}
                        {detection.location.longitude.toFixed(4)}
                    </p>
                    <p>👨‍🌾 Farmer ID: {detection.farmerId.slice(0, 12)}</p>
                    <p>
                        🕒 Detected:{' '}
                        {new Date(detection.timestamp?.toDate()).toLocaleString()}
                    </p>
                </div>

                <button
                    onClick={onSelect}
                    className="w-full bg-emerald-600 text-white py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                    Review Detection
                </button>
            </div>
        </div>
    );
}

// Review Modal Component (simplified placeholder)
function ReviewModal({
    onClose,
}: {
    detection: DiseaseDetection;
    onClose: () => void;
    onReviewed: () => void;
}) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
                <h2 className="text-2xl font-bold mb-4">Review Detection</h2>
                <p className="text-gray-600 mb-4">
                    Expert review interface coming soon. This will include:
                </p>
                <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
                    <li>Image zoom functionality</li>
                    <li>Disease confirmation dropdown</li>
                    <li>Notes input field</li>
                    <li>Submit/Reject buttons</li>
                </ul>
                <button
                    onClick={onClose}
                    className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700"
                >
                    Close
                </button>
            </div>
        </div>
    );
}
