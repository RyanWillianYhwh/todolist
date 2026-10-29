import TaskItem from './TaskItem.jsx';

export default function TaskList({ tasks, loading, onToggle, onEdit, onDelete }) {
  if (loading && tasks.length === 0) return <div className="state-message" role="status">Loading tasks…</div>;
  if (tasks.length === 0) return <div className="state-message">You have no pending tasks.</div>;
  return <ul className="task-list" aria-label="Tasks">
    {tasks.map((task) => <TaskItem key={task.id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />)}
  </ul>;
}
