"use client";

import { useState, useEffect } from 'react';
import { ProblemCard } from '@/components/ProblemCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languages = ["All", "java", "c", "cpp", "js"];
const languageDisplayNames: Record<string, string> = {
  java: "Java",
  c: "C",
  cpp: "C++",
  js: "JavaScript",
  All: "All"
};

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

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [allTags, setAllTags] = useState<string[]>(["All"]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch problems from API
  useEffect(() => {
    const fetchProblems = async () => {
      setIsLoading(true);
      try {
        // Build query params
        const params = new URLSearchParams();
        if (searchQuery) params.append('query', searchQuery);
        if (selectedLanguage !== 'All') params.append('language', selectedLanguage);
        if (selectedTag !== 'All') params.append('tag', selectedTag);
        
        const response = await fetch(`/api/problems?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch problems');
        }
        
        const data = await response.json();
        setProblems(data.problems);
        
        // Extract all unique tags for filter
        const uniqueTags = new Set<string>();
        uniqueTags.add('All');
        data.problems.forEach((problem: Problem) => {
          problem.tags.forEach(tag => uniqueTags.add(tag));
        });
        setAllTags(Array.from(uniqueTags));
        
      } catch (error) {
        console.error('Error fetching problems:', error);
        setError('Failed to load problems. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, [searchQuery, selectedLanguage, selectedTag]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLanguage('All');
    setSelectedTag('All');
  };

  // Since we're doing filtering in the API call, we can use problems directly
  // We just need to check if we're still loading or if there was an error
  
  return (
    <div className="container py-10">
      {/* Header */}
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-4xl font-bold">Coding Problems</h1>
        <p className="text-muted-foreground">
          Browse our collection of programming problems with solutions in multiple languages
        </p>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search problems..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {(searchQuery || selectedLanguage !== 'All' || selectedTag !== 'All') && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="whitespace-nowrap">
              <X className="mr-2 h-4 w-4" />
              Clear filters
            </Button>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Language:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {languages.map(language => (
                <Badge 
                  key={language}
                  variant={selectedLanguage === language ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedLanguage(language)}
                >
                  {languageDisplayNames[language]}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Tags:</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {allTags.map(tag => (
                <Badge 
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Problem Cards */}
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            className="flex justify-center items-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg">Loading problems...</span>
          </motion.div>
        ) : error ? (
          <motion.div
            className="text-center py-12 text-red-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-medium mb-2">Error</h3>
            <p>{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
              Try again
            </Button>
          </motion.div>
        ) : problems.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {problems.map((problem) => (
              <motion.div
                key={problem._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                <ProblemCard problem={problem} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-medium mb-2">No problems found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <Button variant="outline" className="mt-4" onClick={clearFilters}>
              Clear all filters
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}