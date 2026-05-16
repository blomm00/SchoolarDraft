import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary-600" />
            <span className="font-bold text-xl text-slate-900">ScholarDraft</span>
          </Link>
          <div className="flex gap-4 items-center">
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2">Dashboard</Link>
            <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">
              US
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
