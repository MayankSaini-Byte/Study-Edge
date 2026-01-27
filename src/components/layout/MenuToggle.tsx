import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Menu } from 'lucide-react';

export const MenuToggle = () => {
    const { toggleSidebar } = useOutletContext<{ toggleSidebar: () => void }>();

    return (
        <button
            onClick={toggleSidebar}
            className="p-2 -ml-2 hover:bg-zinc-800 rounded-lg transition-colors text-white"
            title="Toggle Menu"
        >
            <Menu size={28} />
        </button>
    );
};
