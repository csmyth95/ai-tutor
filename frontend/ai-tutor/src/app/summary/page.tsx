import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Summary } from '@/models/summary';
import axiosInstance from '@/util/axiosInstance';


const SummaryPage = () => {
  const [summaries, setSummaries] = useState<Summary[]>([]);
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Fetch summaries from the backend
    const fetchSummaries = async () => {
      try {
        const response = await axiosInstance.get('/api/v1/documents', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setSummaries(response.data);
      } catch (error) {
        console.error('Error fetching summaries:', error);
        if (error.response?.status === 401) {
          router.push('/login'); // Redirect to login if unauthorized
        }
      }
    };

    fetchSummaries();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this summary?')) {
      try {
        await axios.delete(`/api/v1/documents/delete/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setSummaries(summaries.filter((summary: Summary) => summary.id !== id));
        alert('Summary successfully deleted.');
      } catch (error) {
        console.error('Error deleting summary:', error);
        alert('Failed to delete summary.');
      }
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredSummaries = summaries.filter((summary: Summary) =>
    summary.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Summaries</h1>
      <input
        type="text"
        placeholder="Search PDFs..."
        value={searchQuery}
        onChange={handleSearch}
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      {summaries.length === 0 ? (
        <div className="text-center">
          <p>No summaries found.</p>
          <button
            onClick={() => router.push('/upload')}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            Upload Your First Summary
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSummaries.map((summary: Summary) => (
            <div
              key={summary.id}
              className="border p-4 rounded shadow hover:shadow-lg"
            >
              <h2 className="font-bold text-lg">{summary.title}</h2>
              <p className="text-sm text-gray-600">
                {summary.summary.slice(0, 100)}...
              </p>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => {
                    setSelectedPDF(summary: Summary);
                    setShowModal(true);
                  }}
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  View Summary
                </button>
                <button
                  // TODO Alternative: use react-toastify for better UX
                  onClick={() => alert('This feature is not implemented yet.')
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
            <p>{selectedPDF.text}</p>
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
