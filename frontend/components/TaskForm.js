'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function TaskForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    task: '',
    due_date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { getAuthHeaders } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/tasks', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create task');
      }

      // Clear form
      setFormData({
        task: '',
        due_date: ''
      });

      // Notify parent to refresh tasks
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-purple-200/60 shadow-soft p-8 sticky top-24">
      <h2 className="text-2xl font-semibold gradient-text mb-8 tracking-tight">Create New Task</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200/60 rounded-xl text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="task" className="block text-sm font-semibold text-gray-700 mb-2.5">
            Task *
          </label>
          <input
            type="text"
            id="task"
            name="task"
            value={formData.task}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 placeholder:text-gray-400"
            placeholder="e.g., Review lecture notes"
          />
        </div>

        <div>
          <label htmlFor="due_date" className="block text-sm font-semibold text-gray-700 mb-2.5">
            Due Date
          </label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-purple text-white py-3.5 px-6 rounded-xl font-semibold hover:shadow-purple transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-soft hover:shadow-purple-lg"
        >
          {loading ? 'Creating...' : 'Create Task'}
        </button>
      </form>
    </div>
  );
}

