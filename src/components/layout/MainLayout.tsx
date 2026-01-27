import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Menu, User } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { BackgroundGlow } from '../ui/BackgroundGlow';

export const MainLayout = () => {
    // Single state for the sidebar overlay - Default closed
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // Toggle function
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="min-h-screen flex flex-col bg-black text-white relative">
            <BackgroundGlow />
            {/* Global Header Hidden - but kept in code structure if needed */}
            <header className="hidden h-16 items-center justify-between px-4 border-b border-zinc-800 bg-zinc-900 z-40 shrink-0">
                {/* Hidden content */}
            </header>

            <div className="flex-1 flex flex-col relative">
                {/* Sidebar Overlay - Positioned absolutely by the component itself, but rendered here */}
                <Sidebar
                    isOpen={isSidebarOpen}
                    onMobileClose={() => setIsSidebarOpen(false)}
                />

                {/* Main Content - No longer pushed by Sidebar */}
                <main className="w-full relative flex-1">
                    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
                        <Outlet context={{ toggleSidebar }} />
                    </div>
                </main>
            </div>

            {/* Bottom Navigation */}
            <div>
                <BottomNav />
            </div>
        </div>
    );
};
