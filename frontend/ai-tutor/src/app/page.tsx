import Link from 'next/link';
import { BrainIcon, UploadIcon, BookIcon } from '@/components/icons';

export default function HomePage() {
  return (
    <div className="bg-gradient-mint">
      {/* Hero Section */}
      <section className="section-container py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900">
            Your AI-Powered{' '}
            <span className="text-green-500">Learning Tutor</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Transform your study materials into personalized learning experiences.
            Upload documents, get AI-generated summaries, and master any subject
            with intelligent quizzes.
          </p>
          <Link href="/register" className="btn-primary text-lg px-8 py-4 inline-block">
            Start Learning Today
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-container py-16 md:py-20">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            How MuinteoirAI Helps You Learn
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
            Our AI-powered platform makes learning more efficient and engaging
            through three simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* Feature 1: Upload Documents */}
          <div className="feature-card text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-2xl mb-6">
              <UploadIcon className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
              Upload Your Documents
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Simply upload any study material - PDFs, Word docs, presentations,
              or text files. Our AI instantly processes your content and prepares
              it for learning.
            </p>
          </div>

          {/* Feature 2: Smart Summaries */}
          <div className="feature-card text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-2xl mb-6">
              <BookIcon className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
              Get Smart Summaries
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Our AI analyzes your documents and creates clear, concise summaries
              highlighting key concepts, main ideas, and important details you
              need to know.
            </p>
          </div>

          {/* Feature 3: Practice Quizzes */}
          <div className="feature-card text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-2xl mb-6">
              <BrainIcon className="w-8 h-8 text-green-500" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3">
              Practice with Quizzes
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Test your knowledge with AI-generated quizzes tailored to your
              content. Get instant feedback and track your progress as you master
              the material.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Banner Section */}
      <section className="bg-green-500 py-16 md:py-20">
        <div className="section-container text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Learning?
          </h2>
          <p className="text-base md:text-lg text-white/90 mb-8 max-w-xl mx-auto">
            Join thousands of students who are already learning smarter with
            MuinteoirAI
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors duration-200"
          >
            Get Started for Free
          </Link>
        </div>
      </section>
    </div>
  );
}
