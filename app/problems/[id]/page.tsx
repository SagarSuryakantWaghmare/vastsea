"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { dummyProblems, Problem } from '@/lib/dummy-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import CodeBlock from '@/components/CodeBlock';
import { motion } from 'framer-motion';
import { Clock, Tag, Code } from 'lucide-react';

export default function ProblemPage() {
  const { id } = useParams();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [activeLanguage, setActiveLanguage] = useState('java');
  
  useEffect(() => {
    // In a real app, fetch from API
    const foundProblem = dummyProblems.find(p => p.id === id);
    
    if (foundProblem) {
      setProblem(foundProblem);
      
      // Set default active language to the first available one
      const languages = Object.keys(foundProblem.codes).filter(lang => 
        foundProblem.codes[lang as keyof typeof foundProblem.codes]
      );
      
      if (languages.length > 0) {
        setActiveLanguage(languages[0]);
      }
    }
  }, [id]);
  
  if (!problem) {
    return (
      <div className="container py-10">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Problem not found</h2>
            <p className="text-muted-foreground mt-2">
              The problem you're looking for doesn't exist or has been removed.
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
                <CardDescription className="mt-2 flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>Updated recently</span>
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