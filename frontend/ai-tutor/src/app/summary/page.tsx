'use client';

import { useState } from 'react';

export default function SummaryPage() {
  // Mock data - replace with actual API calls
  const mockPDFs = [
    {
      id: 1,
      title: 'Mathematics Notes',
      date: '2024-03-20',
      size: '2.4 MB'
    },
    {
      id: 2,
      title: 'Physics Study Guide',
      date: '2024-03-19',
      size: '1.8 MB'
    },
    {
      id: 3,
      title: 'Chemistry Lab Report',
      date: '2024-03-18',
      size: '3.1 MB'
    }
  ];
  const [searchQuery, setSearchQuery] = useState('');
  const [pdfs] = useState(mockPDFs);

  const filteredPDFs = pdfs.filter(pdf => 
    pdf.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-12rem)]">
      <h1 className="text-3xl font-bold mb-8">Your Documents</h1>
      
      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search your PDFs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Upload Button - Always visible */}
      <div className="mb-8">
        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
          <span>Upload New Document</span>
        </button>
      </div>

      {/* PDF List */}
      {filteredPDFs.length > 0 ? (
        <div className="space-y-4">
          {filteredPDFs.map(pdf => (
            <div
              key={pdf.id}
              className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{pdf.title}</h3>
                  <p className="text-sm text-gray-500">
                    {new Date(pdf.date).toLocaleDateString()} • {pdf.size}
                  </p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  View Summary
                </button>
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  Create Quiz
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Documents Found</h3>
          <p className="text-gray-600 mb-6">
            {searchQuery ? "No documents match your search" : "Upload your first document to get started"}
          </p>
        </div>
      )}
    </div>
  );
} 