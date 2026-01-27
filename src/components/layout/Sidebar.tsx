import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Utensils,
    CheckSquare,
    Calendar,
    Clock,
    CreditCard,
    FileBarChart,
    ChevronRight,
    Linkedin,
    Shield
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface SidebarProps {
    isOpen: boolean;        // Combined state: Desktop & Mobile use same toggle now
    isMobileOpen?: boolean; // Deprecated, keeping for compatibility if needed but unused here
    onMobileClose: () => void;
}

export const Sidebar = ({ isOpen, onMobileClose }: SidebarProps) => {
    const menuGroups = [
        {
            items: [
                { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
                { icon: FileText, label: 'Assignments', path: '/assignments' },
                { icon: Utensils, label: 'Mess Menu', path: '/mess' },
                { icon: CheckSquare, label: 'Todo List', path: '/todo' },
            ]
        },
        {
            items: [
                { icon: CreditCard, label: 'Fee Structure', path: '/fees' },
                { icon: Calendar, label: 'Class Schedule', path: '/schedule' },
                { icon: FileBarChart, label: 'Attendance Calc', path: '/attendance' },
                { icon: Clock, label: 'Upcoming Events', path: '/events' },
            ]
        }
    ];

    const isAdmin = localStorage.getItem('user_role') === 'admin';
    if (isAdmin) {
        menuGroups[0].items.push({ icon: Shield, label: 'Admin Mess Menu', path: '/admin/mess-menu' });
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop Blur Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        onClick={onMobileClose}
                    />

                    {/* Sliding Sidebar */}
                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 left-0 z-50 h-full w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 shadow-2xl text-zinc-900 dark:text-white"
                    >
                        {/* Logo Header (Inside Sidebar for Context) */}
                        <div className="h-16 flex items-center px-6 border-b border-zinc-800">
                            <div className="w-8 h-8 mr-3 flex items-center justify-center">
                                <img src="/logo.png" alt="StudyEdge Logo" className="w-full h-full object-contain" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                StudyEdge
                            </span>
                        </div>

                        {/* Navigation Items */}
                        <div className="py-4 space-y-6 overflow-y-auto h-[calc(100%-64px)] scrollbar-none">
                            {menuGroups.map((group, groupIndex) => (
                                <div key={groupIndex} className="space-y-1 px-4">
                                    {group.items.map((item) => (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            onClick={onMobileClose}
                                            className={({ isActive }) => `
                                                flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 active:scale-95
                                                ${isActive
                                                    ? 'bg-blue-600/10 text-blue-400'
                                                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}
                                            `}
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <item.icon size={22} className="shrink-0" />
                                                    <span className="truncate">{item.label}</span>
                                                    {isActive && <ChevronRight size={16} className="ml-auto" />}
                                                </>
                                            )}
                                        </NavLink>
                                    ))}
                                    {groupIndex < menuGroups.length - 1 && (
                                        <div className="my-2 border-t border-zinc-800" />
                                    )}
                                </div>
                            ))}

                            <div className="px-4 pt-4 mt-auto pb-6 space-y-4">
                                <div className="border-t border-zinc-800" />

                                {/* LinkedIn Link */}
                                <a
                                    href="https://www.linkedin.com/in/mayank-saini-0/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center space-x-3 px-3 py-2 text-zinc-400 hover:text-blue-400 hover:bg-zinc-800 rounded-lg transition-colors group"
                                >
                                    <Linkedin size={22} className="group-hover:text-blue-500 transition-colors" />
                                    <span>Connect on LinkedIn</span>
                                </a>

                                {/* Logout Button */}
                                <button
                                    onClick={() => {
                                        // clear local storage and redirect
                                        localStorage.removeItem('user_role');
                                        localStorage.removeItem('user_name');
                                        // Force refresh to clear state/cookies effectively if needed, or just navigate
                                        window.location.href = '/';
                                    }}
                                    className="w-full flex items-center space-x-3 px-3 py-2 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors group"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out group-hover:text-red-400 transition-colors"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
};
