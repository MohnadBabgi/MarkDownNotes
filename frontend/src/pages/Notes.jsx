import { useAuth } from '../lib/AuthContext.jsx';

export default function Notes() {
  const { user, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
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
      <main className="max-w-5xl mx-auto px-6 py-12">
        <h1 className="text-2xl font-semibold">Your notes</h1>
        <p className="mt-2 text-gray-600">Notes CRUD coming next.</p>
      </main>
    </div>
  );
}
