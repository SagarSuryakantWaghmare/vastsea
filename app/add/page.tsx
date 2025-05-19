"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { motion } from 'framer-motion';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Save } from "lucide-react";
import CodeEditor from "@/components/CodeEditor";

// Form schema
const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }).max(100, {
    message: "Title cannot exceed 100 characters."
  }),
  description: z.string().min(10, {
    message: "Description must be at least 10 characters.",
  }),
  javaCode: z.string().optional(),
  cCode: z.string().optional(),
  cppCode: z.string().optional(),
  jsCode: z.string().optional(),
  tags: z.array(z.string()).min(1, {
    message: "Add at least one tag."
  }),
});

export default function AddProblemPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Initialize form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      javaCode: "",
      cCode: "",
      cppCode: "",
      jsCode: "",
      tags: [],
    },
  });

  const addTag = () => {
    if (tagInput && !tags.includes(tagInput)) {
      const newTags = [...tags, tagInput];
      setTags(newTags);
      form.setValue('tags', newTags);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    setTags(newTags);
    form.setValue('tags', newTags);
  };

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (status !== 'authenticated' || !session) {
      router.push('/auth/signin');
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare the data for submission
      const problemData = {
        title: values.title,
        description: values.description,
        codes: {
          java: values.javaCode || '',
          c: values.cCode || '',
          cpp: values.cppCode || '',
          js: values.jsCode || ''
        },
        tags: values.tags
      };
      
      console.log('Session user ID:', session.user?.id);
      
      // Submit to API
      const response = await fetch('/api/problems', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(problemData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit problem');
      }
      
      // Navigate to problems page after successful submission
      router.push('/dashboard');
    } catch (error) {
      console.error('Error submitting problem:', error);
      // You could add a toast notification here for error feedback
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border shadow-sm bg-card max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Add New Problem</CardTitle>
            <CardDescription>
              Create a new programming problem with solutions in multiple languages
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Problem Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a descriptive title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Problem Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the problem in detail..." 
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  {/* Tags */}
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {tags.map(tag => (
                        <Badge key={tag} variant="secondary" className="gap-1">
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove {tag}</span>
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyPress}
                        placeholder="Add a tag"
                        className="flex-1"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={addTag}
                      >
                        <Plus className="h-4 w-4" />
                        <span className="sr-only">Add tag</span>
                      </Button>
                    </div>
                    {form.formState.errors.tags && (
                      <p className="text-sm font-medium text-destructive mt-2">
                        {form.formState.errors.tags.message}
                      </p>
                    )}
                  </FormItem>
                </div>
                
                {/* Code Solutions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Code Solutions</h3>
                  <p className="text-sm text-muted-foreground">
                    Provide solution code in at least one language
                  </p>
                  
                  <Tabs defaultValue="java" className="w-full">
                    <TabsList className="grid grid-cols-4 mb-4">
                      <TabsTrigger value="java">Java</TabsTrigger>
                      <TabsTrigger value="c">C</TabsTrigger>
                      <TabsTrigger value="cpp">C++</TabsTrigger>
                      <TabsTrigger value="js">JavaScript</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="java">
                      <FormField
                        control={form.control}
                        name="javaCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <CodeEditor
                                value={field.value || ''}
                                onChange={field.onChange}
                                language="java"
                                placeholder="// Enter Java solution here..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="c">
                      <FormField
                        control={form.control}
                        name="cCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <CodeEditor
                                value={field.value || ''}
                                onChange={field.onChange}
                                language="c"
                                placeholder="// Enter C solution here..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="cpp">
                      <FormField
                        control={form.control}
                        name="cppCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <CodeEditor
                                value={field.value || ''}
                                onChange={field.onChange}
                                language="cpp"
                                placeholder="// Enter C++ solution here..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    
                    <TabsContent value="js">
                      <FormField
                        control={form.control}
                        name="jsCode"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <CodeEditor
                                value={field.value || ''}
                                onChange={field.onChange}
                                language="javascript"
                                placeholder="// Enter JavaScript solution here..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                  </Tabs>
                </div>
                
                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Problem
                    </>
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