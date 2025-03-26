import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 gap-8 text-center">
      <main className="max-w-screen-md">
        <h1 className="text-4xl sm:text-6xl font-bold">
          Welcome to MuinteoirAI
        </h1>
        <p className="mt-4 text-lg sm:text-xl">
          MuinteoirAI is your personal AI tutor, designed to help you learn and
          master any subject.
        </p>
        <div className="mt-8">
          <Link
            href="/home"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
          >
            Get Started
          </Link>
        </div>
      </main>
    </div>
  );
}
