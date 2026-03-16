'use client';

import { useState, useEffect } from 'react';
import TaskCard from '../../components/TaskCard';
import TaskForm from '../../components/TaskForm';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAuthHeaders, loading: authLoading } = useAuth();

  useEffect(() => {
    // Wait for auth to finish loading before fetching data
    if (!authLoading) {
      fetchTasks();
    }
  }, [authLoading]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/tasks', {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error('Failed to load tasks');
      }
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTaskCreated = () => {
    fetchTasks();
  };

  const handleToggleComplete = async (id, completed) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ completed }),
      });

      if (!response.ok) {
        throw new Error('Failed to update task');
      }

      fetchTasks();
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Failed to update task');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/tasks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete task');
      }

      fetchTasks();
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task');
    }
  };

  // Separate completed and pending tasks
  const pendingTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  return (
    <ProtectedRoute>
    <div className="space-y-12">
      <div className="mb-10">
        <h1 className="text-5xl font-semibold gradient-text mb-3 tracking-tight">Tasks</h1>
        <p className="text-lg text-gray-600 font-medium">Manage your daily tasks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tasks List */}
        <div className="lg:col-span-2 space-y-8">
          {loading && (
            <div className="bg-white rounded-2xl border border-purple-200/60 shadow-soft p-8">
              <p className="text-gray-600 font-medium">Loading tasks...</p>
            </div>
          )}

          {error && (
            <div className="bg-white rounded-2xl border border-purple-200/60 shadow-soft p-8">
              <p className="text-red-600 font-medium">Failed to load tasks.</p>
            </div>
          )}

          {!loading && !error && tasks.length === 0 && (
            <div className="bg-white rounded-2xl border border-purple-200/60 shadow-soft p-8">
              <p className="text-gray-600 font-medium">No tasks found. Create your first task!</p>
            </div>
          )}

          {!loading && !error && pendingTasks.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold gradient-text mb-6 tracking-tight">Pending Tasks</h2>
              <div className="space-y-4">
                {pendingTasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}

          {!loading && !error && completedTasks.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold gradient-text mb-6 tracking-tight">Completed Tasks</h2>
              <div className="space-y-4">
                {completedTasks.map((task) => (
                  <TaskCard 
                    key={task.id} 
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Create Task Form */}
        <div className="lg:col-span-1">
          <TaskForm onSuccess={handleTaskCreated} />
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
