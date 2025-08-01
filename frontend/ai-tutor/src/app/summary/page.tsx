'use client';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useState } from 'react';
import { Summary } from '@/models/summary';

const BACKEND_URL = "http://backend:4000";
// TODO Move this to .env file once working


const SummaryPage = () => {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [selectedPDF, setSelectedPDF] = useState<Summary | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch summaries from the backend
    const fetchSummaries = async () => {
      try {
        const data = [] as Summary[]; // await fetchWithAuth('/api/v1/documents');
        setSummaries(data || []);
      } catch (error) {
        console.error('Error fetching summaries:', error);
        if (error instanceof Error && error.message === 'Unauthorized') {
          router.push('/login');
        }
      }
    };
    fetchSummaries();
  }, [router]);

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers);
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Basic ${token}`);
    } else {
      throw new Error('Unauthorized');
    }
    try {
      console.log('URL call to: ', `${url}`);
      console.log('Headers: ', headers);
      console.log('Options: ', options);
      console.log('Body: ', options.body);
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: 'include',
      });
      const responseData = await response.json();
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/login');
        }
        const errorData = responseData.message || 'Something went wrong with the API call';
        throw new Error(errorData);
      }
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return responseData;
      }
      return null;
    } catch (error) {
      console.error('API call failed on SummaryPage: ', error);
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this summary?')) {
      try {
        // TODO: Implement delete functionality
        // await fetchWithAuth(`/api/v1/documents/delete/${id}`, {
        //   method: 'DELETE',
        // });
        setSummaries(prev => prev.filter(summary => summary.id !== id));
        alert('Summary successfully deleted.');
      } catch (error) {
        console.error('Error deleting summary:', error);
        alert('Failed to delete summary.');
      }
    }
  };

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append('document', file);
    try {
      const data = await fetchWithAuth(`${BACKEND_URL}/api/v1/documents/summarise`, {
          method: 'POST',
          body: formData,
      });
      if (data) {
        setSummaries(prev => [data, ...prev]);
        alert('PDF uploaded successfully!');
        if (e.target) e.target.value = '';
      }
    } catch (error) {
      console.error('Error uploading PDF:', error);
      alert(`Failed to upload PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const filteredSummaries = summaries.filter((summary: Summary) =>
    summary.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Summaries</h1>
      {/* Search Bar */}
      {summaries.length > 0 && (
        <input
          type="text"
          placeholder="Search PDFs..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
      )}
      {/* No summaries */}
      {summaries.length === 0 ? (
        <div className="text-center">
          <input
            id="upload-document"
            type="file"
            accept="application/pdf"
            onChange={handleUpload}
            className="hidden"
          />
          <button
            onClick={() => document.getElementById('upload-document')?.click()}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            {isUploading ? 'Uploading...' : 'Upload Your First Summary'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSummaries.map((summary) => (
            <div key={summary.id} className="border p-4 rounded shadow hover:shadow-lg">
              <h2 className="font-bold text-lg">{summary.title}</h2>
              <p className="text-sm text-gray-600">
                {summary.summary.slice(0, 100)}...
              </p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => {
                    setSelectedPDF(summary);
                    setShowModal(true);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  View Summary
                </button>
                <button
                  // TODO Alternative: use react-toastify for better UX
                  onClick={() => alert('This feature is not implemented yet.')}
                  className="px-4 py-2 bg-yellow-500 text-white rounded"
                >
                  Create Quiz
                </button>
                <button
                  onClick={() => handleDelete(summary.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && selectedPDF && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-3/4 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{selectedPDF.title}</h2>
            <p>{selectedPDF.summary}</p>
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryPage;
