import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full relative py-16 flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-white">
        <div className="w-full max-w-[33%] mx-auto text-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">
            Learning made <span className="text-green-600">personal</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 text-center">
            MuinteoirAI helps you learn efficiently by summarizing your documents
            and creating personalized quizzes
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            {/* TODO This upload docuemnt should be a form to accept a PDF. When clicked on 1st pass, call AI to summarise */}
            <button className="w-full sm:w-auto bg-green-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors">
              Upload Document 
            </button>
            <Link href="/login" className="w-full sm:w-auto border border-green-600 text-green-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-green-50 transition-colors">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-16 bg-white">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <h2 className="text-3xl font-bold text-center mb-12">How MuinteoirAI helps you</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-[33%] mx-auto">
            {/* Feature 1 */}
            <div className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Document Summarization</h3>
              <p className="text-gray-600">Upload your study documents and get concise, easy-to-understand summaries</p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Personalized Quizzes</h3>
              <p className="text-gray-600">Test your knowledge with custom quizzes generated from your documents</p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Track Your Progress</h3>
              <p className="text-gray-600">Monitor your learning with detailed progress tracking</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 