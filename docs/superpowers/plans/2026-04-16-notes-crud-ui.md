# Notes CRUD UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a fully functional Notes page with sidebar note list, side-by-side markdown editor/preview, and full CRUD operations against the existing backend API.

**Architecture:** Single-page Notes view with three regions: sidebar (note list + new button), editor textarea, and live markdown preview. An API helper module handles fetch calls with Supabase JWT auth. State lives in the Notes page component — no global state needed beyond auth.

**Tech Stack:** React 18, react-markdown (already installed), Tailwind CSS, Supabase auth (for JWT tokens), fetch API

---

## File Structure

| Action | File | Responsibility |
|--------|------|---------------|
| Create | `frontend/src/lib/api.js` | Fetch wrapper that attaches Supabase JWT to all backend requests |
| Rewrite | `frontend/src/pages/Notes.jsx` | Main notes page: sidebar, editor, preview, all CRUD state |
| Modify | `frontend/src/index.css` | Add markdown prose styles for the preview pane |

---

### Task 1: API Helper Module

**Files:**
- Create: `frontend/src/lib/api.js`

- [ ] **Step 1: Create the API helper**

```js
// frontend/src/lib/api.js
import { supabase } from './supabase.js';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function request(path, options = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token}`,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || res.statusText);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const notesApi = {
  list: () => request('/api/notes'),
  get: (id) => request(`/api/notes/${id}`),
  create: (title, content) => request('/api/notes', {
    method: 'POST',
    body: JSON.stringify({ title, content }),
  }),
  update: (id, title, content) => request(`/api/notes/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ title, content }),
  }),
  delete: (id) => request(`/api/notes/${id}`, { method: 'DELETE' }),
};
```

- [ ] **Step 2: Add VITE_API_URL to frontend env example**

In `frontend/.env.example`, add:
```
VITE_API_URL=http://localhost:4000
```

- [ ] **Step 3: Commit**

```bash
git add frontend/src/lib/api.js frontend/.env.example
git commit -m "feat: add API helper with Supabase JWT auth"
```

---

### Task 2: Notes Page — Sidebar and Note List

**Files:**
- Rewrite: `frontend/src/pages/Notes.jsx`

- [ ] **Step 1: Build the Notes page with sidebar, list, and new-note button**

Replace the entire `Notes.jsx` with:

```jsx
// frontend/src/pages/Notes.jsx
import { useEffect, useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { useAuth } from '../lib/AuthContext.jsx';
import { notesApi } from '../lib/api.js';

export default function Notes() {
  const { user, signOut } = useAuth();
  const [notes, setNotes] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Load notes on mount
  useEffect(() => {
    notesApi.list().then((data) => {
      setNotes(data);
      if (data.length > 0) {
        setActiveId(data[0].id);
        setTitle(data[0].title);
        setContent(data[0].content);
      }
    });
  }, []);

  // Select a note
  const selectNote = useCallback((note) => {
    setActiveId(note.id);
    setTitle(note.title);
    setContent(note.content);
  }, []);

  // Create new note
  const createNote = useCallback(async () => {
    const note = await notesApi.create('Untitled', '');
    setNotes((prev) => [note, ...prev]);
    setActiveId(note.id);
    setTitle(note.title);
    setContent(note.content);
  }, []);

  // Save current note
  const saveNote = useCallback(async () => {
    if (!activeId) return;
    setSaving(true);
    try {
      const updated = await notesApi.update(activeId, title, content);
      setNotes((prev) => prev.map((n) => (n.id === activeId ? updated : n)));
    } finally {
      setSaving(false);
    }
  }, [activeId, title, content]);

  // Delete current note
  const deleteNote = useCallback(async () => {
    if (!activeId || !confirm('Delete this note?')) return;
    setDeleting(true);
    try {
      await notesApi.delete(activeId);
      setNotes((prev) => {
        const remaining = prev.filter((n) => n.id !== activeId);
        if (remaining.length > 0) {
          setActiveId(remaining[0].id);
          setTitle(remaining[0].title);
          setContent(remaining[0].content);
        } else {
          setActiveId(null);
          setTitle('');
          setContent('');
        }
        return remaining;
      });
    } finally {
      setDeleting(false);
    }
  }, [activeId]);

  const activeNote = notes.find((n) => n.id === activeId);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shrink-0">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="text-indigo-600 font-semibold">◆ Markdown Notes</div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.email}</span>
            <button
              onClick={signOut}
              className="text-sm border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50 transition"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0">
          <div className="p-3 border-b border-gray-100">
            <button
              onClick={createNote}
              className="w-full bg-indigo-600 text-white text-sm px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              + New note
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto">
            {notes.map((note) => (
              <button
                key={note.id}
                onClick={() => selectNote(note)}
                className={`w-full text-left px-4 py-3 border-b border-gray-50 transition ${
                  note.id === activeId
                    ? 'bg-indigo-50 border-l-2 border-l-indigo-600'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="text-sm font-medium text-gray-900 truncate">
                  {note.title || 'Untitled'}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {new Date(note.updated_at).toLocaleDateString()}
                </div>
              </button>
            ))}
            {notes.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-8">No notes yet</p>
            )}
          </nav>
        </aside>

        {/* Main content */}
        {activeNote ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Title bar */}
            <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center gap-3 shrink-0">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Note title..."
                className="flex-1 text-lg font-semibold bg-transparent outline-none placeholder-gray-300"
              />
              <button
                onClick={saveNote}
                disabled={saving}
                className="text-sm bg-indigo-600 text-white px-4 py-1.5 rounded-md hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                {saving ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={deleteNote}
                disabled={deleting}
                className="text-sm border border-red-300 text-red-600 px-4 py-1.5 rounded-md hover:bg-red-50 disabled:opacity-50 transition"
              >
                Delete
              </button>
            </div>

            {/* Editor + Preview */}
            <div className="flex-1 grid grid-cols-2 overflow-hidden">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your markdown here..."
                className="p-6 text-sm font-mono bg-white border-r border-gray-200 resize-none outline-none overflow-y-auto"
              />
              <div className="p-6 overflow-y-auto bg-white prose prose-sm prose-indigo max-w-none">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <p className="text-lg">No note selected</p>
              <p className="text-sm mt-1">Create a new note or select one from the sidebar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/Notes.jsx
