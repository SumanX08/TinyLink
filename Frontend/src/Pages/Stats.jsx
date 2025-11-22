import {  useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ExternalLink, ArrowLeft, BarChart3, Clock, Calendar } from 'lucide-react';
import Header from '../Components/Header';
import axios from 'axios';

export default function Stats() {
  const { code } = useParams();
  const navigate = useNavigate();
  const [link, setLink] = useState(null);
  const [isLoading, setIsLoading] = useState(code ? false : true);

  const API = import.meta.env.VITE_API_URL;


  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const res=await axios.get(`${API}/api/links/${code}`);
        if (mounted) {
          setLink({
            code: res.data.code || "",
            targetUrl: res.data.targetLink || "", 
            clicks: res.data.clicks || 0,
            lastClicked: res.data.lastClickedAt || null,
            createdAt: res.data.createdAt || null,
          });
        }
      } catch (err) {
        if (mounted) setLink(null);
        console.error('Failed to fetch link data:', err);
      }
      finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [code, setLink]);
  
  

  const handleOpenLink = async () => {
    if (!link || !link.targetUrl) return;

    setLink((prevLink) => ({
      ...prevLink,
      clicks: prevLink.clicks + 1,
      lastClicked: new Date().toISOString(),
    }));

    try {
      await axios.get(`${API}/api/${code}`);
      window.open( `${API}/api/${code}`,"_blank");

    } catch (err) {
      console.error('Failed to increment clicks:', err);
      setLink((prevLink) => ({
        ...prevLink,
        clicks: prevLink.clicks - 1,
      }));
    }

  };  

  const formatFullDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  // Loading state - simple spinner block
  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Not found (or fetch failed)
  if (!link) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="text-center">
              <h2 className="text-red-600 mb-2">Link Not Found</h2>
              <p className="text-gray-600 mb-6">
                The short link code "{code}" does not exist.
              </p>
              <button
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Normal stats page
  return (
    <div className="min-h-screen">
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-linear-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
            <h1 className="mb-2 text-white">Link Statistics</h1>
            <div className="flex items-center gap-2">
              <span className="font-mono text-blue-100">/{link.code}</span>
              
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-gray-700 mb-2">
                <span>Tiny Link</span>
              </div>
              <a onClick={handleOpenLink}  className="font-mono cursor-pointer text-blue-600 bg-blue-50 px-4 py-3 rounded-lg break-all">
               https://tinylink.com/${link.code}
              </a>
            </div>

            <div>
              <div className="text-gray-700 mb-2">Target URL</div>
              <div className="text-gray-900 bg-gray-50 px-4 py-3 rounded-lg break-all">
                {link.targetUrl}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-linear-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 text-blue-700 mb-2">
                  <BarChart3 className="w-4 h-4" />
                  <span>Total Clicks</span>
                </div>
                <div className="text-blue-900">{typeof link.clicks === 'number' ? link.clicks.toLocaleString() : link.clicks}</div>
              </div>

              <div className="bg-linear-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-2 text-purple-700 mb-2">
                  <Clock className="w-4 h-4" />
                  <span>Last Clicked</span>
                </div>
                <div className="text-purple-900">{formatFullDate(link.lastClicked)}</div>
              </div>

              <div className="bg-linear-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-2 text-green-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Created At</span>
                </div>
                <div className="text-green-900">{formatFullDate(link.createdAt)}</div>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={handleOpenLink}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Open Link
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
