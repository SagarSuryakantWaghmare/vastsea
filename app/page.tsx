import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProblemCard } from '@/components/ProblemCard';
import { connectToDatabase } from '@/lib/db/mongodb';
import Problem from '@/lib/db/models/Problem';

async function getProblems() {
  try {
    await connectToDatabase();
    
    // Get the latest problems
    const problems = await Problem.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('author', 'name email')
      .lean();
      
    return JSON.parse(JSON.stringify(problems));
  } catch (error) {
    console.error('Error fetching problems:', error);
    return [];
  }
}

export default async function Home() {
  const problems = await getProblems();
  
  return (
    <main className="flex flex-col items-center">
      <div className="container max-w-screen-xl py-10 space-y-16">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-6 py-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text">
            VastSea
          </h1>
          <p className="text-xl text-muted-foreground max-w-[600px]">
            A modern platform for sharing programming problems and solutions in multiple languages
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button asChild size="lg">
              <Link href="/problems">
                Browse Problems
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/add">
                Add Problem
              </Link>
            </Button>
          </div>
        </section>

        {/* Featured Problems */}
        <section className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold tracking-tight">Featured Problems</h2>
            <Button asChild variant="ghost">
              <Link href="/problems">
                View all
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {problems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {problems.map((problem) => (
                <ProblemCard key={problem._id} problem={problem} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-muted-foreground mb-4">No problems found. Be the first to add one!</p>
              <Button asChild>
                <Link href="/add">Add Problem</Link>
              </Button>
            </div>
          )}
        </section>

        {/* Languages Section */}
        <section className="space-y-8 py-8">
          <h2 className="text-3xl font-bold tracking-tight text-center">
            Multiple Language Support
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {['Java', 'C', 'C++', 'JavaScript'].map((language) => (
              <div 
                key={language}
                className="bg-card flex flex-col items-center p-8 rounded-lg border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-2xl font-mono font-bold mb-2">{language}</div>
                <p className="text-sm text-center text-muted-foreground">
                  Browse problems and solutions in {language}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}