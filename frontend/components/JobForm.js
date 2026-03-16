'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function JobForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    applied_date: '',
    status: 'Applied',
    notes: ''
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
      const response = await fetch('http://localhost:5000/jobs', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create job application');
      }

      // Clear form
      setFormData({
        company: '',
        role: '',
        applied_date: '',
        status: 'Applied',
        notes: ''
      });

      // Notify parent to refresh jobs
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
      <h2 className="text-2xl font-semibold gradient-text mb-8 tracking-tight">Add New Job Application</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200/60 rounded-xl text-red-700 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2.5">
            Company *
          </label>
          <input
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 placeholder:text-gray-400"
            placeholder="e.g., Google"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2.5">
            Role
          </label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 placeholder:text-gray-400"
            placeholder="e.g., Software Engineer"
          />
        </div>

        <div>
          <label htmlFor="applied_date" className="block text-sm font-semibold text-gray-700 mb-2.5">
            Applied Date
          </label>
          <input
            type="date"
            id="applied_date"
            name="applied_date"
            value={formData.applied_date}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900"
          />
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
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2.5">
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-3 border border-purple-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-300 text-gray-900 placeholder:text-gray-400 resize-none"
            placeholder="Additional notes..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-purple text-white py-3.5 px-6 rounded-xl font-semibold hover:shadow-purple transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed shadow-soft hover:shadow-purple-lg"
        >
          {loading ? 'Adding...' : 'Add Job Application'}
        </button>
      </form>
    </div>
  );
}

