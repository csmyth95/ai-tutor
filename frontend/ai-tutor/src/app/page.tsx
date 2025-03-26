import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-[calc(100vh-12rem)] flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full relative py-20 flex flex-col items-center justify-center bg-gradient-to-b from-black via-black/95 to-black">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            MuinteoirAI
        </h1>
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
          Learning Made <span className="text-green-400">Personal</span>
        </h2>
        <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
          MuinteoirAI helps you learn efficiently by summarizing your documents
          and creating personalized quizzes. Not a member yet? Upload your first PDF document 
          now & start learning today.
        </p>
        <div className="flex flex-col gap-6">
          <div>
            <button className="w-full sm:w-auto bg-green-500 text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-400 transition-all transform hover:scale-105 shadow-lg shadow-green-500/20">
              <Link href="/register"> 
                Register
              </Link>
            </button>
          </div>
          <div>
            <button className="w-full sm:w-auto bg-green-500 text-black px-8 py-4 rounded-lg text-lg font-semibold hover:bg-green-400 transition-all transform hover:scale-105 shadow-lg shadow-green-500/20">
              <Link href="/login"> 
                Login
              </Link>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 flex flex-col items-center">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">How MuinteoirAI helps you</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-[33%] mx-auto">
            {/* Feature 1 */}
            <div className="p-8 rounded-xl border border-green-500/20 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 transition-all transform hover:-translate-y-1 bg-black/30 backdrop-blur-sm">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                {/* Icon placeholder */}
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Document Summarization</h3>
              <p className="text-gray-300 leading-relaxed">Upload your study documents and get concise, easy-to-understand summaries</p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-xl border border-green-500/20 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 transition-all transform hover:-translate-y-1 bg-black/30 backdrop-blur-sm">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                {/* Icon placeholder */}
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Personalized Quizzes</h3>
              <p className="text-gray-300 leading-relaxed">Test your knowledge with custom quizzes generated from your documents</p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-xl border border-green-500/20 hover:border-green-500/40 hover:shadow-lg hover:shadow-green-500/10 transition-all transform hover:-translate-y-1 bg-black/30 backdrop-blur-sm">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-6 mx-auto">
                {/* Icon placeholder */}
              </div>
              <h3 className="text-2xl font-semibold mb-4 text-white">Track Your Progress</h3>
              <p className="text-gray-300 leading-relaxed">Monitor your learning with detailed progress tracking</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 