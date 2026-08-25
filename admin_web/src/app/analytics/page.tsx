import { unstable_cache } from 'next/cache';
import AnalyticsClient from './AnalyticsClient';

// Simulate a database call that we want to cache via ISR
const getAnalyticsData = unstable_cache(
    async () => {
        // In a real application, this would be a heavy Firestore or SQL query
        // We simulate a 500ms database delay
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        return {
            detectionAccuracy: [
                { month: 'Jan', accuracy: 82 },
                { month: 'Feb', accuracy: 85 },
                { month: 'Mar', accuracy: 87 },
                { month: 'Apr', accuracy: 86 },
                { month: 'May', accuracy: 91 },
                { month: 'Jun', accuracy: 93 },
            ],
            priceFluctuations: [
                { month: 'Jan', premium: 120, standard: 90, low: 50 },
                { month: 'Feb', premium: 125, standard: 95, low: 55 },
                { month: 'Mar', premium: 110, standard: 85, low: 45 },
                { month: 'Apr', premium: 130, standard: 100, low: 60 },
                { month: 'May', premium: 140, standard: 110, low: 65 },
                { month: 'Jun', premium: 135, standard: 105, low: 60 },
            ],
            userActivity: [
                { day: 'Mon', farmers: 45, experts: 12 },
                { day: 'Tue', farmers: 52, experts: 15 },
                { day: 'Wed', farmers: 49, experts: 14 },
                { day: 'Thu', farmers: 63, experts: 18 },
                { day: 'Fri', farmers: 58, experts: 16 },
                { day: 'Sat', farmers: 30, experts: 5 },
                { day: 'Sun', farmers: 35, experts: 8 },
            ]
        };
    },
    ['global-analytics-data'], // Cache key
    { revalidate: 60 } // ISR: Revalidate every 60 seconds
);

export default async function AnalyticsPage() {
    // This runs on the server. The result is cached by Next.js.
    const data = await getAnalyticsData();

    return (
        <div className="min-h-screen bg-background">
            <AnalyticsClient data={data} />
        </div>
    );
}

