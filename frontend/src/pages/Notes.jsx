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
