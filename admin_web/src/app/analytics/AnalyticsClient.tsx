'use client';

import { Card } from '@/components/ui/Card';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from 'recharts';

type AnalyticsData = {
    detectionAccuracy: { month: string; accuracy: number }[];
    priceFluctuations: { month: string; premium: number; standard: number; low: number }[];
    userActivity: { day: string; farmers: number; experts: number }[];
};

export default function AnalyticsClient({ data }: { data: AnalyticsData }) {
    return (
        <div className="container mx-auto px-4 py-8 max-w-7xl">
            <header className="mb-8">
                <h1 className="text-4xl font-extrabold text-emerald-950 mb-3 tracking-tight">
                    Analytics Dashboard (ISR)
                </h1>
                <p className="text-lg text-emerald-700/80 font-medium">
                    Deep dive into system performance and metrics
                </p>
                <p className="text-sm text-emerald-600 mt-2">
                    Data statically generated and revalidated every 60 seconds (ISR).
                </p>
            </header>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <MetricCard
                    title="Model Accuracy"
                    value="93.2%"
                    trend="+2.1% this month"
                    positive={true}
                />
                <MetricCard
                    title="Avg Response Time"
                    value="1.2s"
                    trend="-0.3s this week"
                    positive={true}
                />
                <MetricCard
                    title="Disease Recovery Rate"
                    value="78%"
                    trend="+5% this quarter"
                    positive={true}
                />
                <MetricCard
                    title="Supply Chain Efficiency"
                    value="91%"
                    trend="Stable"
                    positive={true}
                />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card className="flex flex-col h-[400px]">
                    <h3 className="text-lg font-bold text-emerald-900 mb-6">ML Model Accuracy Trend</h3>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.detectionAccuracy}>
                                <defs>
                                    <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1fae5" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#065f46', fontSize: 12 }} dy={10} />
                                <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#065f46', fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #d1fae5', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: '#f0fdf4' }} />
                                <Area type="monotone" dataKey="accuracy" stroke="#10b981" fillOpacity={1} fill="url(#colorAccuracy)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="flex flex-col h-[400px]">
                    <h3 className="text-lg font-bold text-emerald-900 mb-6">User Activity (Weekly)</h3>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.userActivity}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1fae5" />
                                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#065f46', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#065f46', fontSize: 12 }} />
                                <Tooltip cursor={{ fill: '#ecfdf5' }} contentStyle={{ borderRadius: '12px', border: '1px solid #d1fae5', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: '#f0fdf4' }} />
                                <Legend verticalAlign="top" height={36} />
                                <Bar dataKey="farmers" name="Active Farmers" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="experts" name="Active Experts" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <Card className="flex flex-col h-[400px]">
                    <h3 className="text-lg font-bold text-emerald-900 mb-6">Coconut Price Fluctuations (₹/kg)</h3>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data.priceFluctuations}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1fae5" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#065f46', fontSize: 12 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#065f46', fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #d1fae5', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: '#f0fdf4' }} />
                                <Legend verticalAlign="top" height={36} />
                                <Line type="monotone" dataKey="premium" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="standard" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                                <Line type="monotone" dataKey="low" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
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
        <Card className="flex flex-col justify-between">
            <h3 className="text-sm font-medium text-emerald-600 mb-2">{title}</h3>
            <div className="flex items-end justify-between">
                <p className="text-3xl font-extrabold text-emerald-950 tracking-tight">{value}</p>
                <span className={`text-sm font-semibold bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md ${positive ? 'text-emerald-700' : 'text-red-600'}`}>
                    {trend}
                </span>
            </div>
        </Card>
    );
}
