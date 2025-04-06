import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section>
        <h1>
            MuinteoirAI
        </h1>
        <h2>
          Learning Made <span>Personal</span>
        </h2>
        <p>
          MuinteoirAI helps you learn efficiently by summarizing your documents
          and creating personalized quizzes. Not a member yet? Upload your first PDF document 
          now & start learning today.
        </p>
        <div>
          <div>
            <button>
              <Link href="/register"> 
                Register
              </Link>
            </button>
          </div>
          <div>
            <button>
              <Link href="/login"> 
                Login
              </Link>
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <div>
          <h2>How MuinteoirAI helps you</h2>
          <div>
            {/* Feature 1 */}
            <div>
              <div>
                {/* Icon placeholder */}
              </div>
              <h3>Document Summarization</h3>
              <p>Upload your study documents and get concise, easy-to-understand summaries</p>
            </div>

            {/* Feature 2 */}
            <div>
              <div>
                {/* Icon placeholder */}
              </div>
              <h3>Personalized Quizzes</h3>
              <p>Test your knowledge with custom quizzes generated from your documents</p>
            </div>

            {/* Feature 3 */}
            <div>
              <div>
                {/* Icon placeholder */}
              </div>
              <h3>Track Your Progress</h3>
              <p>Monitor your learning with detailed progress tracking</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 