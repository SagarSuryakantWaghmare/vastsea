"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Problem } from '@/lib/dummy-data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight } from 'lucide-react';

interface ProblemCardProps {
  problem: Problem;
}

export function ProblemCard({ problem }: ProblemCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Count the number of language implementations
  const languagesCount = Object.values(problem.codes).filter(Boolean).length;
  
  return (
    <Link href={`/problems/${problem.id}`}>
      <motion.div
        whileHover={{ y: -5 }}
        whileTap={{ y: 0 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <Card className="h-full overflow-hidden border border-border hover:border-primary/50 transition-colors">
          <CardHeader className="pb-3">
            <CardTitle className="flex justify-between items-start gap-2">
              <span className="text-xl font-bold">{problem.title}</span>
              <motion.div
                animate={{ rotate: isHovered ? 45 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowUpRight className="h-5 w-5 text-muted-foreground" />
              </motion.div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground line-clamp-3">
              {problem.description}
            </p>
          </CardContent>
          <CardFooter className="flex flex-wrap gap-2">
            {problem.tags.slice(0, 3).map((tag) => (
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