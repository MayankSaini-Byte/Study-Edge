import React, { useEffect, useState } from 'react';
import { CheckSquare, Plus, Trash2 } from 'lucide-react';
import { EmptyState } from '../components/ui/EmptyState';
import { Skeleton } from '../components/ui/Skeleton';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import { api } from '../api/client';
import { MenuToggle } from '../components/layout/MenuToggle';

export const Todo = () => {
    const [todos, setTodos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [adding, setAdding] = useState(false);
    const [newTitle, setNewTitle] = useState('');

    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const fetchTodos = async () => {
        setLoading(true);
        try {
            const response = await api.getTodos();
            setTodos(response.data.todos);
        } catch (error) {
            console.error("Failed to fetch todos", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim()) return;

        try {
            await api.createTodo(newTitle);
            setNewTitle('');
            setAdding(false);
            fetchTodos();
        } catch (error) {
            console.error("Failed to create todo", error);
        }
    };

    const handleToggle = async (id: number, currentCompleted: boolean) => {
        const newCompleted = !currentCompleted;
        try {
            await api.updateTodo(id, newCompleted);
            fetchTodos();
        } catch (error) {
            console.error("Failed to update todo", error);
        }
    };

    const handleDeleteClick = (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        try {
            await api.deleteTodo(deleteId);
            fetchTodos();
        } catch (error) {
            console.error("Failed to delete todo", error);
        }
    };

    if (loading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-32" />
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16" />)}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <MenuToggle />
                    <h1 className="text-2xl font-bold">Todo List</h1>
                </div>
                <Button variant="primary" className="!w-auto !px-4" onClick={() => setAdding(!adding)}>
                    <Plus size={20} />
                </Button>
            </div>

            {adding && (
                <Card className="p-4">
                    <form onSubmit={handleAdd} className="space-y-3">
                        <Input
                            label="Task"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="e.g. Buy groceries"
                            required
                        />
                        <div className="flex gap-2">
                            <Button type="submit" variant="primary">Add</Button>
                            <Button type="button" variant="ghost" onClick={() => setAdding(false)}>Cancel</Button>
                        </div>
                    </form>
                </Card>
            )}

            {todos.length === 0 ? (
                <div className="h-[50vh] flex items-center justify-center">
                    <EmptyState
                        icon={CheckSquare}
                        title="No Tasks"
                        description="Add a task to get started with your day."
                    />
                </div>
            ) : (
                <div className="space-y-3">
                    {todos.map((todo) => (
                        <Card
                            key={todo.id}
                            className="p-4 hover:bg-white/10 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div
                                    className="flex items-center gap-3 flex-1 cursor-pointer"
                                    onClick={() => handleToggle(todo.id, todo.completed)}
                                >
                                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${todo.completed ? 'bg-primary border-primary' : 'border-gray-500'
                                        }`}>
                                        {todo.completed && <CheckSquare size={16} className="text-white" />}
                                    </div>
                                    <p className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                                        {todo.title}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    className="!w-auto !px-2 !h-8 text-xs text-red-400 hover:text-red-300"
                                    onClick={(e) => handleDeleteClick(todo.id, e)}
                                >
                                    <Trash2 size={16} />
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                title="Delete Task"
                message="Are you sure you want to delete this task?"
                isDestructive
            />
        </div>
    );
};
