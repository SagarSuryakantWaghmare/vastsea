"use client";

import { useEffect, useState } from 'react';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, Loader2, Clock, User, Tag } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import CodeBlock from '@/components/CodeBlock';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

// Define the interface for problem data
interface Problem {
  _id: string;
  title: string;
  description: string;
  codes: {
    java?: string;
    c?: string;
    cpp?: string;
    js?: string;
    [key: string]: string | undefined;
  };
  tags: string[];
  author?: {
    name: string;
    email: string;
  };
  createdAt: string;
}

interface LanguageMap {
  [key: string]: string;
}

const languageDisplayNames: LanguageMap = {
  java: "Java",
  c: "C",
  cpp: "C++",
  js: "JavaScript"
};

// In Next.js 15, params is a Promise
interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ProblemPage({ params }: PageProps) {
  const [problem, setProblem] = useState<Problem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeLanguage, setActiveLanguage] = useState<string | null>(null);
  useEffect(() => {
    const fetchProblem = async () => {
      setIsLoading(true);
      try {
        // In Next.js 15, params need to be awaited
        const resolvedParams = await params;
        const id = resolvedParams.id;        // Using the simplified API route with query parameter instead of dynamic route
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        // Add retry mechanism for resilience
        let retries = 0;
        let response;
        
        while (retries < 3) {
          try {
            response = await fetch(`/api/problems?id=${id}`, {
              cache: 'no-store',
              next: { revalidate: 0 },
              signal: controller.signal,
              headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'X-Requested-With': 'XMLHttpRequest'
              }
            });
            
            if (response.ok) break;
            
            // If we get a 404, no need to retry - it's a not found
            if (response.status === 404) {
              notFound();
            }
            
            // If we get a 5xx error, retry
            if (response.status >= 500) {
              retries++;
              await new Promise(r => setTimeout(r, 1000 * retries));
              console.log(`Retrying request (${retries}/3)...`);
              continue;
            }
            
            // For non-5xx errors, don't retry
            break;
          } catch (fetchError) {
            if (retries >= 2) throw fetchError;
            retries++;
            await new Promise(r => setTimeout(r, 1000 * retries));
            console.log(`Retrying after fetch error (${retries}/3)...`, fetchError);
          }
        }
        
        clearTimeout(timeoutId);

        if (!response || !response.ok) {
          throw new Error(`Error ${response?.status || 'Unknown'}: ${response?.statusText || 'Unknown Error'}`);
        }

        // Handle potential HTML response instead of JSON
        let data;
        try {
          const responseText = await response.text();
          
          // Check if response looks like HTML (might be an error page)
          if (responseText.trim().startsWith('<!DOCTYPE') || responseText.trim().startsWith('<html')) {
            console.error('Received HTML instead of JSON:', responseText.substring(0, 100) + '...');
            throw new Error('Server returned HTML instead of JSON. The API might be experiencing issues.');
          }
          
          // Parse JSON manually after checking
          data = JSON.parse(responseText);
        } catch (parseError: any) {
          console.error('JSON Parse Error:', parseError);
          throw new Error(`Failed to parse response: ${parseError.message}`);
        }
        setProblem(data);
        
        // Set the first available language as active
        if (data.codes) {
          const availableLanguages = Object.keys(data.codes).filter(lang => data.codes[lang]);
          if (availableLanguages.length > 0) {
            setActiveLanguage(availableLanguages[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching problem:', err);
        setError('Failed to load problem details.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblem();
  }, [params]);

  if (isLoading) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[50vh]">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading problem details...</p>
        </div>
      </div>
    );
  }

  if (error || !problem) {
    return (
      <div className="container py-10">
        <div className="space-y-4 text-center">
          <h1 className="text-2xl font-bold text-red-500">Error Loading Problem</h1>
          <p className="text-muted-foreground">{error || 'Problem not found'}</p>
          <Button asChild>
            <Link href="/problems">Back to problems</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Get available language codes
  const availableLanguages = Object.keys(problem.codes || {}).filter(lang => problem.codes[lang]);
  
  // Format the creation date
  const formattedDate = problem.createdAt 
    ? formatDistanceToNow(new Date(problem.createdAt), { addSuffix: true })
    : '';

  return (
    <div className="container py-8">
      {/* Back button */}
      <div className="mb-8">
        <Button variant="outline" size="sm" asChild>
          <Link href="/problems" className="flex items-center">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to problems
          </Link>
        </Button>
      </div>
      
      {/* Problem header */}
      <div className="space-y-6 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">{problem.title}</h1>
        
        <div className="flex flex-wrap gap-2 items-center">
          {problem.author && (
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="h-4 w-4 mr-1" />
              <span>{problem.author.name}</span>
            </div>
          )}
          
          {formattedDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>{formattedDate}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {problem.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              <Tag className="h-3 w-3 mr-1" />
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Problem description */}
      <div className="prose prose-stone dark:prose-invert max-w-none mb-10">
        <h2 className="text-2xl font-semibold mb-4">Description</h2>
        <div className="whitespace-pre-line">{problem.description}</div>
      </div>
      
      {/* Code solutions */}
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold">Solutions</h2>
        
        {availableLanguages.length > 0 ? (
          <Tabs 
            defaultValue={activeLanguage || availableLanguages[0]} 
            onValueChange={setActiveLanguage as (value: string) => void}
            className="w-full"
          >
            <TabsList className="mb-4">
              {availableLanguages.map((language) => (
                <TabsTrigger key={language} value={language}>
                  {languageDisplayNames[language] || language}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {availableLanguages.map((language) => (
              <TabsContent key={language} value={language}>
                {activeLanguage && problem.codes[activeLanguage] && (
                  <CodeBlock 
                    code={problem.codes[activeLanguage] || ''} 
                    language={activeLanguage} 
                  />
                )}
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div className="text-muted-foreground bg-muted p-4 rounded-lg">
            No code solutions available for this problem.
          </div>
        )}
      </div>
    </div>
  );
}
