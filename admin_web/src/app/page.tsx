'use client';

import { useState, useEffect } from 'react';

interface Detection {
  id: string;
  label: string;
  confidence: number;
  timestamp: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    detections: 0,
    farmers: 0,
    experts: 0,
    nodes: 0,
  });
  const [recentDetections, setRecentDetections] = useState<Detection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, detectionsRes] = await Promise.all([
          fetch('/api/stats'),
          fetch('/api/detections/recent')
        ]);

        const statsData = await statsRes.json();
        const detectionsData = await detectionsRes.json();

        if (statsData && !statsData.error) setStats(statsData);
        if (detectionsData && !detectionsData.error) setRecentDetections(detectionsData.detections || []);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-emerald-800 mb-2">
            🥥 CoconutGuard (Admin)
          </h1>
          <p className="text-lg text-emerald-600">
            Disease Surveillance & Supply Chain Management Dashboard
          </p>
        </header>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Detections"
            value={loading ? "..." : stats.detections.toString()}
            icon="📊"
            color="bg-blue-500"
          />
          <StatCard
            title="Active Farmers"
            value={loading ? "..." : stats.farmers.toString()}
            icon="🧑‍🌾"
            color="bg-green-500"
          />
          <StatCard
            title="Expert Reviews"
            value={loading ? "..." : stats.experts.toString()}
            icon="👨‍⚕️"
            color="bg-yellow-500"
          />
          <StatCard
            title="Supply Nodes"
            value={loading ? "..." : stats.nodes.toString()}
            icon="🏭"
            color="bg-purple-500"
          />
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Disease Surveillance */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              🗺️ Disease Surveillance Map
            </h2>
            <div className="bg-gray-100 rounded-lg h-64 flex items-center justify-center">
              <p className="text-gray-500 text-center">
                Interactive map view coming soon
                <br />
                <span className="text-sm">Geo-tagged disease outbreaks</span>
              </p>
            </div>
          </div>

          {/* Recent Detections */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              📋 Recent Detections
            </h2>
            <div className="space-y-3">
              {loading ? (
                <p className="text-center py-4 text-gray-400">Loading synergy...</p>
              ) : recentDetections.length > 0 ? (
                recentDetections.map((detection) => (
                  <div key={detection.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <div>
                      <span className="font-bold text-emerald-700 capitalize">{detection.label.replace('_', ' ')}</span>
                      <p className="text-xs text-gray-500">{(detection.confidence * 100).toFixed(1)}% confidence</p>
                    </div>
                    <div className="text-right text-xs text-gray-400">
                      {new Date(detection.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState message="No recent detections" />
              )}
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Disease Distribution
            </h3>
            <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
              <p className="text-gray-500 text-sm">Chart placeholder</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Detection Trends
            </h3>
            <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
              <p className="text-gray-500 text-sm">Chart placeholder</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Loss Recovery
            </h3>
            <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
              <p className="text-gray-500 text-sm">Chart placeholder</p>
            </div>
          </div>
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
}: {
  title: string;
  value: string;
  icon: string;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-600 font-medium">{title}</h3>
        <span className={`${color} text-white px-3 py-1 rounded-lg text-2xl`}>
          {icon}
        </span>
      </div>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}

// Empty State Component
function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-8 text-gray-500">
      <p className="text-lg">{message}</p>
      <p className="text-sm mt-2">Data will appear here once farmers start using the app</p>
    </div>
  );
}
