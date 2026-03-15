'use client';

import { useState, useEffect } from 'react';
import AssignmentCard from '../../components/AssignmentCard';
import AssignmentForm from '../../components/AssignmentForm';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuth } from '../../contexts/AuthContext';

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAuthHeaders } = useAuth();

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/assignments', {
        headers: getAuthHeaders()
      });
      if (!response.ok) {
        throw new Error('Failed to load assignments');
      }
      const data = await response.json();
      setAssignments(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentCreated = () => {
    fetchAssignments();
  };

  return (
    <ProtectedRoute>
    <div className="space-y-12">
      <div className="mb-10">
        <h1 className="text-5xl font-semibold gradient-text mb-3 tracking-tight">Assignments</h1>
        <p className="text-lg text-gray-600 font-medium">Manage your assignments and deadlines</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Assignments List */}
        <div className="lg:col-span-2 space-y-6">
          {loading && (
            <div className="bg-white rounded-2xl border border-purple-200/60 shadow-soft p-8">
              <p className="text-gray-600 font-medium">Loading assignments...</p>
            </div>
          )}

          {error && (
            <div className="bg-white rounded-2xl border border-purple-200/60 shadow-soft p-8">
              <p className="text-red-600 font-medium">Failed to load assignments.</p>
            </div>
          )}

          {!loading && !error && assignments.length === 0 && (
            <div className="bg-white rounded-2xl border border-purple-200/60 shadow-soft p-8">
              <p className="text-gray-600 font-medium">No assignments found. Create your first assignment!</p>
            </div>
          )}

          {!loading && !error && assignments.length > 0 && (
            <div className="space-y-6">
              {assignments.map((assignment) => (
                <AssignmentCard key={assignment.id} assignment={assignment} />
              ))}
            </div>
          )}
        </div>

        {/* Create Assignment Form */}
        <div className="lg:col-span-1">
          <AssignmentForm onSuccess={handleAssignmentCreated} />
        </div>
      </div>
    </div>
    </ProtectedRoute>
  );
}

