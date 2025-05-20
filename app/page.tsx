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
    <main className="flex flex-col items-center w-full">
      <div className="w-full py-10 space-y-16">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-8 py-16 px-4">
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-transparent bg-clip-text leading-tight tracking-tight">
            VastSea
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-[700px] leading-relaxed">
            A modern platform for sharing programming problems and solutions in multiple languages
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button asChild size="lg" className="rounded-full px-8 py-6 text-base shadow-lg hover:shadow-xl transition-all">
              <Link href="/problems">
                Browse Problems
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full px-8 py-6 text-base hover:bg-accent transition-all">
              <Link href="/add">
                Add Problem
              </Link>
            </Button>
          </div>
        </section>

        {/* Featured Problems */}
        <section className="space-y-8 px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h2 className="text-3xl font-bold tracking-tight relative">
              <span className="relative z-10">Featured Problems</span>
              <span className="absolute bottom-0 left-0 w-1/2 h-3 bg-blue-500/20 -z-0"></span>
            </h2>
            <Button asChild variant="ghost" className="rounded-full hover:bg-accent/50">
              <Link href="/problems" className="flex items-center gap-2">
                View all
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          {problems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {problems.map((problem) => (
                <ProblemCard key={problem._id} problem={problem} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-accent/20 rounded-xl">
              <p className="text-muted-foreground mb-5 text-lg">No problems found. Be the first to add one!</p>
              <Button asChild className="rounded-full px-6 py-2">
                <Link href="/add">Add Problem</Link>
              </Button>
            </div>
          )}
        </section>

        {/* Languages Section */}
        <section className="space-y-10 py-16 px-4">
          <h2 className="text-3xl font-bold tracking-tight text-center relative inline-block mx-auto">
            <span className="relative z-10">Multiple Language Support</span>
            <span className="absolute bottom-0 left-0 w-full h-3 bg-teal-500/20 -z-0"></span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { name: 'Java', color: 'from-orange-500 to-red-500' },
              { name: 'C', color: 'from-blue-500 to-indigo-600' },
              { name: 'C++', color: 'from-indigo-400 to-purple-600' },
              { name: 'JavaScript', color: 'from-yellow-400 to-amber-600' }
            ].map(({ name, color }) => (
              <div 
                key={name}
                className="bg-card/40 backdrop-blur flex flex-col items-center p-8 rounded-2xl border border-accent/50 shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className={`text-3xl font-mono font-bold mb-3 bg-gradient-to-r ${color} text-transparent bg-clip-text`}>{name}</div>
                <p className="text-sm text-center text-muted-foreground">
                  Browse problems and solutions in {name}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}