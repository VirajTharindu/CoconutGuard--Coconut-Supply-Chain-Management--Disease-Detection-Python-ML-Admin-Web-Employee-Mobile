'use client';

import { useQuery } from '@tanstack/react-query';
import { Card } from '@/components/ui/Card';
import MapComponent from '@/components/MapComponent';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from 'recharts';

interface Detection {
  id: string;
  label: string;
  confidence: number;
  timestamp: string;
  location?: { latitude: number; longitude: number; region?: string } | string;
}

export default function DashboardPage() {
  // Fetch Stats using React Query
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: async () => {
      const res = await fetch('/api/stats');
      if (!res.ok) throw new Error('Failed to fetch stats');
      return res.json();
    },
    initialData: { detections: 0, farmers: 0, experts: 0, nodes: 0 },
  });

  // Fetch Recent Detections using React Query
  const { data: recentData, isLoading: detectionsLoading } = useQuery({
    queryKey: ['recentDetections'],
    queryFn: async () => {
      const res = await fetch('/api/detections/recent');
      if (!res.ok) throw new Error('Failed to fetch detections');
      return res.json();
    },
  });

  const recentDetections: Detection[] = recentData?.detections || [];
  const loading = statsLoading || detectionsLoading;

  // Mock data for charts
  const trendData = [
    { name: 'Mon', detections: 4 },
    { name: 'Tue', detections: 7 },
    { name: 'Wed', detections: 5 },
    { name: 'Thu', detections: 12 },
    { name: 'Fri', detections: 8 },
    { name: 'Sat', detections: 15 },
    { name: 'Sun', detections: 9 },
  ];

  const diseaseDistribution = [
    { name: 'Bud Rot', value: 45, color: '#ef4444' },
    { name: 'Leaf Rot', value: 30, color: '#f59e0b' },
    { name: 'Wilt', value: 25, color: '#8b5cf6' },
  ];

  const recoveryData = [
    { name: 'Week 1', recovered: 20, lost: 5 },
    { name: 'Week 2', recovered: 35, lost: 8 },
    { name: 'Week 3', recovered: 50, lost: 12 },
    { name: 'Week 4', recovered: 80, lost: 15 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold text-emerald-950 mb-3 tracking-tight">
            Dashboard
          </h1>
          <p className="text-lg text-emerald-700/80 font-medium">
            Disease Surveillance & Supply Chain Management
          </p>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Detections"
            value={loading ? "..." : stats.detections.toString()}
            icon="📊"
            color="bg-blue-500"
            trend="+12% this week"
          />
          <StatCard
            title="Active Farmers"
            value={loading ? "..." : stats.farmers.toString()}
            icon="🧑‍🌾"
            color="bg-green-500"
            trend="+5 new today"
          />
          <StatCard
            title="Expert Reviews"
            value={loading ? "..." : stats.experts.toString()}
            icon="👨‍⚕️"
            color="bg-yellow-500"
            trend="2 pending"
          />
          <StatCard
            title="Supply Nodes"
            value={loading ? "..." : stats.nodes.toString()}
            icon="🏭"
            color="bg-purple-500"
            trend="Stable"
          />
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* Disease Surveillance Map */}
          <Card className="xl:col-span-2 p-0 overflow-hidden flex flex-col h-[500px]">
            <div className="p-6 pb-4 border-b border-emerald-100 bg-emerald-50/30">
                <h2 className="text-xl font-bold text-emerald-900 flex items-center gap-2">
                🗺️ Disease Surveillance Map
                </h2>
            </div>
            <div className="flex-1 w-full bg-emerald-50/50 relative">
                <MapComponent detections={recentDetections} />
            </div>
          </Card>

          {/* Recent Detections */}
          <Card className="flex flex-col h-[500px]">
            <h2 className="text-xl font-bold text-emerald-900 mb-6 flex items-center gap-2">
              📋 Recent Activity
            </h2>
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                    <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
                </div>
              ) : recentDetections.length > 0 ? (
                recentDetections.map((detection) => (
                  <div key={detection.id} className="group flex items-start gap-4 p-4 bg-emerald-50/40 hover:bg-emerald-100/60 rounded-xl border border-emerald-100 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        🦠
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-emerald-900 capitalize truncate">
                          {detection.label.replace('_', ' ')}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                            {(detection.confidence * 100).toFixed(1)}% Conf.
                          </span>
                          <span className="text-xs text-emerald-600/70 truncate">
                              {typeof detection.location === 'object' && detection.location !== null 
                                ? detection.location.region || 'Unknown' 
                                : typeof detection.location === 'string' ? detection.location : 'Unknown'}
                          </span>
                      </div>
                    </div>
                    <div className="text-right text-xs font-medium text-emerald-500 whitespace-nowrap">
                      {new Date(detection.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState message="No recent detections" />
              )}
            </div>
          </Card>
        </div>

        {/* Analytics Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card>
            <h3 className="text-lg font-bold text-emerald-900 mb-6">
              Disease Distribution
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={diseaseDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {diseaseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-emerald-900 mb-6">
              Detection Trends (Last 7 Days)
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1fae5" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#065f46', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#065f46', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #d1fae5', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: '#f0fdf4' }}
                    cursor={{ stroke: '#6ee7b7', strokeWidth: 2, strokeDasharray: '3 3' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="detections" 
                    stroke="#10b981" 
                    strokeWidth={3}
                    dot={{r: 4, strokeWidth: 2, fill: '#fff'}}
                    activeDot={{r: 6, strokeWidth: 0, fill: '#10b981'}}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-bold text-emerald-900 mb-6">
              Loss vs Recovery Yield
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={recoveryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#d1fae5" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#065f46', fontSize: 12}} dy={10}/>
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#065f46', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #d1fae5', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', background: '#f0fdf4' }}
                    cursor={{fill: '#ecfdf5'}}
                  />
                  <Legend verticalAlign="bottom" height={36}/>
                  <Bar dataKey="recovered" name="Recovered (kg)" fill="#34d399" radius={[4, 4, 0, 0]} barSize={20} />
                  <Bar dataKey="lost" name="Lost (kg)" fill="#fb7185" radius={[4, 4, 0, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon,
  color,
  trend
}: {
  title: string;
  value: string;
  icon: string;
  color: string;
  trend: string;
}) {
  return (
    <Card className="flex flex-col justify-between">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl text-white shadow-inner ${color}`}>
          {icon}
        </div>
        <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-full">{trend}</span>
      </div>
      <div>
        <h3 className="text-emerald-600 font-medium text-sm mb-1">{title}</h3>
        <p className="text-3xl font-extrabold text-emerald-950 tracking-tight">{value}</p>
      </div>
    </Card>
  );
}

// Empty State Component
function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 text-emerald-400">
      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4 border border-emerald-100">
        <svg className="w-8 h-8 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
        </svg>
      </div>
      <p className="text-sm font-medium text-emerald-600">{message}</p>
    </div>
  );
}
