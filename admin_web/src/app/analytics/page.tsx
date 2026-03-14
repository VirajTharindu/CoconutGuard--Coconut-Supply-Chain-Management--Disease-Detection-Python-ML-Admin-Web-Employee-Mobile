'use client';



export default function AnalyticsPage() {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">
                    📈 Analytics Dashboard
                </h1>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <MetricCard
                        title="Detection Accuracy"
                        value="0%"
                        trend="+0%"
                        positive={true}
                    />
                    <MetricCard
                        title="Avg Response Time"
                        value="0h"
                        trend="-0%"
                        positive={true}
                    />
                    <MetricCard
                        title="Disease Recovery Rate"
                        value="0%"
                        trend="+0%"
                        positive={true}
                    />
                    <MetricCard
                        title="Supply Chain Efficiency"
                        value="0%"
                        trend="+0%"
                        positive={true}
                    />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <ChartCard title="Disease Detection Trends (30 Days)" />
                    <ChartCard title="Geographic Distribution" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <ChartCard title="ML Model Performance" />
                    <ChartCard title="Price Fluctuations" />
                    <ChartCard title="User Activity" />
                </div>
            </div>
        </div>
    );
}

function MetricCard({
    title,
    value,
    trend,
    positive,
}: {
    title: string;
    value: string;
    trend: string;
    positive: boolean;
}) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
            <div className="flex items-end justify-between">
                <p className="text-3xl font-bold text-gray-900">{value}</p>
                <span
                    className={`text-sm font-semibold ${positive ? 'text-green-600' : 'text-red-600'
                        }`}
                >
                    {trend}
                </span>
            </div>
        </div>
    );
}

function ChartCard({ title }: { title: string }) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">{title}</h3>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
                <p className="text-gray-500 text-center">
                    Chart visualization coming soon
                    <br />
                    <span className="text-sm">Integration with Chart.js or Recharts</span>
                </p>
            </div>
        </div>
    );
}
