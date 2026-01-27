import React from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'outline';

interface ButtonProps extends Omit<HTMLMotionProps<"button">, "className"> {
    variant?: ButtonVariant;
    className?: string;
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    className = '',
    children,
    ...props
}) => {
    const baseStyles = "relative w-full h-12 rounded-xl font-medium tracking-wide transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary hover:bg-accent text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]",
        secondary: "bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md",
        ghost: "bg-transparent hover:bg-white/5 text-gray-300 hover:text-white",
        outline: "bg-transparent border border-primary/50 text-primary hover:bg-primary/10"
    };

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </motion.button>
    );
};
