import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export const MobileLayout = () => {
    const location = useLocation();
    const hideNav = location.pathname === '/' || location.pathname === '/login';

    return (
        <div className="flex flex-col min-h-screen text-white pb-24">
            <main className="flex-1 px-4 py-6 w-full max-w-[480px] mx-auto">
                <Outlet />
            </main>
            {!hideNav && <BottomNav />}
        </div>
    );
};
