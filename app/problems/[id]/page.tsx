"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Car                {availableLanguages.map(lang => (
                  <TabsContent key={lang.value} value={lang.value} className="mt-4 rounded-lg">
                    <CodeBlock
                      code={problem.codes[lang.value] || '// No code available for this language'}
                      language={lang.value === 'js' ? 'javascript' : lang.value}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </div>tent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CodeBlock from '@/components/CodeBlock';
import { motion } from 'framer-motion';
import { Clock, Tag, Code, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Define interface for problem data
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

export default function ProblemPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [activeLanguage, setActiveLanguage] = useState('java');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProblem = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/problems/${id}`);
        
        if (!response.ok) {
          throw new Error('Problem not found');
        }
        
        const data = await response.json();
        setProblem(data.problem);
        
        // Set default active language to the first available one
        if (data.problem && data.problem.codes) {
          const languages = Object.keys(data.problem.codes).filter(lang => 
            data.problem.codes[lang]
          );
          
          if (languages.length > 0) {
            setActiveLanguage(languages[0]);
          }
        }
      } catch (error) {
        console.error('Error fetching problem:', error);
        setError('Failed to load problem');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProblem();
    }
  }, [id]);
  
  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-pulse flex flex-col items-center gap-4">
              <div className="h-8 bg-gray-200 rounded w-80"></div>
              <div className="h-4 bg-gray-200 rounded w-40"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !problem) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Problem not found</h2>
            <p className="text-muted-foreground mt-2">
              {error || "The problem you're looking for doesn't exist or has been removed."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get available languages for this problem
  const availableLanguages = Object.entries(problem.codes)
    .filter(([_, code]) => code)
    .map(([lang]) => {
      const displayNames: Record<string, string> = {
        java: 'Java',
        c: 'C',
        cpp: 'C++',
        js: 'JavaScript'
      };
      return { value: lang, display: displayNames[lang] || lang };
    });

  // Language color mapping
  const languageColors: Record<string, string> = {
    java: 'from-blue-500 to-purple-500',
    c: 'from-gray-500 to-gray-700',
    cpp: 'from-blue-600 to-blue-800',
    js: 'from-yellow-400 to-yellow-600',
  };

  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border shadow-sm bg-card">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <CardTitle className="text-3xl font-bold">{problem.title}</CardTitle>
                {problem.author && (
                  <div className="mt-2 flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <span className="font-medium">{problem.author.name}</span>
                  </div>
                )}
                <CardDescription className="mt-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {problem.createdAt ? formatDistanceToNow(new Date(problem.createdAt), { addSuffix: true }) : 'Recently added'}
                  </span>
                </CardDescription>
              </div>
              <div className="flex flex-wrap gap-2">
                {problem.tags.map(tag => (
                  <Badge key={tag} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Problem Description */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Problem Description
              </h3>
              <div className="prose dark:prose-invert">
                <p>{problem.description}</p>
              </div>
            </div>
            
            {/* Code Solutions */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Code className="h-5 w-5" />
                Solution
              </h3>
              
              <Tabs 
                defaultValue={activeLanguage} 
                value={activeLanguage}
                onValueChange={setActiveLanguage}
                className="w-full"
              >
                <TabsList className="w-full justify-start overflow-auto">
                  {availableLanguages.map(lang => (
                    <TabsTrigger 
                      key={lang.value} 
                      value={lang.value}
                      className="flex items-center gap-2"
                    >
                      <div 
                        className={`h-3 w-3 rounded-full bg-gradient-to-r ${languageColors[lang.value] || 'from-gray-500 to-gray-700'}`}
                      ></div>
                      {lang.display}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {availableLanguages.map(lang => (
                  <TabsContent key={lang.value} value={lang.value} className="mt-4 rounded-lg">
                    <CodeBlock 
                      code={problem.codes[lang.value as keyof typeof problem.codes] || ''} 
                      language={lang.value === 'cpp' ? 'cpp' : lang.value}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}