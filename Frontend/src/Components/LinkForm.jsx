import { Link as LinkIcon, Sparkles } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { useContext } from 'react';
import { LinksContext } from '../Context/linkContext';


const LinkForm = () => {
      const{links,setLinks,targetLink, setTargetLink,setTinyLink,code, setcode}=useContext(LinksContext)
      const [error, setError] = useState('');
      const [successCode, setSuccessCode] = useState('');

      const API = import.meta.env.VITE_API_URL;


    

      const validateLink=(link)=>{
            if (!link) return false;
        try {
            const u=new URL(link)
            return u.protocol === "http:" || u.protocol === "https:";

        } catch (error) {
                return false;   
        }
      }

    const handleSubmit=async(e)=>{
        e.preventDefault()
        setError('');
        setSuccessCode('');
        const trimmedLink = targetLink.trim();
        const trimmedCode= code.trim()

        if(!validateLink(trimmedLink)){
            setError("Enter a valid http/https Link")
            return 
        }
        try {
            const payload = { targetLink: trimmedLink };
           if (trimmedCode) payload.code = trimmedCode;

            const res = await axios.post(`${API}/api/links`, payload,{
            headers: { "Content-Type": "application/json" }
          });

           const result={
             code: res.data.code || "",
             tinyLink: res.data.tinyLink || "",
             targetLink: res.data.targetLink || trimmedLink,
       }
           if (res?.data?.tinyLink) {
           setTinyLink(res.data.tinyLink);
           setLinks(prev => [result, ...prev]);
         setTargetLink("");
        setcode("");
        
      } else if (res?.data?.code) {
        setTinyLink(`${window.location.origin}/${res.data.code}`);
      } else {
        setError("Unexpected server response.");
      }
      
} catch (error) {
            setError(error?.response?.data?.message ||
        error?.response?.data?.error ||
        error.message ||"An error occurred while creating the short link.")
        }

    }

  return (
     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="w-5 h-5 text-blue-600" />
        <h2>Create Short Link</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="targetLink" className="block text-gray-700 mb-2">
            Target URL <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="targetLink"
            value={targetLink}
            onChange={(e) => setTargetLink(e.target.value)}
            placeholder="https://example.com/your-long-url"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label htmlFor="code" className="block text-gray-700 mb-2">
            Custom Code <span className="text-gray-500">(optional, 6-8 alphanumeric characters)</span>
          </label>
          <input
            type="text"
            id="code"
            value={code}
            onChange={(e) => setcode(e.target.value)}
            placeholder="mycode"
            maxLength={8}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {successCode && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              <span>Short link created: <span className="font-mono">{successCode}</span></span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          Create Short Link
        </button>
      </form>
    </div>
  )
}

export default LinkForm