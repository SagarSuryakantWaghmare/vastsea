"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  name: z.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces"),
  email: z.string()
    .email("Please enter a valid email address")
    .min(1, "Email is required"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
  confirmPassword: z.string().min(1, "Please confirm your password")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorType, setErrorType] = useState<'network' | 'validation' | 'server' | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Helper function to get user-friendly error messages
  const getErrorMessage = (error: any): { message: string; type: 'network' | 'validation' | 'server' } => {
    if (!error) return { message: 'An unexpected error occurred', type: 'server' };
    
    const errorMessage = error.message || error.toString();
    
    // Network errors
    if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('Failed to fetch')) {
      return { message: 'Network error. Please check your internet connection and try again.', type: 'network' };
    }
    
    // Validation errors
    if (errorMessage.includes('Email already exists') || errorMessage.includes('already registered')) {
      return { message: 'An account with this email already exists. Please sign in instead.', type: 'validation' };
    }
    
    if (errorMessage.includes('Invalid email')) {
      return { message: 'Please enter a valid email address.', type: 'validation' };
    }
    
    if (errorMessage.includes('Password')) {
      return { message: 'Password does not meet requirements. Please check and try again.', type: 'validation' };
    }
    
    if (errorMessage.includes('Name')) {
      return { message: 'Please enter a valid name.', type: 'validation' };
    }
    
    // Server errors
    if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
      return { message: 'Server error. Please try again later.', type: 'server' };
    }
    
    if (errorMessage.includes('400') || errorMessage.includes('Bad Request')) {
      return { message: 'Invalid request. Please check your information and try again.', type: 'validation' };
    }
    
    // Default case
    return { message: errorMessage || 'Something went wrong. Please try again.', type: 'server' };
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setErrorType(null);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.toLowerCase().trim(),
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        const errorInfo = getErrorMessage(new Error(data.error || data.message || 'Registration failed'));
        setError(errorInfo.message);
        setErrorType(errorInfo.type);
        return;
      }

      // Success
      setSuccess('Account created successfully! Redirecting to sign in...');
      
      // Redirect after a short delay to show success message
      setTimeout(() => {
        router.push('/auth/signin?message=account-created');
      }, 2000);

    } catch (error: any) {
      console.error('Signup error:', error);
      const errorInfo = getErrorMessage(error);
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
                className="px-4 py-2 font-medium text-muted-foreground hover:text-primary transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup" 
                className="px-4 py-2 font-medium border-b-2 border-primary text-primary"
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your name" 
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
                          placeholder="Create a password" 
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
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Confirm your password" 
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
                      : errorType === 'validation'
                      ? 'border-yellow-200 bg-yellow-50 dark:bg-yellow-950/50'
                      : 'border-red-200 bg-red-50 dark:bg-red-950/50'
                  }`}>
                    <AlertCircle className={`h-4 w-4 ${
                      errorType === 'network' 
                        ? 'text-orange-600' 
                        : errorType === 'validation'
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`} />
                    <AlertDescription className={`${
                      errorType === 'network' 
                        ? 'text-orange-800 dark:text-orange-400' 
                        : errorType === 'validation'
                        ? 'text-yellow-800 dark:text-yellow-400'
                        : 'text-red-800 dark:text-red-400'
                    }`}>
                      {error}
                      {errorType === 'validation' && error.includes('email already exists') && (
                        <div className="mt-2">
                          <Link 
                            href="/auth/signin" 
                            className="text-sm underline hover:no-underline font-medium"
                          >
                            Sign in instead →
                          </Link>
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
                      Creating account...
                    </>
                  ) : success ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Account Created!
                    </>
                  ) : (
                    'Create Account'
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