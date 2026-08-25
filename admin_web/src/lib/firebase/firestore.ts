import {
    collection,
    query,
    where,
    orderBy,
    limit,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    onSnapshot,
    QueryConstraint,
    Timestamp,
    DocumentSnapshot,
    QuerySnapshot,
    startAfter,
} from 'firebase/firestore';
import { db } from './config';

// Collection names
export const COLLECTIONS = {
    USERS: 'users',
    DETECTIONS: 'detections',
    SUPPLY_CHAIN_NODES: 'supply_chain_nodes',
    HARVEST_LOGS: 'harvest_logs',
} as const;

// Generic Firestore operations
export class FirestoreService {
    /**
     * Get all documents from a collection with optional filters
     */
    static async getDocuments<T>(
        collectionName: string,
        constraints: QueryConstraint[] = []
    ): Promise<T[]> {
        try {
            const collectionRef = collection(db, collectionName);
            const q = query(collectionRef, ...constraints);
            const snapshot = await getDocs(q);

            return snapshot.docs.map((doc: DocumentSnapshot) => ({
                id: doc.id,
                ...doc.data(),
            })) as T[];
        } catch (error) {
            console.error('Error getting documents:', error);
            throw error;
        }
    }

    /**
     * Add a new document to a collection
     */
    static async addDocument(
        collectionName: string,
        data: Record<string, unknown>
    ): Promise<string> {
        try {
            const collectionRef = collection(db, collectionName);
            const docRef = await addDoc(collectionRef, {
                ...data,
                createdAt: Timestamp.now(),
            });
            return docRef.id;
        } catch (error) {
            console.error('Error adding document:', error);
            throw error;
        }
    }

    /**
     * Update a document
     */
    static async updateDocument(
        collectionName: string,
        documentId: string,
        data: Record<string, unknown>
    ): Promise<void> {
        try {
            const docRef = doc(db, collectionName, documentId);
            await updateDoc(docRef, {
                ...data,
                updatedAt: Timestamp.now(),
            });
        } catch (error) {
            console.error('Error updating document:', error);
            throw error;
        }
    }

    /**
     * Delete a document
     */
    static async deleteDocument(
        collectionName: string,
        documentId: string
    ): Promise<void> {
        try {
            const docRef = doc(db, collectionName, documentId);
            await deleteDoc(docRef);
        } catch (error) {
            console.error('Error deleting document:', error);
            throw error;
        }
    }

    /**
     * Subscribe to real-time updates
     */
    static subscribeToCollection<T>(
        collectionName: string,
        callback: (data: T[]) => void,
        constraints: QueryConstraint[] = []
    ): () => void {
        const collectionRef = collection(db, collectionName);
        const q = query(collectionRef, ...constraints);

        return onSnapshot(q, (snapshot: QuerySnapshot) => {
            const data = snapshot.docs.map((doc: DocumentSnapshot) => ({
                id: doc.id,
                ...doc.data(),
            })) as T[];
            callback(data);
        });
    }

    /**
     * Get paginated documents from a collection
     */
    static async getPaginatedDocuments<T>(
        collectionName: string,
        pageSize: number = 20,
        lastVisibleDoc?: DocumentSnapshot | null,
        additionalConstraints: QueryConstraint[] = []
    ): Promise<{ data: T[], lastDoc: DocumentSnapshot | null }> {
        try {
            const collectionRef = collection(db, collectionName);
            const constraints = [...additionalConstraints];
            
            if (lastVisibleDoc) {
                constraints.push(startAfter(lastVisibleDoc));
            }
            
            constraints.push(limit(pageSize));
            
            const q = query(collectionRef, ...constraints);
            const snapshot = await getDocs(q);

            const data = snapshot.docs.map((doc: DocumentSnapshot) => ({
                id: doc.id,
                ...doc.data(),
            })) as T[];

            return {
                data,
                lastDoc: snapshot.docs[snapshot.docs.length - 1] || null
            };
        } catch (error) {
            console.error('Error getting paginated documents:', error);
            throw error;
        }
    }
}

// Disease Detection specific operations
export const DetectionService = {
    async getAllDetections() {
        return FirestoreService.getDocuments(
            COLLECTIONS.DETECTIONS,
            [orderBy('timestamp', 'desc'), limit(100)]
        );
    },

    async getPendingReviews() {
        return FirestoreService.getDocuments(
            COLLECTIONS.DETECTIONS,
            [
                where('status', '==', 'pending_review'),
                orderBy('timestamp', 'desc'),
            ]
        );
    },

    async updateExpertReview(
        detectionId: string,
        expertId: string,
        confirmedDisease: string,
        notes: string
    ) {
        return FirestoreService.updateDocument(COLLECTIONS.DETECTIONS, detectionId, {
            expertReview: {
                expertId,
                confirmedDisease,
                notes,
                reviewedAt: Timestamp.now(),
            },
            status: 'confirmed',
        });
    },
};

// User management operations
export const UserService = {
    async getAllUsers(pageSize: number = 20, lastDoc?: DocumentSnapshot | null) {
        return FirestoreService.getPaginatedDocuments(COLLECTIONS.USERS, pageSize, lastDoc);
    },

    async getUsersByRole(role: 'farmer' | 'expert' | 'admin') {
        return FirestoreService.getDocuments(
            COLLECTIONS.USERS,
            [where('role', '==', role)]
        );
    },
};

// Supply chain operations
export const SupplyChainService = {
    async getAllNodes(pageSize: number = 20, lastDoc?: DocumentSnapshot | null) {
        return FirestoreService.getPaginatedDocuments(COLLECTIONS.SUPPLY_CHAIN_NODES, pageSize, lastDoc);
    },

    async updatePrices(
        nodeId: string,
        prices: Array<{
            qualityGrade: string;
            pricePerKg: number;
        }>
    ) {
        return FirestoreService.updateDocument(
            COLLECTIONS.SUPPLY_CHAIN_NODES,
            nodeId,
            {
                currentPrices: prices.map((price) => ({
                    ...price,
                    lastUpdated: Timestamp.now(),
                })),
            }
        );
    },
};
