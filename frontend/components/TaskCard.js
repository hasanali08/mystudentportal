export default function TaskCard({ task, onToggleComplete, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleToggleComplete = async () => {
    if (onToggleComplete) {
      await onToggleComplete(task.id, !task.completed);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      if (onDelete) {
        await onDelete(task.id);
      }
    }
  };

  return (
    <div className={`bg-white rounded-2xl border ${task.completed ? 'border-green-200/60 bg-green-50/50' : 'border-purple-200/60'} shadow-soft p-6 hover:shadow-purple-lg hover:border-purple-400/80 hover:scale-[1.01] transition-all duration-400 group`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <input
            type="checkbox"
            checked={task.completed || false}
            onChange={handleToggleComplete}
            className="mt-1 w-5 h-5 text-purple-600 border-purple-300 rounded-md focus:ring-2 focus:ring-purple-500/20 focus:ring-offset-0 cursor-pointer transition-all duration-300"
          />
          <div className="flex-1">
            <h3 className={`text-lg font-semibold tracking-tight ${task.completed ? 'text-gray-400 line-through' : 'text-gray-900 group-hover:text-purple-600'} transition-colors duration-300`}>
              {task.task}
            </h3>
            <p className={`text-sm mt-2 font-medium ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
              Due: {formatDate(task.due_date)}
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="ml-4 px-3.5 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-300"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

