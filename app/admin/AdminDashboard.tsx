"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { motion } from 'framer-motion';
import { Trash2, Edit, Plus, Search, Users, FileText, Shield, Settings, Eye, Clock } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface Problem {
  _id: string;
  title: string;
  description: string;
  author: {
    name: string;
    email: string;
  };
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
  createdAt: string;
  problemsCount?: number;
}

const AdminDashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Form states
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  
  // Problem form
  const [problemForm, setProblemForm] = useState({
    title: '',
    description: '',
  });
  
  // User form
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    role: 'user',
  });

  // Check if user is admin
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    const adminEmails = ['sagarwaghmare1384@gmail.com', 'admin@vastsea.com'];
    if (!adminEmails.includes(session.user?.email || '')) {
      router.push('/');
      toast.error('Access denied. Admin privileges required.');
      return;
    }
    
    fetchData();
  }, [session, status, router]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [problemsRes, usersRes] = await Promise.all([
        fetch('/api/admin/problems'),
        fetch('/api/admin/users')
      ]);
      
      if (problemsRes.ok) {
        const problemsData = await problemsRes.json();
        setProblems(problemsData);
      }
      
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleProblemSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingProblem 
        ? `/api/admin/problems/${editingProblem._id}`
        : '/api/admin/problems';
      
      const method = editingProblem ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(problemForm),
      });
      
      if (response.ok) {
        toast.success(editingProblem ? 'Problem updated successfully' : 'Problem created successfully');
        setIsDialogOpen(false);
        setProblemForm({ title: '', description: '' });
        setEditingProblem(null);
        fetchData();
      } else {
        throw new Error('Failed to save problem');
      }
    } catch (error) {
      console.error('Error saving problem:', error);
      toast.error('Failed to save problem');
    }
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingUser 
        ? `/api/admin/users/${editingUser._id}`
        : '/api/admin/users';
      
      const method = editingUser ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userForm),
      });
      
      if (response.ok) {
        toast.success(editingUser ? 'User updated successfully' : 'User created successfully');
        setIsUserDialogOpen(false);
        setUserForm({ name: '', email: '', role: 'user' });
        setEditingUser(null);
        fetchData();
      } else {
        throw new Error('Failed to save user');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      toast.error('Failed to save user');
    }
  };

  const deleteProblem = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/problems/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success('Problem deleted successfully');
        fetchData();
      } else {
        throw new Error('Failed to delete problem');
      }
    } catch (error) {
      console.error('Error deleting problem:', error);
      toast.error('Failed to delete problem');
    }
  };

  const deleteUser = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        toast.success('User deleted successfully');
        fetchData();
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const openEditProblem = (problem: Problem) => {
    setEditingProblem(problem);
    setProblemForm({
      title: problem.title,
      description: problem.description,
    });
    setIsDialogOpen(true);
  };

  const openEditUser = (user: User) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      role: user.role || 'user',
    });
    setIsUserDialogOpen(true);
  };

  const filteredProblems = problems.filter(problem =>
    problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    problem.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-transparent bg-clip-text">
              Admin Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage problems, users, and platform settings
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card className="border-border/50 hover:border-primary/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <FileText className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Problems</p>
                  <p className="text-2xl font-bold">{problems.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-primary/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20">
                  <Users className="h-6 w-6 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 hover:border-primary/50 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <Settings className="h-6 w-6 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Platform Status</p>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                    Active
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Tabs defaultValue="problems" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="problems" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Problems
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
            </TabsList>

            {/* Problems Tab */}
            <TabsContent value="problems" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search problems..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Problem
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingProblem ? 'Edit Problem' : 'Add New Problem'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingProblem ? 'Update the problem details.' : 'Create a new coding problem.'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleProblemSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                          id="title"
                          value={problemForm.title}
                          onChange={(e) => setProblemForm({ ...problemForm, title: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={problemForm.description}
                          onChange={(e) => setProblemForm({ ...problemForm, description: e.target.value })}
                          rows={5}
                          required
                        />
                      </div>
                      <DialogFooter>
                        <Button type="submit">
                          {editingProblem ? 'Update' : 'Create'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {filteredProblems.map((problem) => (
                  <Card key={problem._id} className="border-border/50 hover:border-primary/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{problem.title}</h3>
                          <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                            {problem.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>By {problem.author.name}</span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(problem.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/problems/${problem._id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditProblem(problem)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Problem</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{problem.title}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteProblem(problem._id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[525px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingUser ? 'Edit User' : 'Add New User'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingUser ? 'Update the user details.' : 'Create a new user account.'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleUserSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={userForm.name}
                          onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={userForm.email}
                          onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                          required
                        />
                      </div>
                      <DialogFooter>
                        <Button type="submit">
                          {editingUser ? 'Update' : 'Create'}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {filteredUsers.map((user) => (
                  <Card key={user._id} className="border-border/50 hover:border-primary/50 transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{user.name}</h3>
                          <p className="text-muted-foreground text-sm mb-3">{user.email}</p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <Badge variant="outline">
                              {user.role || 'User'}
                            </Badge>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete User</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{user.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteUser(user._id)}
                                  className="bg-destructive hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
