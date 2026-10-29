import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icons.jsx';

export default function TaskModal({ task, onClose, onSave, saving }) {
  const [title, setTitle] = useState(task?.title || '');
  const [dueDate, setDueDate] = useState(task?.due_date ? String(task.due_date).slice(0, 10) : '');
  const [validation, setValidation] = useState('');
  const titleRef = useRef(null);
  useEffect(() => {
    titleRef.current?.focus();
    const onKey = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  async function submit(event) {
    event.preventDefault();
    if (!title.trim()) { setValidation('Please enter a task title.'); titleRef.current?.focus(); return; }
    setValidation('');
    await onSave({ title: title.trim(), dueDate: dueDate || null });
  }
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="task-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <button className="modal-close" type="button" onClick={onClose} aria-label="Close"><Icon name="close" /></button>
      <h2 id="modal-title">{task ? 'Edit Task' : 'Create Task'}</h2>
      <form onSubmit={submit}>
        <label htmlFor="task-title">Title</label>
        <input ref={titleRef} id="task-title" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={255} placeholder="What needs to get done?" aria-required="true" aria-invalid={Boolean(validation)} />
        {validation && <p className="field-error">{validation}</p>}
        <label htmlFor="task-due-date">Due date <span>(optional)</span></label>
        <input id="task-due-date" type="date" value={dueDate} onChange={(event) => setDueDate(event.target.value)} />
        <div className="modal-actions">
          <button type="button" className="button-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="button-primary" disabled={saving}>{saving ? 'Saving…' : task ? 'Save changes' : 'Create Task'}</button>
        </div>
      </form>
    </section>
  </div>;
}
