import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Save, ArrowLeft } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Skeleton } from '../components/ui/Skeleton';
import { api } from '../api/client';
import { MenuToggle } from '../components/layout/MenuToggle';
import { useTheme } from '../contexts/ThemeContext';

export const Profile = () => {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState({
        fullName: '',
        semester: '',
        branch: '',
        hostel: '',
        rollNo: '',
        section: '',
        gender: ''
    });

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            const { data } = await api.getProfile();
            if (data?.profile) {
                // Filter out primary_goal if it comes from API but we don't use it
                const { primary_goal, ...rest } = data.profile;
                setProfile(prev => ({ ...prev, ...rest }));
            }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        await api.updateProfile(profile);
        setSaving(false);
        navigate('/dashboard');
    };

    if (loading) {
        return (
            <div className="space-y-6 pb-6">
                <Skeleton className="h-8 w-48" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32" />)}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-6">
            <div className="flex items-center gap-3 mb-6">
                <MenuToggle />
                <button
                    onClick={() => navigate('/dashboard')}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold">My Profile</h1>
                    <p className="text-sm text-gray-400">Manage your personal information</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Details Card */}
                <Card className="p-6 space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <User className="text-primary" size={20} />
                        Personal Details
                    </h2>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                        <Input
                            placeholder="Enter your full name"
                            value={profile.fullName}
                            onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Gender</label>
                        <Select
                            value={profile.gender}
                            onChange={(val) => setProfile({ ...profile, gender: val })}
                            options={[
                                { label: 'Male', value: 'Male' },
                                { label: 'Female', value: 'Female' },
                                { label: 'Other', value: 'Other' },
                                { label: 'Prefer not to say', value: 'Prefer not to say' }
                            ]}
                        />
                    </div>
                </Card>

                {/* Academic Details Card */}
                <Card className="p-6 space-y-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <User className="text-blue-400" size={20} />
                        Academic Info
                    </h2>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Roll No.</label>
                            <Input
                                placeholder="21..."
                                value={profile.rollNo}
                                onChange={(e) => setProfile({ ...profile, rollNo: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Section</label>
                            <Input
                                placeholder="A, B..."
                                value={profile.section}
                                onChange={(e) => setProfile({ ...profile, section: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Branch</label>
                        <Select
                            value={profile.branch}
                            onChange={(val) => setProfile({ ...profile, branch: val })}
                            options={[
                                { label: 'Computer Science Engineering', value: 'Computer Science Engineering' },
                                { label: 'Electronics & Communication', value: 'Electronics & Communication Engineering' },
                                { label: 'Mechanical Engineering', value: 'Mechanical Engineering' },
                                { label: 'Civil Engineering', value: 'Civil Engineering' },
                                { label: 'Electrical Engineering', value: 'Electrical Engineering' },
                                { label: 'Information Technology', value: 'Information Technology' },
                                { label: 'Metallurgical Engineering', value: 'Metallurgical Engineering' },
                                { label: 'Other', value: 'Other' }
                            ]}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Semester</label>
                            <Select
                                value={profile.semester}
                                onChange={(val) => setProfile({ ...profile, semester: val })}
                                options={[1, 2, 3, 4, 5, 6, 7, 8].map(sem => ({ label: `Semester ${sem}`, value: sem.toString() }))}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Hostel</label>
                            <Select
                                value={profile.hostel}
                                onChange={(val) => setProfile({ ...profile, hostel: val })}
                                options={[
                                    { label: 'Hostel 4', value: 'Hostel 4' },
                                    { label: 'Hostel 10CD', value: 'Hostel 10CD' },
                                    { label: 'Hostel 7', value: 'Hostel 7' },
                                    { label: 'Day Scholar', value: 'Day Scholar' }
                                ]}
                            />
                        </div>
                    </div>
                </Card>
            </div>

            <div className="flex justify-end pt-4">
                <Button
                    variant="primary"
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full md:w-auto min-w-[200px]"
                >
                    {saving ? (
                        <span className="flex items-center gap-2 justify-center">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Saving...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2 justify-center">
                            <Save size={18} />
                            Save Profile
                        </span>
                    )}
                </Button>
            </div>

            {/* Copyright Footer */}
            <div className="text-center pt-8 pb-4">
                <p className="text-xs text-gray-500">
                    © <a
                        href="https://www.linkedin.com/in/mayank-saini-6666b4375/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        Mayank Saini
                    </a>
                </p>
            </div>
        </div>
    );
};
