import React, { useEffect, useState } from 'react';
import { UtensilsCrossed } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Card } from '../components/ui/Card';
import { api } from '../api/client';
import { Select } from '../components/ui/Select';
import { MenuToggle } from '../components/layout/MenuToggle';

export const Mess = () => {
    const [menu, setMenu] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [hostelId, setHostelId] = useState<string>('hostel-4');

    useEffect(() => {
        const fetchMenu = async () => {
            setLoading(true);
            try {
                const response = await api.getMessMenu('today'); // Hostel ID logic might be frontend only or param?
                // The current API only takes day. If hostel support is needed, backend needs update.
                // For now, ignoring hostelId param in API call or adding it to backend.
                // Assuming backend only has one menu for now based on current logic.
                setMenu(response.data.menu);
            } catch (error) {
                console.error("Failed to fetch mess menu", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, [hostelId]);

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-48" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                    <MenuToggle />
                    <h1 className="text-2xl font-bold">Mess Menu</h1>
                </div>

                {/* Hostel Selector */}
                {/* Hostel Selector */}
                <div className="w-full sm:w-48">
                    <Select
                        value={hostelId}
                        onChange={setHostelId}
                        options={[
                            { label: 'Hostel 4', value: 'hostel-4' },
                            { label: 'Hostel 10CD', value: 'hostel-10cd' },
                            { label: 'Hostel 7', value: 'hostel-7' }
                        ]}
                    />
                </div>
            </div>

            {!menu ? (
                <div className="h-[60vh] flex items-center justify-center">
                    <EmptyState
                        icon={UtensilsCrossed}
                        title="Menu Not Available"
                        description="The mess menu hasn't been updated yet."
                    />
                </div>
            ) : (
                <Card className="p-5 space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                        <UtensilsCrossed size={24} className="text-orange-400" />
                        <h2 className="text-xl font-semibold capitalize">{menu.day}'s Menu ({hostelId.replace('hostel-', 'H-').toUpperCase()})</h2>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Breakfast</h3>
                            <p className="text-white">{menu.breakfast || 'Not available'}</p>
                        </div>

                        <div className="border-t border-white/10 pt-4">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Lunch</h3>
                            <p className="text-white">{menu.lunch || 'Not available'}</p>
                        </div>

                        <div className="border-t border-white/10 pt-4">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Tea Time</h3>
                            <p className="text-white">{menu.tea_time || 'Not available'}</p>
                        </div>

                        <div className="border-t border-white/10 pt-4">
                            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Dinner</h3>
                            <p className="text-white">{menu.dinner || 'Not available'}</p>
                        </div>
                    </div>
                </Card>
            )}
        </div>
    );
};
