import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BookOpen, Plus, Trash2, FileText } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { api } from '../api/client';
import { MenuToggle } from '../components/layout/MenuToggle';

// -----------------------------
// Types
// -----------------------------
type AssignmentStatus = 'pending' | 'completed';

type Assignment = {
    id: number;
    title: string;
    status: AssignmentStatus;
    due_date?: string | null;
    pdf_file?: string | null;
};

const MAX_PDF_MB = 5;

// -----------------------------
// Component
// -----------------------------
export const Assignments: React.FC = () => {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [adding, setAdding] = useState<boolean>(false);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const [newTitle, setNewTitle] = useState<string>('');
    const [newDueDate, setNewDueDate] = useState<string>('');
    const [pdfFile, setPdfFile] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // -----------------------------
    // Data
    // -----------------------------
    const fetchAssignments = useCallback(async () => {
        setLoading(true);
        setErrorMsg(null);
        try {
            const { data } = await api.getAssignments();
            if (data) {
                setAssignments(data.assignments as Assignment[]);
            }
        } catch (error) {
            setErrorMsg('Failed to load assignments. Please try again.');
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchAssignments();
    }, [fetchAssignments]);

    // -----------------------------
    // Handlers
    // -----------------------------
    const resetForm = () => {
        setNewTitle('');
        setNewDueDate('');
        setPdfFile(null);
        setAdding(false);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        setSubmitting(true);
        setErrorMsg(null);

        try {
            await api.createAssignment(
                newTitle.trim(),
                newDueDate || undefined,
                pdfFile || undefined
            );

            resetForm();
            fetchAssignments();
        } catch (error) {
            setErrorMsg('Could not create assignment.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setErrorMsg('Only PDF files are allowed.');
            return;
        }

        if (file.size > MAX_PDF_MB * 1024 * 1024) {
            setErrorMsg(`PDF must be under ${MAX_PDF_MB}MB.`);
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setPdfFile(reader.result as string);
        reader.readAsDataURL(file);
    };

    const handleToggleStatus = async (id: number, status: AssignmentStatus) => {
        const nextStatus: AssignmentStatus = status === 'pending' ? 'completed' : 'pending';

        // Optimistic update
        setAssignments(prev =>
            prev.map(a => (a.id === id ? { ...a, status: nextStatus } : a))
        );

        try {
            await api.updateAssignment(id, nextStatus);
        } catch (error) {
            fetchAssignments();
        }
    };

    const handleDeleteClick = (id: number) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        const id = deleteId;

        // Optimistic remove
        const snapshot = assignments;
        setAssignments(prev => prev.filter(a => a.id !== id));

        try {
            await api.deleteAssignment(id);
        } catch (error) {
            setAssignments(snapshot);
        }
    };

    // -----------------------------
    // Derived
    // -----------------------------
    const hasAssignments = assignments.length > 0;

    const sortedAssignments = useMemo(() => {
        return [...assignments].sort((a, b) => {
            if (a.status !== b.status) return a.status === 'pending' ? -1 : 1;
            if (!a.due_date || !b.due_date) return 0;
            return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        });
    }, [assignments]);

    // -----------------------------
    // Render
    // -----------------------------
    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-40" />
                {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-20" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <MenuToggle />
                    <h1 className="text-2xl font-bold">Assignments</h1>
                </div>
                <Button variant="primary" className="!w-auto !px-4" onClick={() => setAdding(v => !v)}>
                    <Plus size={18} />
                </Button>
            </div>

            {errorMsg && (
                <Card className="p-3 border-red-500/30 bg-red-500/10 text-red-400 text-sm">
                    {errorMsg}
                </Card>
            )}

            {adding && (
                <Card className="p-4">
                    <form onSubmit={handleAdd} className="space-y-3">
                        <Input
                            label="Assignment Title"
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                            placeholder="e.g. Math Assignment 3"
                            required
                        />
                        <Input
                            label="Due Date (Optional)"
                            type="date"
                            value={newDueDate}
                            onChange={e => setNewDueDate(e.target.value)}
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">Upload PDF (Optional)</label>
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={handleFileChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:bg-primary file:text-white hover:file:bg-primary/80 file:cursor-pointer"
                            />
                            {pdfFile && (
                                <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                                    <FileText size={14} /> PDF attached
                                </p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <Button type="submit" variant="primary" disabled={submitting}>
                                {submitting ? 'Adding…' : 'Add'}
                            </Button>
                            <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
                        </div>
                    </form>
                </Card>
            )}

            {!hasAssignments ? (
                <div className="h-[50vh] flex items-center justify-center">
                    <EmptyState
                        icon={BookOpen}
                        title="No Assignments"
                        description="You're all caught up. Stay sharp."
                    />
                </div>
            ) : (
                <div className="space-y-3">
                    {sortedAssignments.map(a => (
                        <Card key={a.id} className="p-4">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h3 className={`font-medium ${a.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
                                            {a.title}
                                        </h3>
                                        {a.pdf_file && (
                                            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30">
                                                PDF
                                            </span>
                                        )}
                                    </div>
                                    {a.due_date && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            Due: {new Date(a.due_date).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    {a.pdf_file && (
                                        <Button
                                            variant="ghost"
                                            className="!w-auto !px-3 !h-8 text-xs"
                                            onClick={() => window.open(a.pdf_file!, '_blank')}
                                        >
                                            View PDF
                                        </Button>
                                    )}
                                    <Button
                                        variant={a.status === 'completed' ? 'ghost' : 'secondary'}
                                        className="!w-auto !px-3 !h-8 text-xs"
                                        onClick={() => handleToggleStatus(a.id, a.status)}
                                    >
                                        {a.status === 'completed' ? 'Undo' : 'Complete'}
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        className="!w-auto !px-2 !h-8 text-xs text-red-400 hover:text-red-300"
                                        onClick={() => handleDeleteClick(a.id)}
                                    >
                                        <Trash2 size={16} />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Assignment"
                message="Are you sure you want to delete this assignment? This action cannot be undone."
                isDestructive
            />
        </div>
    );
};
