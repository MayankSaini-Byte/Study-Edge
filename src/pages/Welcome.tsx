import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { api } from '../api/client';
import { BackgroundGlow } from '../components/ui/BackgroundGlow';

export const Welcome = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [scholarNo, setScholarNo] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        if (scholarNo.length !== 11) {
            setError("Scholar number must be exactly 11 digits");
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            await api.login(name, scholarNo);
            // Success - navigate to dashboard
            navigate('/dashboard');
        } catch (err: any) {
            console.error("Login error:", err);
            if (!err.response) {
                setError("Unable to connect to server. Please ensure the backend is running.");
            } else {
                const errorMessage = err.response?.data?.detail || "Login failed. Please check your details.";
                setError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-y-auto">
            <BackgroundGlow />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center mb-12 text-center z-10"
            >
                <div className="w-16 h-16 bg-primary/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md ring-1 ring-white/10 shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                    <Sparkles className="text-primary w-8 h-8" />
                </div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">
                    Study<span className="text-primary">Edge</span>
                </h1>
                <p className="text-gray-400">Smart Student Productivity</p>
            </motion.div>

            <Card className="w-full max-w-sm space-y-6 z-10">
                <form onSubmit={handleLogin} className="space-y-4">
                    <Input
                        label="Full Name"
                        placeholder="e.g. Mayank Saini"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <Input
                        label="Scholar Number"
                        placeholder="e.g. 12345678901"
                        type="text"
                        maxLength={11}
                        pattern="[0-9]{11}"
                        value={scholarNo}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            setScholarNo(value);
                        }}
                        required
                    />
                    {scholarNo && scholarNo.length !== 11 && (
                        <p className="text-xs text-yellow-500 -mt-2">Scholar number must be exactly 11 digits</p>
                    )}

                    {error && <p className="text-xs text-red-500">{error}</p>}

                    <div className="pt-2">
                        <Button type="submit" disabled={isLoading || scholarNo.length !== 11} variant="primary">
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Logging in...
                                </span>
                            ) : (
                                "Login"
                            )}
                        </Button>
                    </div>

                    <p className="text-xs text-center text-gray-500">
                        Enter your details to access StudyEdge
                    </p>
                </form>
            </Card>

            {/* Copyright Footer */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-xs text-gray-500">
                    © <a
                        href="https://www.linkedin.com/in/mayank-saini-6666b4375/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                    >
                        Mayank Saini
                    </a>
                </p>
            </div>
        </div>
    );
};