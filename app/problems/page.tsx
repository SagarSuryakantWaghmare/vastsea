"use client";

import { useState } from 'react';
import { dummyProblems } from '@/lib/dummy-data';
import { ProblemCard } from '@/components/ProblemCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const languages = ["All", "Java", "C", "C++", "JavaScript"];
const tags = ["All", "array", "string", "math", "dynamic-programming", "recursion", "stack", "linked-list", "easy", "medium", "hard"];

export default function ProblemsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  
  // Filter problems based on search, language, and tag
  const filteredProblems = dummyProblems.filter(problem => {
    // Search filter
    const matchesSearch = problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          problem.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Language filter
    const matchesLanguage = selectedLanguage === 'All' || 
                            (problem.codes[selectedLanguage.toLowerCase() as keyof typeof problem.codes] !== undefined);
    
    // Tag filter
    const matchesTag = selectedTag === 'All' || problem.tags.includes(selectedTag.toLowerCase());
    
    return matchesSearch && matchesLanguage && matchesTag;
  });

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedLanguage('All');
    setSelectedTag('All');
  };

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
                  {language}
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
              {tags.map(tag => (
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
        {filteredProblems.length > 0 ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {filteredProblems.map((problem) => (
              <motion.div
                key={problem.id}
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