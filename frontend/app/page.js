'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ProtectedRoute from '../components/ProtectedRoute';
import { useAuth } from '../contexts/AuthContext';

export default function Dashboard() {
  const [assignments, setAssignments] = useState([]);
  const [totalAssignments, setTotalAssignments] = useState(0);
  const [pendingTasks, setPendingTasks] = useState(0);
  const [activeApplications, setActiveApplications] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAuthHeaders } = useAuth();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [assignmentsRes, tasksRes, jobsRes] = await Promise.all([
        fetch('http://localhost:5000/assignments', {
          headers: getAuthHeaders()
        }),
        fetch('http://localhost:5000/tasks', {
          headers: getAuthHeaders()
        }),
        fetch('http://localhost:5000/jobs', {
          headers: getAuthHeaders()
        })
      ]);

      if (!assignmentsRes.ok) {
        throw new Error('Failed to load assignments');
      }
      if (!tasksRes.ok) {
        throw new Error('Failed to load tasks');
      }
      if (!jobsRes.ok) {
        throw new Error('Failed to load jobs');
      }

      const assignmentsData = await assignmentsRes.json();
      const tasksData = await tasksRes.json();
      const jobsData = await jobsRes.json();

      // Set total assignments count
      setTotalAssignments(assignmentsData.length);

      // Get only upcoming assignments (limit to 5) for display
      const upcoming = assignmentsData.slice(0, 5);
      setAssignments(upcoming);

      // Count pending tasks (not completed)
      const pendingCount = tasksData.filter(task => !task.completed).length;
      setPendingTasks(pendingCount);

      // Count active applications (not rejected, closed, or declined)
      const inactiveStatuses = ['Rejected', 'Closed', 'Declined', 'Withdrawn'];
      const activeCount = jobsData.filter(job => 
        !job.status || !inactiveStatuses.includes(job.status)
      ).length;
      setActiveApplications(activeCount);

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-red-50 text-red-700 border-red-200/60';
      case 'High':
        return 'bg-orange-50 text-orange-700 border-orange-200/60';
      case 'Medium':
        return 'bg-purple-100 text-purple-700 border-purple-200/60';
      case 'Low':
        return 'bg-green-50 text-green-700 border-green-200/60';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200/60';
    }
  };

  return (
    <ProtectedRoute>
    <div className="space-y-12">
      <div className="mb-10">
        <h1 className="text-5xl font-semibold gradient-text mb-3 tracking-tight">Dashboard</h1>
        <p className="text-lg text-gray-600 font-medium">Welcome to your Student Command Center</p>
      </div>

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/assignments">
          <div className="bg-white rounded-2xl border border-purple-200/60 shadow-soft p-8 hover:shadow-purple-lg hover:border-purple-400/80 hover:scale-[1.02] transition-all duration-400 cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-gradient-purple-light flex items-center justify-center mb-4 group-hover:bg-gradient-purple transition-all duration-300">
              <svg className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight group-hover:text-purple-600 transition-colors duration-300">Assignments</h2>
            <p className="text-gray-600 text-sm leading-relaxed">Manage your assignments and deadlines</p>
          </div>
        </Link>
        <Link href="/tasks">
          <div className="bg-white rounded-2xl border border-purple-200/60 shadow-soft p-8 hover:shadow-purple-lg hover:border-purple-400/80 hover:scale-[1.02] transition-all duration-400 cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-gradient-purple-light flex items-center justify-center mb-4 group-hover:bg-gradient-purple transition-all duration-300">
              <svg className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight group-hover:text-purple-600 transition-colors duration-300">Tasks</h2>
            <p className="text-gray-600 text-sm leading-relaxed">Track your daily tasks</p>
          </div>
        </Link>
        <Link href="/jobs">
          <div className="bg-white rounded-2xl border border-purple-200/60 shadow-soft p-8 hover:shadow-purple-lg hover:border-purple-400/80 hover:scale-[1.02] transition-all duration-400 cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-gradient-purple-light flex items-center justify-center mb-4 group-hover:bg-gradient-purple transition-all duration-300">
              <svg className="w-6 h-6 text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight group-hover:text-purple-600 transition-colors duration-300">Jobs</h2>
            <p className="text-gray-600 text-sm leading-relaxed">Manage job applications</p>
          </div>
        </Link>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl border border-purple-200/60 shadow-soft p-8 hover:shadow-purple transition-all duration-300">
          <h3 className="text-sm font-semibold text-purple-600 mb-3 uppercase tracking-wide">Total Assignments</h3>
          <p className="text-4xl font-semibold gradient-text tracking-tight">
            {loading ? '-' : totalAssignments}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-purple-200/60 shadow-soft p-8 hover:shadow-purple transition-all duration-300">
          <h3 className="text-sm font-semibold text-purple-600 mb-3 uppercase tracking-wide">Pending Tasks</h3>
          <p className="text-4xl font-semibold gradient-text tracking-tight">
            {loading ? '-' : pendingTasks}
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-purple-200/60 shadow-soft p-8 hover:shadow-purple transition-all duration-300">
          <h3 className="text-sm font-semibold text-purple-600 mb-3 uppercase tracking-wide">Active Applications</h3>
          <p className="text-4xl font-semibold gradient-text tracking-tight">
            {loading ? '-' : activeApplications}
          </p>
        </div>
      </div>

      {/* Upcoming Assignments */}
      <div className="bg-white rounded-2xl border border-purple-200/60 shadow-soft p-8">
        <h2 className="text-2xl font-semibold gradient-text mb-8 tracking-tight">Upcoming Assignments</h2>
        
        {loading && (
          <p className="text-gray-600 font-medium">Loading assignments...</p>
        )}
        
        {error && (
          <p className="text-red-600 font-medium">Failed to load assignments.</p>
        )}
        
        {!loading && !error && assignments.length === 0 && (
          <p className="text-gray-600 font-medium">No upcoming assignments.</p>
        )}
        
        {!loading && !error && assignments.length > 0 && (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div 
                key={assignment.id} 
                className="border border-purple-200/60 rounded-xl p-6 hover:shadow-purple hover:border-purple-400/80 transition-all duration-400 bg-gradient-to-r from-white to-purple-50/30"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 tracking-tight">{assignment.title}</h3>
                    <p className="text-sm text-gray-600 mt-2 font-medium">{assignment.course}</p>
                    <p className="text-sm text-gray-500 mt-3 font-medium">
                      Deadline: {formatDate(assignment.deadline)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2.5">
                    <span className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border ${getPriorityColor(assignment.priority)}`}>
                      {assignment.priority || 'N/A'}
                    </span>
                    {assignment.status && (
                      <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-700 border border-purple-200/60">
                        {assignment.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </ProtectedRoute>
  );
}

