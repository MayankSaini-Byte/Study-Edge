import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, UtensilsCrossed, CheckSquare, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const BottomNav = () => {
    const location = useLocation();
    const [isVisible, setIsVisible] = React.useState(false);

    const tabs = [
        { id: 'dashboard', label: 'Home', icon: LayoutDashboard, path: '/dashboard' },
        { id: 'assignments', label: 'Work', icon: BookOpen, path: '/assignments' },
        { id: 'gravity', label: 'AI', icon: Sparkles, path: '/gravity', special: true },
        { id: 'mess', label: 'Mess', icon: UtensilsCrossed, path: '/mess' },
        { id: 'todo', label: 'Todo', icon: CheckSquare, path: '/todo' },
    ];

    return (
        <div
            className="fixed bottom-0 left-0 right-0 z-50 flex justify-center items-end"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {/* Invisble trigger area at the bottom - increased height for easier activation */}
            <div className="absolute bottom-0 w-full h-8 bg-transparent z-40" />

            {/* The Nav Container */}
            <motion.div
                initial={{ y: "150%", scale: 0.9 }}
                animate={{ y: isVisible ? "0%" : "150%", scale: isVisible ? 1 : 0.9 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="mb-4 pointer-events-auto z-50 w-full px-4"
            >
                <div className="w-[95%] mx-auto">
                    <nav className="glass h-16 rounded-2xl flex items-center justify-around px-8 relative bg-black/60 backdrop-blur-xl border-white/10 shadow-2xl">
                        {tabs.map((tab) => {
                            const isActive = location.pathname === tab.path;
                            const isGravity = tab.id === 'gravity';

                            return (
                                <NavLink
                                    key={tab.id}
                                    to={tab.path}
                                    className={() =>
                                        `relative flex flex-col items-center justify-center w-full h-full transform transition-all duration-200 active:scale-90 ${isActive ? 'text-primary' : 'text-gray-400 hover:text-white'
                                        }`
                                    }
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-white/10 rounded-xl border border-white/5"
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}

                                    {/* Purple & Navy aura for Gravity icon */}
                                    {isGravity && (
                                        <>
                                            <div className="absolute inset-0 bg-purple-600/30 rounded-xl blur-md animate-pulse" />
                                            <div className="absolute inset-0 bg-indigo-800/30 rounded-xl blur-sm" />
                                        </>
                                    )}

                                    <tab.icon
                                        size={24}
                                        strokeWidth={isActive ? 2.5 : 2}
                                        className={`z-10 relative ${isGravity ? 'text-purple-300' : ''}`}
                                    />
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeDot"
                                            className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_#8b5cf6]"
                                        />
                                    )}
                                </NavLink>
                            );
                        })}
                    </nav>
                </div>
            </motion.div>
        </div>
    );
};
