import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { taskApi } from './services/api.js';
import { useDebounce } from './hooks/useDebounce.js';
import SearchBar from './components/SearchBar.jsx';
import TaskList from './components/TaskList.jsx';
import TaskModal from './components/TaskModal.jsx';
import { Icon } from './components/Icons.jsx';

function sortTasks(tasks) {
  return [...tasks].sort((a, b) => {
    const ad = a.due_date ? String(a.due_date).slice(0, 10) : null;
    const bd = b.due_date ? String(b.due_date).slice(0, 10) : null;
    if (ad && bd && ad !== bd) return ad.localeCompare(bd);
    if (ad && !bd) return -1;
    if (!ad && bd) return 1;
    return String(b.created_at || '').localeCompare(String(a.created_at || '')) || Number(b.id) - Number(a.id);
  });
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [search, setSearch] = useState('');
  const delayedSearch = useDebounce(search, 400);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [modalTask, setModalTask] = useState(undefined);
  const [toast, setToast] = useState('');
  const requestSerial = useRef(0);

  const refresh = useCallback(async (query = delayedSearch) => {
    const serial = ++requestSerial.current;
    setLoading(true);
    try {
      const result = await taskApi.list(query);
      if (serial !== requestSerial.current) return;
      setTasks(sortTasks(result.tasks || []));
      setTotal(Number(result.total) || 0);
      setCompleted(Number(result.completed) || 0);
      setError('');
    } catch (err) { if (serial === requestSerial.current) setError(err.message); }
    finally { if (serial === requestSerial.current) setLoading(false); }
  }, [delayedSearch]);

  useEffect(() => { refresh(delayedSearch); }, [delayedSearch, refresh]);
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const visibleTasks = useMemo(() => sortTasks(tasks), [tasks]);
  async function saveTask(values) {
    setSaving(true);
    try {
      if (modalTask) await taskApi.update(modalTask.id, values);
      else await taskApi.create(values);
      setModalTask(undefined);
      await refresh();
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  }
  async function toggleTask(task) {
    const next = !task.completed;
    setTasks((items) => sortTasks(items.map((item) => item.id === task.id ? { ...item, completed: next } : item)));
    setCompleted((count) => Math.max(0, count + (next ? 1 : -1)));
    try { await taskApi.update(task.id, { completed: next }); }
    catch (err) { setTasks((items) => items.map((item) => item.id === task.id ? { ...item, completed: task.completed } : item)); setCompleted((count) => Math.max(0, count + (next ? -1 : 1))); setError(err.message); }
  }
  async function deleteTask(task) {
    try {
      await taskApi.remove(task.id);
      setTasks((items) => items.filter((item) => item.id !== task.id));
      setTotal((count) => Math.max(0, count - 1));
      if (task.completed) setCompleted((count) => Math.max(0, count - 1));
      setToast('Task deleted');
    } catch (err) { setError(err.message); }
  }
  const date = new Date();
  return <main className="page-shell">
    <section className="todo-card" aria-label="To-do list">
      <header className="card-header">
        <div className="date-block"><span className="date-number">{date.getDate()}</span><span className="date-month">{date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}<br />{date.getFullYear()}</span></div>
        <div className="date-weekday">{date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase()}</div>
      </header>
      <div className="stats-line"><span>to<span className="brand-star">*</span>do.</span><span>{completed} of {total} completed</span></div>
      <SearchBar value={search} onChange={setSearch} />
      {error && <div className="error-banner" role="alert"><span>{error}</span><button type="button" onClick={() => refresh()}>Retry</button></div>}
      <div className="list-area" aria-busy={loading}>
        <TaskList tasks={visibleTasks} loading={loading} onToggle={toggleTask} onEdit={setModalTask} onDelete={deleteTask} />
      </div>
      {loading && tasks.length > 0 && <div className="refresh-indicator" role="status">Updating…</div>}
      <button type="button" className="floating-add" onClick={() => setModalTask(null)} aria-label="Create Task"><Icon name="plus" size={24} /></button>
    </section>
    {modalTask !== undefined && <TaskModal task={modalTask} onClose={() => setModalTask(undefined)} onSave={saveTask} saving={saving} />}
    {toast && <div className="toast" role="status">{toast}</div>}
  </main>;
}
