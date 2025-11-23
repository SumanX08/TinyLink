import  { useContext, useEffect, useState } from 'react';
import {  Trash2  } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LinksContext } from '../Context/linkContext';
import axios from 'axios';

export default function LinkTable(props) {
  const { links, setLinks } = useContext(LinksContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;


  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`${API}/api/links`);
        const dataArray = Array.isArray(res.data)
          ? res.data
          : Array.isArray(res.data?.links)
            ? res.data.links
            : [];
        if (mounted) {
          setLinks(dataArray);
        }
      } catch (err) {
        if (mounted) setLinks([]);
        console.error('Failed to fetch links:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    load();
    return () => { mounted = false; };
  }, [setLinks]);

  const handleDelete = async (code) => {
    if (!window.confirm("Are you sure you want to delete this link?")) return;

    const prevLinks = Array.isArray(links) ? [...links] : [];

    setLinks(prevLinks.filter((l) => l.code !== code));

    try {
      const res = await axios.delete(`${API}/api/links/${code}`, {
        headers: { "Content-Type": "application/json" }
      });

      if (!(res.status >= 200 && res.status < 300)) {
        setLinks(prevLinks);
        alert(res.data?.error || "Failed to delete link on server");
        return;
      }

      if (props.onDelete) props.onDelete(code);
    } catch (err) {
      setLinks(prevLinks);
      alert("Network error while deleting link. Please try again.");
    }
  };

  const handleRedirect =async (code) => {
    try {
        window.open(`${API}/api/${code}`, "_blank", "noopener");

      return res.status
      
    } catch (error) {
      return error
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!links || links.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
        <div className="text-center text-gray-500">
          <p>No short links yet</p>
          <p className="text-gray-400 mt-1">Create your first link above to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
  <div className="px-6 py-4 border-b border-gray-200">
    <h2>Your Links</h2>
  </div>

  <div className="divide-y divide-gray-200">
    <div className="hidden md:grid md:grid-cols-4 gap-4 px-6 py-3 bg-gray-50 text-gray-700 text-sm font-medium border-b">
      <div>Custom Code</div>
      <div>Original Link</div>
      <div>Short Link</div>
      <div className="text-right">Actions</div>
    </div>

    <div>
      {links.map((link) => {
        const code = link.code;
        const shortUrl = link.tinyLink || `${window.location.origin}/${encodeURIComponent(code)}`;

        return (
          <div
            key={code}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
          >
            <div
              onClick={() => navigate(`/code/${encodeURIComponent(code)}`)}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/code/${encodeURIComponent(code)}`)}
              role="link"
              tabIndex={0}
              className="font-mono cursor-pointer text-blue-600 hover:underline px-0 md:px-6"
              title={`View stats for ${code}`}
            >
              {code}
            </div>

            <div className="text-gray-600 truncate px-0 md:px-6" title={link.targetLink}>
              <span className="hidden md:inline">{link.targetLink}</span>
              <span className="md:hidden block wrap-break-words">{link.targetLink}</span>
            </div>

            <div className="px-0 md:px-6">
              <a
                onClick={() => handleRedirect(code)}
                className="text-blue-600 hover:text-blue-700 hover:underline wrap-break-words inline-block"
                target="_blank"
                rel="noopener noreferrer"
                href={shortUrl}
              >
                {shortUrl}
              </a>
            </div>

            <div className="flex items-center gap-2 justify-start md:justify-end px-0 md:px-6">
              <button
                onClick={() => handleDelete(code)}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete link"
                aria-label={`Delete ${code}`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  </div>
</div>

  );
}
