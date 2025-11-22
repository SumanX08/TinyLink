import { Link as RouterLink } from 'react-router-dom';
import { Link as LinkIcon } from 'lucide-react';

const Header=()=> {
  return (
    <header className="bg-white border-b border-gray-200">
  <div className="max-w-6xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
    <div className="flex flex-col items-center justify-center">
      <RouterLink
        to="/"
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors"
      >
        <LinkIcon className="w-7 h-7" />
        <h1 className="font-bold text-2xl">TinyLink</h1>
      </RouterLink>
    </div>
  </div>
</header>

  );
}

export default Header
