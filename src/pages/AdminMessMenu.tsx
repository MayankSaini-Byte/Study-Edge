import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Edit2, Save, X } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { api } from '../api/client';
import { MenuToggle } from '../components/layout/MenuToggle';

export const AdminMessMenu = () => {
    const navigate = useNavigate();
    const [messMenu, setMessMenu] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editingDay, setEditingDay] = useState<string | null>(null);
    const [editData, setEditData] = useState({ breakfast: '', lunch: '', tea_time: '', dinner: '' });

    useEffect(() => {
        const role = localStorage.getItem('user_role');
        if (role !== 'admin') {
            navigate('/dashboard');
            return;
        }
        fetchAllMenus();
    }, [navigate]);

    const fetchAllMenus = async (silent = false) => {
        if (!silent) setLoading(true);

        const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const menus = [];

        try {
            for (const day of days) {
                const response = await api.getMessMenu(day);
                if (response.data?.menu) {
                    menus.push(response.data.menu);
                }
            }
            setMessMenu(menus);
        } catch (err) {
            console.error("Failed to fetch menus", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (menu: any) => {
        setEditingDay(menu.day);
        setEditData({
            breakfast: menu.breakfast || '',
            lunch: menu.lunch || '',
            tea_time: menu.tea_time || '',
            dinner: menu.dinner || ''
        });
        setError(null);
    };

    const handleSave = async () => {
        if (!editingDay) return;

        setIsSaving(true);
        setError(null);

        try {
            await api.updateMessMenu(editingDay, editData);
            await fetchAllMenus(true);
            setEditingDay(null);
        } catch (err: any) {
            console.error('Sync failed:', err);
            setError('Failed to save menu changes. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setEditingDay(null);
        setError(null);
    };

    if (loading) {
        return <div className="text-center text-gray-400 py-8">Loading...</div>;
    }

    return (
        <div className="space-y-6 pb-6">
            <div className="flex items-center gap-3">
                <MenuToggle />
                <UtensilsCrossed className="text-orange-400" />
                <h1 className="text-2xl font-bold">Admin - Mess Menu</h1>
            </div>

            <div className="space-y-4">
                {messMenu.map((menu) => (
                    <Card key={menu.day} className="p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold capitalize">{menu.day}</h2>
                            {editingDay !== menu.day && (
                                <Button
                                    variant="secondary"
                                    className="!w-auto !px-3 !h-9"
                                    onClick={() => handleEdit(menu)}
                                >
                                    <Edit2 size={16} className="mr-2" />
                                    Edit
                                </Button>
                            )}
                        </div>

                        {editingDay === menu.day ? (
                            <div className="space-y-3">
                                <Input
                                    label="Breakfast"
                                    value={editData.breakfast}
                                    onChange={(e) => setEditData({ ...editData, breakfast: e.target.value })}
                                />
                                <Input
                                    label="Lunch"
                                    value={editData.lunch}
                                    onChange={(e) => setEditData({ ...editData, lunch: e.target.value })}
                                />
                                <Input
                                    label="Tea Time"
                                    value={editData.tea_time}
                                    onChange={(e) => setEditData({ ...editData, tea_time: e.target.value })}
                                />
                                <Input
                                    label="Dinner"
                                    value={editData.dinner}
                                    onChange={(e) => setEditData({ ...editData, dinner: e.target.value })}
                                />
                                <div className="flex gap-2 pt-2">
                                    <Button
                                        variant="primary"
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className={isSaving ? 'opacity-70 cursor-not-allowed' : ''}
                                    >
                                        <Save size={16} className="mr-2" />
                                        {isSaving ? 'Saving...' : 'Save'}
                                    </Button>
                                    <Button variant="ghost" onClick={handleCancel}>
                                        <X size={16} className="mr-2" />
                                        Cancel
                                    </Button>
                                </div>
                                {error && (
                                    <p className="text-red-400 text-xs mt-2">{error}</p>
                                )}
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div>
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase mb-1">Breakfast</h3>
                                    <p className="text-white">{menu.breakfast}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase mb-1">Lunch</h3>
                                    <p className="text-white">{menu.lunch}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase mb-1">Tea Time</h3>
                                    <p className="text-white">{menu.tea_time || 'Not set'}</p>
                                </div>
                                <div>
                                    <h3 className="text-xs font-semibold text-gray-400 uppercase mb-1">Dinner</h3>
                                    <p className="text-white">{menu.dinner}</p>
                                </div>
                            </div>
                        )}
                    </Card>
                ))}
            </div>
        </div>
    );
};
