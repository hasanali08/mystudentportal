export default function AssignmentCard({ assignment }) {
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-50 text-green-700 border-green-200/60';
      case 'In Progress':
        return 'bg-purple-100 text-purple-700 border-purple-200/60';
      case 'Not Started':
        return 'bg-gray-50 text-gray-700 border-gray-200/60';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200/60';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-purple-200/60 shadow-soft p-8 hover:shadow-purple-lg hover:border-purple-400/80 hover:scale-[1.01] transition-all duration-400 group">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-3 tracking-tight group-hover:text-purple-600 transition-colors duration-300">
            {assignment.title}
          </h3>
          <p className="text-sm text-gray-600 mb-2 font-medium">
            <span className="text-gray-500">Course:</span> {assignment.course || 'N/A'}
          </p>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-6 pt-6 border-t border-purple-100">
        <div className="flex flex-col space-y-1">
          <p className="text-sm text-gray-600 font-medium">
            <span className="text-gray-500">Deadline:</span> {formatDate(assignment.deadline)}
          </p>
        </div>
        <div className="flex items-center space-x-2.5">
          {assignment.priority && (
            <span className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border ${getPriorityColor(assignment.priority)} transition-all duration-300`}>
              {assignment.priority}
            </span>
          )}
          {assignment.status && (
            <span className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(assignment.status)} transition-all duration-300`}>
              {assignment.status}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

