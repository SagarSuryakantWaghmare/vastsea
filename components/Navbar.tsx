"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, Plus, Moon, Sun, LogIn, LogOut, UserPlus, Home, FileText, LayoutDashboard, X, Trophy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  // Prevent background scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup function to restore scrolling if component unmounts
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-transparent bg-clip-text leading-tight tracking-tight"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              VastSea
            </motion.div>
          </Link>
          
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link href="/problems" className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors">
              Problems
            </Link>
            <Link href="/leaderboard" className="px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-colors">
              <span className="flex items-center gap-1.5">
                <Trophy className="h-4 w-4" />
                Leaderboard
              </span>
            </Link>
          </nav>
        </div>

        {/* Desktop Search & Actions */}
        <div className="flex items-center gap-3">
          
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full h-10 w-10 hover:bg-accent/60 border border-transparent hover:border-border/50 transition-all duration-200 shadow-sm hover:shadow-md"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {/* User Menu */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-full overflow-hidden p-0 bg-gradient-to-br from-primary/20 to-secondary/20 hover:from-primary/30 hover:to-secondary/30 transition-all duration-200 border border-border/30 shadow-sm hover:shadow-md"
                >
                  <span className="text-primary font-semibold text-sm">
                    {session.user?.name 
                      ? `${session.user.name.split(' ')[0][0]}${session.user.name.split(' ')[1]?.[0] || ''}`
                      : session.user?.email?.[0].toUpperCase()}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-2xl border-border/50 shadow-xl backdrop-blur-xl bg-background/95 w-64 p-3 mt-2">
                <div className="px-3 py-3 border-b border-border/30 mb-2">
                  <p className="font-semibold text-sm">{session.user?.name}</p>
                  <p className="text-xs text-muted-foreground/80">{session.user?.email}</p>
                </div>
                <DropdownMenuItem asChild className="cursor-pointer rounded-xl focus:bg-accent/80 h-11 px-3 mb-1">
                  <Link href="/dashboard" className="flex items-center">
                    <LayoutDashboard className="mr-3 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-xl focus:bg-accent/80 h-11 px-3 mb-1">
                  <Link href="/add" className="flex items-center">
                    <Plus className="mr-3 h-4 w-4" />
                    Add Problem
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-xl focus:bg-accent/80 h-11 px-3 mb-1">
                  <Link href="/leaderboard" className="flex items-center">
                    <Trophy className="mr-3 h-4 w-4" />
                    Leaderboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => signOut()} 
                  className="cursor-pointer rounded-xl focus:bg-destructive/10 text-destructive focus:text-destructive h-11 px-3 mt-2 border-t border-border/30 pt-3"
                >
                  <LogOut className="mr-3 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:block">
              <Button size="sm" asChild className="rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 hover:from-blue-500 hover:via-purple-500 hover:to-teal-400 hover:shadow-lg hover:shadow-primary/25 text-white border-0 px-6 h-10 font-medium transition-all duration-300 hover:scale-105">
                <Link href="/auth/signin" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Contribute Now</span>
                </Link>
              </Button>
            </div>
          )}

          {/* Enhanced Mobile Hamburger Menu */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden relative h-10 w-10 rounded-xl hover:bg-accent/60 border border-transparent hover:border-border/50 transition-all duration-200 shadow-sm hover:shadow-md"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="flex flex-col justify-center items-center w-5 h-5">
              <motion.span
                className="block h-0.5 w-5 bg-current rounded-full"
                animate={isOpen ? { rotate: 45, y: 2 } : { rotate: 0, y: -2 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-0.5 w-5 bg-current rounded-full mt-1"
                animate={isOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
              <motion.span
                className="block h-0.5 w-5 bg-current rounded-full mt-1"
                animate={isOpen ? { rotate: -45, y: -2 } : { rotate: 0, y: 2 }}
                transition={{ duration: 0.2 }}
              />
            </div>
          </Button>
        </div>
      </div>

      {/* Enhanced Mobile Navigation Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-[98]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Sidebar */}
            <motion.div
              className="md:hidden fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-xl shadow-2xl z-[99] border-b border-border/50"
              initial={{ y: '-100%' }}
              animate={{ y: 0 }}
              exit={{ y: '-100%' }}
              transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border/30 bg-background/90 backdrop-blur-md">
                  <div className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 text-transparent bg-clip-text">
                    VastSea
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-9 w-9 rounded-xl hover:bg-accent/60 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                {/* Navigation Links */}
                <div className="px-4 py-6 space-y-2">
                  <Link 
                    href="/" 
                    className="flex items-center px-4 py-3 text-base font-medium rounded-xl hover:bg-accent/60 transition-all duration-200 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <Home className="mr-3 h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span>Home</span>
                  </Link>
                  
                  <Link 
                    href="/problems" 
                    className="flex items-center px-4 py-3 text-base font-medium rounded-xl hover:bg-accent/60 transition-all duration-200 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <FileText className="mr-3 h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span>Problems</span>
                  </Link>
                  
                  <Link 
                    href="/leaderboard" 
                    className="flex items-center px-4 py-3 text-base font-medium rounded-xl hover:bg-accent/60 transition-all duration-200 group"
                    onClick={() => setIsOpen(false)}
                  >
                    <Trophy className="mr-3 h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span>Leaderboard</span>
                  </Link>
                  
                  {session ? (
                    <div className="space-y-2 pt-4 border-t border-border/30 mt-4">
                      <div className="px-4 py-2 mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center border border-border/30">
                            <span className="text-primary font-semibold text-sm">
                              {session.user?.name 
                                ? `${session.user.name.split(' ')[0][0]}${session.user.name.split(' ')[1]?.[0] || ''}`
                                : session.user?.email?.[0].toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{session.user?.name}</p>
                            <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-3 text-base font-medium rounded-xl hover:bg-accent/60 transition-all duration-200 group"
                        onClick={() => setIsOpen(false)}
                      >
                        <LayoutDashboard className="mr-3 h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <span>Dashboard</span>
                      </Link>
                      
                      <Link
                        href="/add"
                        className="flex items-center px-4 py-3 text-base font-medium rounded-xl hover:bg-accent/60 transition-all duration-200 group"
                        onClick={() => setIsOpen(false)}
                      >
                        <Plus className="mr-3 h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                        <span>Add Problem</span>
                      </Link>
                      
                      <Button 
                        variant="ghost" 
                        className="justify-start w-full px-4 py-3 h-auto text-base font-medium rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive transition-all duration-200 mt-2"
                        onClick={() => {
                          signOut();
                          setIsOpen(false);
                        }}
                      >
                        <LogOut className="mr-3 h-5 w-5" />
                        <span>Sign Out</span>
                      </Button>
                    </div>
                  ) : (
                    <div className="pt-6 border-t border-border/30 mt-6">
                      <Link
                        href="/auth/signin"
                        onClick={() => setIsOpen(false)}
                        className="block"
                      >
                        <Button 
                          size="lg" 
                          className="w-full justify-center gap-2 h-12 rounded-xl"
                        >
                          <UserPlus className="h-5 w-5" />
                          <span>Contribute Now</span>
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
                
                {/* Footer with Theme Toggle */}
                <div className="p-6 border-t border-border/30 bg-background/90 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Switch theme</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-xl hover:bg-accent/60 border border-transparent hover:border-border/50 transition-all duration-200"
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    >
                      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                      <span className="sr-only">Toggle theme</span>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;