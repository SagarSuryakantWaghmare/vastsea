"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
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
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  email: z.string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z.string()
    .min(1, "Password is required"),
});

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorType, setErrorType] = useState<'network' | 'credentials' | 'server' | null>(null);

  // Admin emails
  const adminEmails = ['sagarwaghmare1384@gmail.com', 'admin@vastsea.com'];

  // Check for success messages from URL parameters
  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'account-created') {
      setSuccess('Account created successfully! Please sign in with your credentials.');
    }
  }, [searchParams]);

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

  // Helper function to get user-friendly error messages
  const getErrorMessage = (error: string): { message: string; type: 'network' | 'credentials' | 'server' } => {
    switch (error) {
      case 'CredentialsSignin':
        return { 
          message: 'Invalid email or password. Please check your credentials and try again.', 
          type: 'credentials' 
        };
      case 'EmailSignin':
        return { 
          message: 'There was a problem with your email. Please try again.', 
          type: 'credentials' 
        };
      case 'OAuthSignin':
      case 'OAuthCallback':
      case 'OAuthCreateAccount':
        return { 
          message: 'Authentication service error. Please try again.', 
          type: 'server' 
        };
      case 'EmailCreateAccount':
        return { 
          message: 'Could not create account. Please try again.', 
          type: 'server' 
        };
      case 'Callback':
        return { 
          message: 'Authentication callback error. Please try again.', 
          type: 'server' 
        };
      case 'OAuthAccountNotLinked':
        return { 
          message: 'This email is already associated with another account. Please sign in with your original method.', 
          type: 'credentials' 
        };
      case 'EmailSigninError':
        return { 
          message: 'Could not send sign-in email. Please try again.', 
          type: 'server' 
        };
      case 'SessionRequired':
        return { 
          message: 'Please sign in to access this page.', 
          type: 'credentials' 
        };
      default:
        if (error.includes('fetch') || error.includes('network')) {
          return { 
            message: 'Network error. Please check your internet connection and try again.', 
            type: 'network' 
          };
        }
        if (error.includes('database') || error.includes('connect')) {
          return { 
            message: 'Server connection error. Please try again later.', 
            type: 'server' 
          };
        }
        return { 
          message: error || 'An unexpected error occurred. Please try again.', 
          type: 'server' 
        };
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setErrorType(null);

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: values.email.toLowerCase().trim(),
        password: values.password,
      });

      if (result?.error) {
        const errorInfo = getErrorMessage(result.error);
        setError(errorInfo.message);
        setErrorType(errorInfo.type);
      } else if (result?.ok) {
        // Success - show loading message while redirect happens
        setSuccess('Sign in successful! Redirecting...');
        // The useEffect will handle the redirect based on user role
      }
    } catch (error: any) {
      console.error('Sign-in exception:', error);
      const errorInfo = getErrorMessage(error.message || 'Connection error');
      setError(errorInfo.message);
      setErrorType(errorInfo.type);
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

                {/* Success Message */}
                {success && (
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-950/50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-400">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Error Message */}
                {error && (
                  <Alert className={`${
                    errorType === 'network' 
                      ? 'border-orange-200 bg-orange-50 dark:bg-orange-950/50' 
                      : errorType === 'credentials'
                      ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/50'
                      : 'border-red-200 bg-red-50 dark:bg-red-950/50'
                  }`}>
                    <AlertCircle className={`h-4 w-4 ${
                      errorType === 'network' 
                        ? 'text-orange-600' 
                        : errorType === 'credentials'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`} />
                    <AlertDescription className={`${
                      errorType === 'network' 
                        ? 'text-orange-800 dark:text-orange-400' 
                        : errorType === 'credentials'
                        ? 'text-yellow-800 dark:text-yellow-400'
                        : 'text-red-800 dark:text-red-400'
                    }`}>
                      {error}
                      {errorType === 'credentials' && (
                        <div className="mt-2 space-y-1">
                          <Link 
                            href="/auth/signup" 
                            className="text-sm underline hover:no-underline font-medium block"
                          >
                            Don't have an account? Sign up →
                          </Link>
                          {/* Add forgot password link when implemented */}
                          {/* <Link 
                            href="/auth/forgot-password" 
                            className="text-sm underline hover:no-underline font-medium block"
                          >
                            Forgot your password? →
                          </Link> */}
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full rounded-lg h-11 bg-gradient-to-r from-blue-600 to-teal-500 hover:shadow-md hover:shadow-primary/20 text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading || !!success}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Redirecting...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>

              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}