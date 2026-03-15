'use client';

import { useState, useEffect } from 'react';
import JobCard from '../../components/JobCard';
import JobForm from '../../components/JobForm';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';

export default function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAuthHeaders } = useAuth();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/jobs', {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error('Failed to load job applications');
      }
      const data = await response.json();
      setJobs(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJobCreated = () => {
    fetchJobs();
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const response = await fetch(`http://localhost:5000/jobs/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update job status');
      }

      fetchJobs();
    } catch (err) {
      console.error('Error updating job status:', err);
      alert('Failed to update job status');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/jobs/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error('Failed to delete job application');
      }

      fetchJobs();
    } catch (err) {
      console.error('Error deleting job:', err);
      alert('Failed to delete job application');
    }
  };

  return (
    <ProtectedRoute>
    <div className="space-y-12">
      <div className="mb-10">
        <h1 className="text-5xl font-semibold gradient-text mb-3 tracking-tight">Job Applications</h1>
        <p className="text-lg text-gray-600 font-medium">Track your job applications</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Jobs List */}
        <div className="lg:col-span-2 space-y-6">
          {loading && (
            <div className="bg-white rounded-2xl border border-purple-200/60 shadow-soft p-8">
              <p className="text-gray-600 font-medium">Loading job applications...</p>
            </div>
          )}

          {error && (
            <div className="bg-white rounded-2xl border border-purple-200/60 shadow-soft p-8">
              <p className="text-red-600 font-medium">Failed to load job applications.</p>
            </div>
          )}

          {!loading && !error && jobs.length === 0 && (
            <div className="bg-white rounded-2xl border border-purple-200/60 shadow-soft p-8">
              <p className="text-gray-600 font-medium">No job applications found. Add your first application!</p>
            </div>
          )}

          {!loading && !error && jobs.length > 0 && (
            <div className="space-y-6">
              {jobs.map((job) => (
                <JobCard 
                  key={job.id} 
                  job={job}
                  onStatusUpdate={handleStatusUpdate}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>

        {/* Create Job Form */}
        <div className="lg:col-span-1">
          <JobForm onSuccess={handleJobCreated} />
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}
