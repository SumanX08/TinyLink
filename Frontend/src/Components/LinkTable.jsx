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
      console.error("Delete failed:", err);
      alert("Network error while deleting link. Please try again.");
    }
  };

  const handleRedirect =async (code) => {
    try {
      const res=axios.get(`${API}/api/${code}`); 
      window.open( `${API}/api/${code}`,"_blank");
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

      {/* Desktop table view */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-gray-700">Custom Code</th>
              <th className="px-6 py-3 text-left text-gray-700">Original Link</th>
              <th className="px-6 py-3 text-left text-gray-700">Short Link</th>
              <th className="px-6 py-3 text-left text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {links.map((link) => {
              const code = link.code;
              const shortUrl = `https://tinylink/${code}`;
              return (
                <tr key={code} className="hover:bg-gray-50 transition-colors">
                  <td
                    onClick={() => navigate(`/code/${code}`)}
                    className="px-6 py-4 font-mono  cursor-pointer text-blue-600 hover:underline"
                  >
                    {code}
                  </td>                 
                   <td className="px-6 py-4 text-gray-600 truncate" title={link.targetLink}>{link.targetLink}</td>
                  <td className="px-6 py-4">
                    <a
                       onClick={()=>handleRedirect(code)}
                      className="text-blue-600 hover:text-blue-700 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {shortUrl}
                    </a>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(code)}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete link"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
