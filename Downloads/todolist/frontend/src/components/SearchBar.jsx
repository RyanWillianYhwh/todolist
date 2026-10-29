import { Icon } from './Icons.jsx';

export default function SearchBar({ value, onChange }) {
  return <label className="search-box">
    <Icon name="search" size={17} />
    <span className="sr-only">Search tasks</span>
    <input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search tasks" />
    {value && <button type="button" className="clear-search" onClick={() => onChange('')} aria-label="Clear search"><Icon name="close" size={14} /></button>}
  </label>;
}
