import { Timestamp } from 'firebase/firestore';

// Disease types
export enum DiseaseType {
    BUD_ROT = 'bud_rot',
    STEM_BLEEDING = 'stem_bleeding',
    GRAY_LEAF_SPOT = 'gray_leaf_spot',
    WCLWD = 'wclwd',
    HEALTHY = 'healthy',
}

export const DISEASE_DISPLAY_NAMES: Record<DiseaseType, string> = {
    [DiseaseType.BUD_ROT]: 'Bud Rot',
    [DiseaseType.STEM_BLEEDING]: 'Stem Bleeding',
    [DiseaseType.GRAY_LEAF_SPOT]: 'Gray Leaf Spot',
    [DiseaseType.WCLWD]: 'Wilt Disease (WCLWD)',
    [DiseaseType.HEALTHY]: 'Healthy',
};

// User types
export interface User {
    id: string;
    uid: string;
    role: 'farmer' | 'expert' | 'admin';
    name: string;
    email: string;
    phone: string;
    location: {
        lat: number;
        lng: number;
        region: string;
    };
    createdAt: Timestamp; // Firestore Timestamp
    farms?: Array<{
        farmId: string;
        area: number;
        treeCount: number;
    }>;
}

// Disease detection types
export interface DiseaseDetection {
    id: string;
    detectionId: string;
    farmerId: string;
    imageUrl: string;
    timestamp: Timestamp; // Firestore Timestamp
    location: {
        latitude: number;
        longitude: number;
    };
    mlClassification: {
        disease: DiseaseType;
        confidence: number;
        modelVersion: string;
    };
    expertReview?: {
        expertId: string;
        confirmedDisease: string;
        notes: string;
        reviewedAt: Timestamp; // Firestore Timestamp
    };
    status: 'pending_review' | 'confirmed' | 'false_positive';
    referredToExpert: boolean;
}

// Supply chain node types
export interface SupplyChainNode {
    id: string;
    nodeId: string;
    type: 'farmer' | 'collector' | 'distributor' | 'wholesaler' | 'retailer';
    name: string;
    location: {
        latitude: number;
        longitude: number;
    };
    contactInfo: {
        phone: string;
        email?: string;
    };
    currentPrices?: Array<{
        qualityGrade: 'premium' | 'standard' | 'low';
        pricePerKg: number;
        lastUpdated: Timestamp; // Firestore Timestamp
    }>;
}

// Harvest log types
export interface HarvestLog {
    id: string;
    logId: string;
    farmerId: string;
    harvestDate: Timestamp; // Firestore Timestamp
    quantity: number; // kg
    qualityGrade: 'premium' | 'standard' | 'low';
    soldTo?: string; // nodeId
    pricePerKg?: number;
    totalRevenue?: number;
}

// Dashboard stats
export interface DashboardStats {
    totalDetections: number;
    activeFarmers: number;
    pendingReviews: number;
    supplyNodes: number;
    diseaseBreakdown: Record<DiseaseType, number>;
}
