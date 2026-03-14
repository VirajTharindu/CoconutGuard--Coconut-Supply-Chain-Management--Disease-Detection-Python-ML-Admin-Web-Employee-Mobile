import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore/lite';

export const runtime = 'edge';

export async function GET() {
    try {
        const detectionsRef = collection(db, 'detections');
        const q = query(detectionsRef, orderBy('timestamp', 'desc'), limit(5));
        const querySnapshot = await getDocs(q);

        const detections = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json({
            detections,
            count: detections.length,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.warn('Firebase Recent Detections Error (Falling back to Demo Data):', error);
        
        // Mock data for demo/development
        const mockDetections = [
            { id: 'mock-1', location: 'Trincomalee', label: 'bud_rot', confidence: 0.95, status: 'verified', timestamp: new Date().toISOString() },
            { id: 'mock-2', location: 'Kurunegala', label: 'leaf_rot', confidence: 0.82, status: 'pending', timestamp: new Date(Date.now() - 86400000).toISOString() },
            { id: 'mock-3', location: 'Galle', label: 'grey_leaf_spot', confidence: 0.78, status: 'verified', timestamp: new Date(Date.now() - 172800000).toISOString() },
        ];

        return NextResponse.json({
            detections: mockDetections,
            count: mockDetections.length,
            timestamp: new Date().toISOString(),
            isDemo: true
        });
    }
}
