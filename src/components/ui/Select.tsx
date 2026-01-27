import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface Option {
    label: string;
    value: string;
}

interface SelectProps {
    value: string;
    onChange: (value: string) => void;
    options: Option[];
    className?: string;
}

export const Select: React.FC<SelectProps> = ({ value, onChange, options, className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.value === value) || options[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-3 bg-zinc-800/50 border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm hover:bg-zinc-800/80 transition-all active:scale-[0.98] outline-none focus:ring-2 focus:ring-primary/50"
            >
                <span className="font-medium truncate">{selectedOption.label}</span>
                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                >
                    <ChevronDown size={16} className="text-zinc-400" />
                </motion.div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute z-50 w-full mt-2 bg-zinc-900 border border-white/10 rounded-xl shadow-xl overflow-hidden backdrop-blur-xl max-h-80 overflow-y-auto custom-scrollbar"
                    >
                        <div className="p-1">
                            {options.map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${value === option.value
                                        ? 'bg-primary/20 text-primary font-medium'
                                        : 'text-zinc-300 hover:bg-white/5 hover:text-white'
                                        }`}
                                >
                                    {option.label}
                                    {value === option.value && (
                                        <Check size={14} className="text-primary" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
