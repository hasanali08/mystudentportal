export default function JobCard({ job, onStatusUpdate, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Applied':
        return 'bg-purple-100 text-purple-700 border-purple-200/60';
      case 'Interview':
        return 'bg-purple-200 text-purple-800 border-purple-300/60';
      case 'Offer':
        return 'bg-green-50 text-green-700 border-green-200/60';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border-red-200/60';
      case 'Withdrawn':
        return 'bg-gray-50 text-gray-700 border-gray-200/60';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200/60';
    }
  };

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    if (onStatusUpdate) {
      await onStatusUpdate(job.id, newStatus);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      if (onDelete) {
        await onDelete(job.id);
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-purple-200/60 shadow-soft p-8 hover:shadow-purple-lg hover:border-purple-400/80 hover:scale-[1.01] transition-all duration-400 group">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight group-hover:text-purple-600 transition-colors duration-300">
            {job.company}
          </h3>
          {job.role && (
            <p className="text-sm text-gray-600 mb-2 font-medium">
              <span className="text-gray-500">Role:</span> {job.role}
            </p>
          )}
          {job.location && (
            <p className="text-sm text-gray-600 mb-2 font-medium">
              <span className="text-gray-500">Location:</span> {job.location}
            </p>
          )}
          {job.notes && (
            <p className="text-sm text-gray-500 mt-3 line-clamp-2 leading-relaxed">{job.notes}</p>
          )}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-purple-100">
        <div className="flex flex-col space-y-2">
          <p className="text-sm text-gray-600 font-medium">
            <span className="text-gray-500">Applied:</span> {formatDate(job.applied_date)}
          </p>
          {job.job_link && (
            <a 
              href={job.job_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-purple-600 hover:text-purple-700 font-medium transition-colors duration-300 inline-flex items-center gap-1.5"
            >
              View Job Posting
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
        <div className="flex items-center space-x-2.5">
          <select
            value={job.status || ''}
            onChange={handleStatusChange}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(job.status)} focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-400 transition-all duration-300 cursor-pointer`}
          >
            <option value="">Select Status</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
            <option value="Withdrawn">Withdrawn</option>
          </select>
          <button
            onClick={handleDelete}
            className="px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

