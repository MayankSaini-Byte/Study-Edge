import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

interface CardProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            whileTap={{ scale: props.onClick ? 0.98 : 1 }}
            className={`bg-white/5 border border-white/10 backdrop-blur-lg rounded-2xl p-4 ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
};
