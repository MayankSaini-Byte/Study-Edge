import React, { useEffect, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Book, GraduationCap, Utensils, Sparkles, User, Menu } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { api } from '../api/client';
import { MenuToggle } from '../components/layout/MenuToggle';

export const Dashboard = () => {
    const navigate = useNavigate();
    // MenuToggle handles the context internally, but we keep useOutletContext if we need other things
    const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();
    const [user, setUser] = useState<any>(null);
    const [assignmentsCount, setAssignmentsCount] = useState(0);
    const [todosCount, setTodosCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [profileCompletion, setProfileCompletion] = useState(100);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const [userRes, assignmentsRes, todosRes, profileRes] = await Promise.all([
                    api.getMe(),
                    api.getAssignments(),
                    api.getTodos(),
                    api.getProfile(),
                ]);

                setUser(userRes.data?.user);

                // Filter assignments
                const assignments = assignmentsRes.data?.assignments || [];
                setAssignmentsCount(assignments.filter((a: any) => a.status === 'pending').length);

                // Filter todos
                const todos = todosRes.data?.todos || [];
                setTodosCount(todos.filter((t: any) => !t.completed).length);

                // Calculate profile completion
                if (profileRes.data?.profile) {
                    const profile = profileRes.data.profile;
                    const fields = [profile.semester, profile.branch, profile.gender, profile.primary_goal];
                    const completed = fields.filter((f: any) => f && f.trim()).length;
                    setProfileCompletion(Math.round((completed / 4) * 100));
                }
            } catch (error: any) {
                console.error("Failed to fetch dashboard data", error);
                // If 401, redirect to login (interceptors might have handled it, but good to be safe)
                if (error.response?.status === 401) {
                    navigate('/');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="space-y-6 pb-6">
                <div className="space-y-1">
                    <Skeleton className="h-9 w-48" />
                    <Skeleton className="h-5 w-64" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-28" />)}
                </div>
            </div>
        );
    }

    const firstName = user?.name?.split(' ')[0] || 'Student';

    return (
        <div className="space-y-6 pb-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    {/* Menu Button */}
                    <MenuToggle />

                    <div className="space-y-1">
                        <h1 className="text-3xl font-bold">Hello, {firstName} 👋</h1>
                        <p className="text-gray-400">Here's what's happening today.</p>
                    </div>
                </div>

                {/* Profile Icon with Completion Indicator */}
                <button
                    onClick={() => navigate('/profile')}
                    className="relative p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/10"
                >
                    <User size={24} className="text-white" />
                    {profileCompletion < 100 && (
                        <div className="absolute -top-1 -right-1 bg-yellow-500 text-black text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                            {profileCompletion}
                        </div>
                    )}
                </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
                <QuickStat
                    title="Pending Tasks"
                    value={assignmentsCount.toString()}
                    icon={Book}
                    iconClassName="text-blue-400"
                    bgClassName="bg-blue-500/10 border border-blue-500/20"
                    onClick={() => navigate('/assignments')}
                />
                <QuickStat
                    title="Todo Items"
                    value={todosCount.toString()}
                    icon={GraduationCap}
                    iconClassName="text-green-400"
                    bgClassName="bg-green-500/10 border border-green-500/20"
                    onClick={() => navigate('/todo')}
                />
                <QuickStat
                    title="Mess Menu"
                    value="View"
                    icon={Utensils}
                    iconClassName="text-orange-400"
                    bgClassName="bg-orange-500/10 border border-orange-500/20"
                    onClick={() => navigate('/mess')}
                />
                <QuickStat
                    title="Ask Gravity"
                    value="Chat"
                    icon={Sparkles}
                    iconClassName="text-purple-400"
                    bgClassName="bg-purple-500/10 border border-purple-500/20"
                    onClick={() => navigate('/gravity')}
                />
            </div>

            {/* Upcoming Deadlines */}
            <section>
                <div className="flex items-center gap-2 mb-3">
                    <Book size={20} className="text-primary" />
                    <h2 className="text-lg font-semibold">Upcoming Deadlines</h2>
                </div>
                <Card className="min-h-[150px] flex items-center justify-center">
                    <EmptyState
                        icon={Book}
                        title="All caught up!"
                        description={assignmentsCount === 0 ? "No pending assignments." : `${assignmentsCount} pending assignment${assignmentsCount > 1 ? 's' : ''}`}
                        action={assignmentsCount > 0 ? (
                            <Button variant="secondary" onClick={() => navigate('/assignments')}>
                                View Assignments
                            </Button>
                        ) : undefined}
                    />
                </Card>
            </section>

            {/* Study Smarter CTA */}
            <Card className="bg-primary/10 border-primary/20 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
                <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="text-primary w-5 h-5" />
                    <h2 className="font-semibold text-white">Study Smarter</h2>
                </div>
                <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                    Stuck on a problem? Need to summarize a PDF? Gravity AI is here to help you ace your studies.
                </p>
                <Button variant="primary" onClick={() => navigate('/gravity')}>
                    Ask Gravity
                </Button>
            </Card>
        </div>
    );
};

// Helper component for quick stats
const QuickStat = ({ title, value, icon: Icon, iconClassName, bgClassName, onClick }: any) => (
    <Card
        onClick={onClick}
        className="relative p-4 h-28 flex flex-col justify-between hover:bg-white/10 transition-colors cursor-pointer active:scale-95 duration-200"
    >
        <div className="flex justify-between items-start">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{title}</span>
            <div className={`p-2.5 rounded-xl ${bgClassName}`}>
                <Icon size={18} className={iconClassName} />
            </div>
        </div>
        <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
    </Card>
);
