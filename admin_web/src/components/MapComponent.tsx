'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamically import MapContainer and other components from react-leaflet to prevent SSR issues
const MapContainer = dynamic(
    () => import('react-leaflet').then((mod) => mod.MapContainer),
    { ssr: false }
);
const TileLayer = dynamic(
    () => import('react-leaflet').then((mod) => mod.TileLayer),
    { ssr: false }
);
const Marker = dynamic(
    () => import('react-leaflet').then((mod) => mod.Marker),
    { ssr: false }
);
const Popup = dynamic(
    () => import('react-leaflet').then((mod) => mod.Popup),
    { ssr: false }
);

interface MapComponentProps {
    detections: { id?: string; label?: string; confidence?: number; timestamp: string | number | Date; location?: { latitude: number; longitude: number; region?: string } | string }[];
}

export default function MapComponent({ detections }: MapComponentProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
        // Fix Leaflet marker icon issue in Next.js
        /* eslint-disable @typescript-eslint/no-require-imports */
        const L = require('leaflet');
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png').default?.src || 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: require('leaflet/dist/images/marker-icon.png').default?.src || 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: require('leaflet/dist/images/marker-shadow.png').default?.src || 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
        /* eslint-enable @typescript-eslint/no-require-imports */
    }, []);

    if (!mounted) return <div className="h-full w-full bg-emerald-100/50 animate-pulse rounded-xl"></div>;

    // Center on Sri Lanka by default
    const center: [number, number] = [7.8731, 80.7718];

    return (
        <MapContainer 
            center={center} 
            zoom={7} 
            className="h-full w-full rounded-xl z-0"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {detections.map((detection, idx) => {
                // If location is a string (mock data) or object (real data)
                let lat = center[0];
                let lng = center[1];
                
                if (typeof detection.location === 'object' && detection.location !== null && 'latitude' in detection.location) {
                    lat = detection.location.latitude as number;
                    lng = detection.location.longitude as number;
                } else if (detection.location === 'Trincomalee') {
                    lat = 8.5874; lng = 81.2152;
                } else if (detection.location === 'Kurunegala') {
                    lat = 7.4818; lng = 80.3609;
                } else if (detection.location === 'Galle') {
                    lat = 6.0535; lng = 80.2210;
                }

                return (
                    <Marker key={detection.id || idx} position={[lat, lng]}>
                        <Popup>
                            <div className="text-sm">
                                <p className="font-bold capitalize text-emerald-950">{detection.label?.replace('_', ' ') || 'Disease'}</p>
                                <p className="text-emerald-800">Confidence: {detection.confidence ? (detection.confidence * 100).toFixed(1) : 0}%</p>
                                <p className="text-xs text-emerald-600/80">{new Date(detection.timestamp).toLocaleDateString()}</p>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}
