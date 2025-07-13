"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle, Loader2, Eye, EyeOff } from 'lucide-react';

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
import { toast } from "sonner";

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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // I wrote this helper to make error messages more user-friendly and less technical
  const getErrorMessage = (error: any): { message: string; type: 'network' | 'validation' | 'server' } => {
    if (!error) return { message: 'An unexpected error occurred', type: 'server' };
    
    const errorMessage = error.message || error.toString();
    
    // When the internet connection is acting up
    if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('Failed to fetch')) {
      return { message: 'Network error. Please check your internet connection and try again.', type: 'network' };
    }
    
    // When user tries to register with an email that's already taken
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
    
    // When our backend servers are having a rough day
    if (errorMessage.includes('500') || errorMessage.includes('Internal Server Error')) {
      return { message: 'Server error. Please try again later.', type: 'server' };
    }
    
    if (errorMessage.includes('400') || errorMessage.includes('Bad Request')) {
      return { message: 'Invalid request. Please check your information and try again.', type: 'validation' };
    }
    
    // For everything else we didn't expect
    return { message: errorMessage || 'Something went wrong. Please try again.', type: 'server' };
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setErrorType(null);

    // Let the user know we're working on creating their account
    toast.loading('Creating your account...', {
      description: 'Please wait while we set up your account.',
    });

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
        
        // Something went wrong, so let's tell the user what happened
        toast.dismiss();
        toast.error('Registration failed', {
          description: errorInfo.message,
        });
        return;
      }

      // Woohoo! Account created successfully 🎉
      setSuccess('Account created successfully! Redirecting to sign in...');
      toast.dismiss();
      toast.success('Account created successfully!', {
        description: 'Redirecting to sign in page...',
      });
      
      // Clean up the form before we redirect
      form.reset();
      
      // Give the user a moment to see the success message before redirecting
      setTimeout(() => {
        setSuccess(null); // Clean up the success message
        router.push('/auth/signin?message=account-created');
      }, 1500); // Just enough time to feel good about the success

    } catch (error: any) {
      console.error('Signup error:', error);
      const errorInfo = getErrorMessage(error);
      setError(errorInfo.message);
      setErrorType(errorInfo.type);
      
      // Network issues or other unexpected errors
      toast.dismiss();
      toast.error('Network error', {
        description: errorInfo.message,
      });
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
                        <div className="relative">
                          <Input 
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password" 
                            className="rounded-lg h-11 pr-10"
                            {...field} 
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                            )}
                          </button>
                        </div>
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
                        <div className="relative">
                          <Input 
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password" 
                            className="rounded-lg h-11 pr-10"
                            {...field} 
                          />
                          <button
                            type="button"
                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* When things go well, we show this happy message */}
                {success && (
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-950/50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800 dark:text-green-400">
                      {success}
                    </AlertDescription>
                  </Alert>
                )}

                {/* When something goes wrong, we show this helpful error message */}
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