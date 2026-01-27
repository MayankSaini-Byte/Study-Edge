import React from 'react';
import { Library as LibraryIcon } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { MenuToggle } from '../components/layout/MenuToggle';

export const Library = () => {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <MenuToggle />
                <h1 className="text-2xl font-bold">Library</h1>
            </div>
            <div className="min-h-[60vh] flex items-center justify-center">
                <EmptyState
                    icon={LibraryIcon}
                    title="Library Empty"
                    description="Upload your notes and PDFs to get started."
                />
            </div>
        </div>
    );
};
