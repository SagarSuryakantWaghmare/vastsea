"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email.",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }),
});

export default function SignInPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Admin emails
  const adminEmails = ['sagarwaghmare1384@gmail.com', 'admin@vastsea.com'];

  // Handle redirect after successful authentication
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.email) {
      const isAdmin = adminEmails.includes(session.user.email);
      
      if (isAdmin) {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    }
  }, [session, status, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Attempting sign in for:', values.email);
      
      const result = await signIn('credentials', {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        console.log('Sign-in error:', result.error);
        
        // Map error messages to user-friendly versions
        if (result.error === 'CredentialsSignin') {
          setError('Invalid email or password. Please try again.');
        } else if (result.error.includes('database') || result.error.includes('connect')) {
          setError('Server connection error. Please try again later.');
        } else {
          setError(result.error);
        }
      } else {
        // Success - the useEffect will handle the redirect based on user role
        // Don't redirect here, let the useEffect handle it
      }
    } catch (error: any) {
      console.error('Sign-in exception:', error);
      
      // Handle specific JSON parsing error that occurs in production
      if (error instanceof SyntaxError && error.message.includes('JSON')) {
        setError('Authentication service is temporarily unavailable. Please try again later.');
        
        // Log this specific error for debugging
        console.error('JSON parsing error during sign-in - likely server-side issue');
      } else {
        setError('Connection error. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full py-2">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md mx-auto px-4"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text mb-2">Join VastSea</h1>
          <p className="text-muted-foreground">Contribute to our coding community</p>
        </div>
        
        <Card className="border-primary/10 shadow-lg">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center border-b pb-4">
              <Link 
                href="/auth/signin" 
                className="px-4 py-2 font-medium border-b-2 border-primary text-primary"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup" 
                className="px-4 py-2 font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Create Account
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your email" 
                          className="rounded-lg h-11" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter your password" 
                          className="rounded-lg h-11"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {error && (
                  <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-lg">{error}</div>
                )}

                <Button 
                  type="submit" 
                  className="w-full rounded-lg h-11 bg-gradient-to-r from-blue-600 to-teal-500 hover:shadow-md hover:shadow-primary/20 text-white transition-all"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>

              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}