"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ProblemCard } from '@/components/ProblemCard';
import ProfileEditForm from '@/components/ProfileEditForm';
import { CalendarDays, PlusCircle, Clock, Activity } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

// Define types for better TypeScript support
interface Problem {
  _id: string;
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
  createdAt: string;
}

interface UserActivity {
  type: 'problem_created' | 'profile_updated';
  date: string;
  title?: string;
  id?: string;
}

// Extend the session user type to include createdAt
declare module "next-auth" {
  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      createdAt?: string;
    };
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userProblems, setUserProblems] = useState<Problem[]>([]);
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Fetch user's problems
  useEffect(() => {
    const fetchUserData = async () => {
      if (!session?.user) return;
      
      setIsLoading(true);
      try {
        // Fetch user's problems
        const problemsResponse = await fetch('/api/user/problems');
        if (problemsResponse.ok) {
          const data = await problemsResponse.json();
          setUserProblems(data.problems || []);
          
          // Generate activity data based on problems
          if (data.problems && data.problems.length > 0) {
            const activityData = data.problems.map((problem: Problem) => ({
              type: 'problem_created' as const,
              date: problem.createdAt,
              title: problem.title,
              id: problem._id
            })).sort((a: UserActivity, b: UserActivity) => 
              new Date(b.date).getTime() - new Date(a.date).getTime()
            );
            
            setActivities(activityData.slice(0, 5)); // Show only 5 most recent activities
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user) {
      fetchUserData();
    }
  }, [session]);

  // Loading state
  if (status === 'loading' || isLoading) {
    return (
      <div className="container py-10 flex items-center justify-center min-h-[70vh]">
        <div className="animate-pulse text-xl">Loading dashboard...</div>
      </div>
    );  }

  // Extract first letter of name for avatar fallback
  const getInitials = (name: string) => {
    return name?.charAt(0).toUpperCase() || '?';
  };
  // Format join date
  const joinDate = session?.user?.createdAt 
    ? format(new Date(session.user.createdAt), 'MMMM yyyy')
    : 'Recently';

  return (
    <div className="flex flex-col items-center">
      <div className="container max-w-screen-xl py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-10"
        >
          {/* User Info Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 md:h-24 md:w-24">
                <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'User'} />
                <AvatarFallback className="text-xl md:text-3xl">{getInitials(session?.user?.name || '')}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl md:text-4xl font-bold">{session?.user?.name}</h1>
                <p className="text-muted-foreground">{session?.user?.email}</p>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <CalendarDays className="h-4 w-4 mr-1" />
                  <span>Joined {joinDate}</span>
                </div>
              </div>
            </div>
            <Button asChild>
              <Link href="/add" className="flex items-center">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add New Problem
              </Link>
            </Button>
          </div>

          {/* Dashboard Content */}
          <Tabs defaultValue="problems" className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="problems">My Problems</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
              <TabsTrigger value="profile">Profile Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="problems">
              <Card>
                <CardHeader>
                  <CardTitle>My Problems</CardTitle>
                  <CardDescription>
                    Manage problems you've created
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {userProblems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {userProblems.map((problem) => (
                        <ProblemCard key={problem._id} problem={problem} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <PlusCircle className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No problems yet</h3>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        You haven't created any problems yet. Start sharing your coding challenges with the community.
                      </p>
                      <Button asChild>
                        <Link href="/add">Create Your First Problem</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your recent interactions on the platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {activities.length > 0 ? (
                    <div className="space-y-6">
                      {activities.map((activity, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="bg-primary/10 rounded-full p-2">
                            <Activity className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                              <p className="font-medium">
                                {activity.type === 'problem_created' && 'Created a new problem:'}
                                {activity.type === 'profile_updated' && 'Updated your profile'}
                              </p>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Clock className="mr-1 h-4 w-4" />
                                {formatDistanceToNow(new Date(activity.date), { addSuffix: true })}
                              </div>
                            </div>
                            {activity.title && (
                              <Link 
                                href={`/problems/${activity.id}`} 
                                className="text-sm text-primary hover:underline"
                              >
                                {activity.title}
                              </Link>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Activity className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">No recent activity</h3>
                      <p className="text-muted-foreground max-w-md mx-auto">
                        Your activity will appear here as you interact with the platform. Start by adding a problem or exploring the site.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Settings</CardTitle>
                  <CardDescription>
                    Manage your account settings and profile information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ProfileEditForm />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>      </div>
    </div>  );
}
