import React from 'react';
import type { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8 space-y-4 opacity-80">
            <div className="p-4 bg-white/5 rounded-full ring-1 ring-white/10">
                <Icon size={32} className="text-gray-400" />
            </div>
            <div className="space-y-1">
                <h3 className="text-lg font-medium text-white">{title}</h3>
                <p className="text-sm text-gray-400 max-w-[250px] mx-auto">{description}</p>
            </div>
            {action && <div className="pt-2">{action}</div>}
        </div>
    );
};
