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
    <Link href={`/problems/${problemId}`}>
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ y: 0 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card className="h-full overflow-hidden border border-border hover:border-primary/50 transition-colors">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start gap-2 mb-2">
              <CardTitle className="text-xl font-bold">{problem.title}</CardTitle>
              <motion.div
                animate={{ rotate: isHovered ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowUpRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </motion.div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              {problem.author ? (
                <div className="flex flex-wrap items-center">
                  <Badge variant="outline" className="mr-2 font-medium">
                    By {problem.author.name}
                  </Badge>
                  {formattedDate && <span>{formattedDate}</span>}
                </div>
              ) : (
                formattedDate && <span>{formattedDate}</span>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground line-clamp-3">
              {problem.description}
            </p>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            {problem.tags && problem.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            <Badge 
              variant="outline" 
              className="ml-auto bg-primary/10 text-primary text-xs"
            >
              {languagesCount} {languagesCount === 1 ? 'language' : 'languages'}
            </Badge>
          </CardFooter>
        </Card>
      </motion.div>
    </Link>
  );
}