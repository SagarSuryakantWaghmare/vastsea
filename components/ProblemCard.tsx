"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

// Define the interface for MongoDB problem documents
interface ProblemProps {
  problem: {
    _id: string;
    id?: string;
    title: string;
    description: string;
    codes: {
      java?: string;
      c?: string;
      cpp?: string;
      js?: string;
    };
    tags: string[];
    author?: {
      name: string;
      email: string;
    };
    createdAt: string | Date;
  };
}

export function ProblemCard({ problem }: ProblemProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Count the number of language implementations
  const languagesCount = Object.values(problem.codes || {}).filter(Boolean).length;
  
  // Handle the ID (could be MongoDB _id or id from dummy data)
  const problemId = problem._id || problem.id;
  
  // Format the creation date if available
  const formattedDate = problem.createdAt 
    ? formatDistanceToNow(new Date(problem.createdAt), { addSuffix: true })
    : '';
  
  return (
    <div>
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ y: 0 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={() => window.location.href = `/problems/${problemId}`}
        className="cursor-pointer"
      >
        <Card className="h-full overflow-hidden border border-border hover:border-primary/20 transition-all hover:shadow-lg hover:shadow-primary/5 relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <CardHeader className="pb-3 relative z-10">
            <div className="flex justify-between items-start gap-2 mb-2">
              <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{problem.title}</CardTitle>
              <motion.div
                animate={{ rotate: isHovered ? 45 : 0, scale: isHovered ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
                className="bg-primary/10 rounded-full p-1.5 group-hover:bg-primary/20 transition-colors"
              >
                <ArrowUpRight className="h-4 w-4 text-primary flex-shrink-0" />
              </motion.div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {problem.author ? (
                <div className="flex flex-wrap items-center">
                  <Badge variant="outline" className="mr-2 font-medium bg-background border-primary/20 text-primary/80">
                    By {problem.author.name}
                  </Badge>
                  {formattedDate && <span className="text-xs">{formattedDate}</span>}
                </div>
              ) : (
                formattedDate && <span className="text-xs">{formattedDate}</span>
              )}
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <p className="text-muted-foreground line-clamp-3">
              {problem.description}
            </p>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2 relative z-10">
            {problem.tags && problem.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs rounded-full px-3 hover:bg-secondary/80">
                {tag}
              </Badge>
            ))}
            <Badge 
              variant="outline" 
              className="ml-auto bg-primary/10 text-primary text-xs rounded-full px-3"
            >
              {languagesCount} {languagesCount === 1 ? 'language' : 'languages'}
            </Badge>
          </CardFooter>
        </Card>
      </motion.div>
+    </div>
  );
}