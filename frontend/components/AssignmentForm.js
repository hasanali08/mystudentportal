'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AssignmentForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    course: '',
    deadline: '',
    priority: 'Medium',
    status: 'Pending'
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
      const response = await fetch('http://localhost:5000/assignments', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create assignment');
      }

      // Clear form
      setFormData({
        title: '',
        course: '',
        deadline: '',
        priority: 'Medium',
        status: 'Pending'
      });

      // Notify parent to refresh assignments
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
      <h2 className="text-2xl font-semibold gradient-text mb-8 tracking-tight">Create New Assignment</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200/60 rounded-xl text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2.5">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 placeholder:text-gray-400"
            placeholder="e.g., Operating Systems Project"
          />
        </div>

        <div>
          <label htmlFor="course" className="block text-sm font-semibold text-gray-700 mb-2.5">
            Course
          </label>
          <input
            type="text"
            id="course"
            name="course"
            value={formData.course}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 placeholder:text-gray-400"
            placeholder="e.g., CS401"
          />
        </div>

        <div>
          <label htmlFor="deadline" className="block text-sm font-semibold text-gray-700 mb-2.5">
            Deadline
          </label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900"
          />
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-semibold text-gray-700 mb-2.5">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 cursor-pointer"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-2.5">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 cursor-pointer"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Not Started">Not Started</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-purple text-white py-3.5 px-6 rounded-xl font-semibold hover:shadow-purple transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-soft hover:shadow-purple-lg"
        >
          {loading ? 'Creating...' : 'Create Assignment'}
        </button>
      </form>
    </div>
  );
}

