"use client";

import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trophy, Medal, Award, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { motion } from 'framer-motion';

interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  problemCount: number;
  createdAt: string;
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('/api/leaderboard', {
          cache: 'no-store',
          next: { revalidate: 60 }, // Revalidate at most once per minute
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch leaderboard: ${response.status}`);
        }

        const data = await response.json();
        setLeaderboard(data.leaderboard);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Helper function to get ranking medal/icon
  const getRankBadge = (index: number) => {
    if (index === 0) {
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    } else if (index === 1) {
      return <Medal className="h-5 w-5 text-gray-400" />;
    } else if (index === 2) {
      return <Award className="h-5 w-5 text-amber-700" />;
    }
    return index + 1;
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-4 mb-8">
        <h1 className="text-4xl font-bold">Leaderboard</h1>
        <p className="text-muted-foreground">
          See who's contributed the most problems to our community
        </p>
      </div>

      <Card className="border-primary/10 shadow-lg overflow-hidden">
        <CardHeader className="bg-muted/40 border-b py-6">
          <CardTitle className="text-2xl flex items-center">
            <Trophy className="mr-3 h-6 w-6 text-yellow-500" />
            Top Contributors
          </CardTitle>
          <CardDescription>
            Ranked by number of problems contributed
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-center p-8 text-red-500">{error}</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">Rank</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead className="text-right">Problems Created</TableHead>
                    <TableHead className="hidden md:table-cell">Member Since</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className={`
                        ${index < 3 ? 'font-medium' : ''}
                        ${index === 0 ? 'bg-yellow-50 dark:bg-yellow-950/20' : ''}
                        ${index === 1 ? 'bg-gray-50 dark:bg-gray-900/20' : ''}
                        ${index === 2 ? 'bg-amber-50 dark:bg-amber-950/20' : ''}
                      `}
                    >
                      <TableCell className="font-bold">
                        <div className="flex items-center justify-center">
                          {getRankBadge(index)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {user.email}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={index < 3 ? "default" : "outline"} className="ml-auto">
                          {user.problemCount} problem{user.problemCount !== 1 ? 's' : ''}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground">
                        {user.createdAt 
                          ? formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })
                          : 'N/A'}
                      </TableCell>
                    </motion.tr>
                  ))}

                  {leaderboard.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center p-8 text-muted-foreground">
                        No users found. Be the first to contribute!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}