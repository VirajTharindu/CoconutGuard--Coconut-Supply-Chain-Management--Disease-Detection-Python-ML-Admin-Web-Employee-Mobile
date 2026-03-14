import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase/config';
import { collection, getCount, query, where } from 'firebase/firestore/lite';

export const runtime = 'edge';

export async function GET() {
    try {
        const [detectionsCount, farmersCount, expertsCount, nodesCount] = await Promise.all([
            getCount(collection(db, 'detections')),
            getCount(query(collection(db, 'users'), where('role', '==', 'farmer'))),
            getCount(query(collection(db, 'users'), where('role', '==', 'expert'))),
            getCount(collection(db, 'supply_chain_nodes')),
        ]);

        return NextResponse.json({
            detections: detectionsCount.data().count,
            farmers: farmersCount.data().count,
            experts: expertsCount.data().count,
            nodes: nodesCount.data().count,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.warn('Firebase Stats Error (Falling back to Demo Data):', error);
        
        // Mock data for demo/development when Firebase is not configured
        return NextResponse.json({
            detections: 124,
            farmers: 45,
            experts: 12,
            nodes: 8,
            timestamp: new Date().toISOString(),
            isDemo: true
        });
    }
}