git commit -m "feat: build Notes page with sidebar, editor, and markdown preview"
```

---

### Task 3: Markdown Preview Styles

**Files:**
- Modify: `frontend/src/index.css`

- [ ] **Step 1: Add Tailwind typography plugin**

```bash
cd frontend && npm install -D @tailwindcss/typography
```

- [ ] **Step 2: Update tailwind.config.js to include the typography plugin**

Add the plugin to `frontend/tailwind.config.js`:

```js
// frontend/tailwind.config.js
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {} },
  plugins: [require('@tailwindcss/typography')],
};
```

- [ ] **Step 3: Commit**

```bash
git add frontend/tailwind.config.js frontend/package.json frontend/package-lock.json
git commit -m "feat: add Tailwind typography plugin for markdown prose styles"
```

---

### Task 4: Keyboard Shortcut for Save

**Files:**
- Modify: `frontend/src/pages/Notes.jsx`

- [ ] **Step 1: Add Ctrl+S / Cmd+S save shortcut**

Add this `useEffect` inside the `Notes` component, after the `saveNote` callback:

```jsx
// Ctrl+S / Cmd+S to save
useEffect(() => {
  const handler = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      saveNote();
    }
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, [saveNote]);
```

- [ ] **Step 2: Commit**

```bash
git add frontend/src/pages/Notes.jsx
git commit -m "feat: add Ctrl+S keyboard shortcut to save notes"
```

---

### Task 5: Smoke Test the Full Flow

- [ ] **Step 1: Start the stack**

```bash
docker compose up -d
cd frontend && npm install && npm run dev
```

- [ ] **Step 2: Manual smoke test checklist**

1. Log in at `http://localhost:5173/login`
2. Verify empty state shows "No notes yet" + "No note selected"
3. Click "+ New note" — new "Untitled" note appears in sidebar and is selected
4. Type a title, type markdown content, verify live preview renders
5. Click "Save" — verify no errors
6. Refresh the page — verify the note persists
7. Create a second note — verify both appear in sidebar
8. Switch between notes — verify content loads correctly
9. Delete a note — verify confirm dialog, note removed, another note selected
10. Press Ctrl+S — verify save works via keyboard

- [ ] **Step 3: Final commit if any tweaks were needed**

```bash
git add -A
git commit -m "chore: polish notes UI after smoke testing"
```
