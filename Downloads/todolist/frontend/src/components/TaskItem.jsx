import { Icon } from './Icons.jsx';

function isOverdue(task) {
  if (task.completed || !task.due_date) return false;
  const due = String(task.due_date).slice(0, 10);
  const today = new Date();
  const localToday = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  return due < localToday;
}

export default function TaskItem({ task, onToggle, onEdit, onDelete }) {
  const overdue = isOverdue(task);
  return <li className={`task-row${task.completed ? ' is-complete' : ''}`}>
    <span className="task-copy">
      <span className={`task-title${overdue ? ' overdue' : ''}`}>{task.title}</span>
      {overdue && <span className="overdue-badge">Em atraso</span>}
      {task.due_date && <span className="due-date">{new Date(`${String(task.due_date).slice(0, 10)}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
    </span>
    <span className="task-actions">
      <button type="button" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`} title="Edit task"><Icon name="edit" /></button>
      <button type="button" onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`} title="Delete task"><Icon name="trash" /></button>
    </span>
    <button className={`task-check${task.completed ? ' checked' : ''}`} type="button" aria-label={task.completed ? `Mark ${task.title} as pending` : `Mark ${task.title} as completed`} aria-pressed={task.completed} onClick={() => onToggle(task)}>
      {task.completed && <span aria-hidden="true">✓</span>}
    </button>
  </li>;
}
