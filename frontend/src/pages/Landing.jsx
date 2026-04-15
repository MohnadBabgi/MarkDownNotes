import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-hidden relative">
      {/* Background gradient blobs */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
      <div className="absolute top-40 -right-40 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000" />

      <div className="relative z-10">
        <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl font-semibold tracking-tight">
            <span className="text-indigo-600 text-2xl animate-pulse-slow">◆</span>
            Markdown Notes
          </div>
          <nav className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Log in
            </Link>
            <Link
              to="/signup"
              className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all duration-200"
            >
              Sign up
            </Link>
          </nav>
        </header>

        <main className="max-w-6xl mx-auto px-6 pt-24 pb-24 text-center">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight leading-[1.05] animate-fade-in-up">
            Write notes in{' '}
            <span className="relative inline-block">
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
                markdown.
              </span>
            </span>
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
            A clean, fast place to capture ideas. Full markdown support, instant preview,
            and nothing in your way.
          </p>

          <div className="mt-12 flex items-center justify-center gap-4 animate-fade-in-up animation-delay-400">
            <Link
              to="/signup"
              className="group bg-indigo-600 text-white px-7 py-3.5 rounded-md font-medium hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-200 hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2"
            >
              Get started
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
            <Link
              to="/login"
              className="border border-gray-300 bg-white/60 backdrop-blur px-7 py-3.5 rounded-md font-medium hover:bg-white hover:border-gray-400 transition-all duration-200"
            >
              Log in
            </Link>
          </div>

          {/* Mock preview card */}
          <div className="mt-20 max-w-3xl mx-auto animate-fade-in-up animation-delay-600">
            <div className="relative rounded-xl border border-gray-200 bg-white shadow-2xl shadow-indigo-100/50 overflow-hidden">
              <div className="flex items-center gap-1.5 px-4 py-3 border-b border-gray-100 bg-gray-50">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="grid grid-cols-2 text-left">
                <div className="p-6 border-r border-gray-100 font-mono text-sm text-gray-700">
                  <div className="text-gray-400"># My First Note</div>
                  <div className="mt-2">Today I learned about</div>
                  <div>**markdown** and it's</div>
                  <div>really _clean_.</div>
                  <div className="mt-3 text-gray-400">- Fast</div>
                  <div className="text-gray-400">- Simple</div>
                  <div className="text-gray-400">- Yours</div>
                </div>
                <div className="p-6 text-sm">
                  <div className="text-xl font-bold text-gray-900">My First Note</div>
                  <div className="mt-2 text-gray-700">
                    Today I learned about <strong>markdown</strong> and it's really{' '}
                    <em>clean</em>.
                  </div>
                  <ul className="mt-3 list-disc list-inside text-gray-600">
                    <li>Fast</li>
                    <li>Simple</li>
                    <li>Yours</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>

        <section className="max-w-6xl mx-auto px-6 pb-24 grid sm:grid-cols-3 gap-6">
          <Feature
            icon="✎"
            title="Write in Markdown"
            desc="Headings, code blocks, lists — the syntax you already know and love."
            delay="0"
          />
          <Feature
            icon="☰"
            title="Stay Organized"
            desc="All your notes in one place, sorted by when you last touched them."
            delay="100"
          />
          <Feature
            icon="🔒"
            title="Yours, Securely"
            desc="Auth handled by Supabase. Your notes stay private to you."
            delay="200"
          />
        </section>

        <footer className="border-t border-gray-100 py-6 text-center text-sm text-gray-400">
          Built with Express, React, and Postgres.
        </footer>
      </div>
    </div>
  );
}

function Feature({ icon, title, desc, delay }) {
  return (
    <div
      className="group p-6 rounded-xl border border-gray-200 bg-white/70 backdrop-blur hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-100 hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center text-lg group-hover:bg-indigo-100 group-hover:scale-110 transition-all">
        {icon}
      </div>
      <h3 className="mt-4 font-semibold text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}
