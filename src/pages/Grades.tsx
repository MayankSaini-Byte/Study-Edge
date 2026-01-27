import React from 'react';
import { GraduationCap } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { MenuToggle } from '../components/layout/MenuToggle';

export const Grades = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <MenuToggle />
                <h1 className="text-2xl font-bold">Grades</h1>
            </div>
            <div className="min-h-[60vh] flex items-center justify-center">
                <EmptyState
                    icon={GraduationCap}
                    title="No Grades Yet"
                    description="Your academic performance will appear here."
                />
            </div>
        </div>
    );
};
