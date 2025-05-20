"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, Search, Plus, Moon, Sun, LogIn, LogOut, UserPlus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            VastSea
          </motion.div>
        </Link>


        <div className="flex items-center gap-4">
          <form className="hidden md:flex relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search problems..."
              className="w-full pl-10 rounded-full border-primary/20 focus-visible:ring-primary/30 transition-all focus-visible:shadow-sm"
            />
          </form>
          
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-accent/50 transition-colors"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10 rounded-full overflow-hidden p-0 bg-primary/10 hover:bg-primary/20 transition-all"
                >
                  <span className="text-primary font-medium">
                    {session.user?.name 
                      ? `${session.user.name.split(' ')[0][0]}${session.user.name.split(' ')[1]?.[0] || ''}`
                      : session.user?.email?.[0].toUpperCase()}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl border-primary/10 shadow-lg w-56 p-2">
                <div className="px-2 py-2 border-b mb-2">
                  <p className="font-medium">{session.user?.name}</p>
                  <p className="text-xs text-muted-foreground">{session.user?.email}</p>
                </div>
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg focus:bg-accent/70 h-10">
                  <Link href="/dashboard" className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-lg focus:bg-accent/70 h-10">
                  <Link href="/add" className="flex items-center">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Problem
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer rounded-lg focus:bg-accent/70 text-destructive focus:text-destructive h-10">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:block">
              <Button size="sm" asChild className="rounded-full bg-gradient-to-r from-blue-600 to-teal-500 hover:shadow-md hover:shadow-primary/20 text-white border-0 px-6 transition-all">
                <Link href="/auth/signin" className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  <span>Contribute Now</span>
                </Link>
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full hover:bg-accent/50 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Navigation - Slide from right */}
      {isOpen && (
        <motion.div
          className="md:hidden fixed top-0 right-0 h-full w-4/5 max-w-xs bg-background/95 backdrop-blur-md shadow-xl z-50 border-l"
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex flex-col h-full overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b">
              <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text">
                VastSea
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-accent/50"
                onClick={() => setIsOpen(false)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
              </Button>
            </div>
            
            <div className="p-4">
              <form className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search problems..."
                  className="w-full pl-10 rounded-full border-primary/20 focus-visible:ring-primary/30"
                />
              </form>
            </div>
            <div className="border-t border-border/40 my-1"></div>
            <div className="px-4 space-y-2">
              <Link 
                href="/" 
                className="px-4 py-3 text-base font-medium rounded-md hover:bg-accent/50 transition-colors flex items-center"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/problems" 
                className="px-4 py-3 text-base font-medium rounded-md hover:bg-accent/50 transition-colors flex items-center"
                onClick={() => setIsOpen(false)}
              >
                Problems
              </Link>
              
              {session ? (
                <div className="space-y-3 mt-4">
                  <Link
                    href="/dashboard"
                    className="px-4 py-3 text-base font-medium rounded-md hover:bg-accent/50 transition-colors flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/add"
                    className="px-4 py-3 text-base font-medium rounded-md hover:bg-accent/50 transition-colors flex items-center"
                    onClick={() => setIsOpen(false)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Problem
                  </Link>
                  <Button 
                    variant="ghost" 
                    className="justify-start px-4 py-3 h-auto text-base font-medium w-full rounded-md text-destructive hover:bg-destructive/10 hover:text-destructive"
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
              <div className="mt-4">
                <Link
                  href="/auth/signin"
                  onClick={() => setIsOpen(false)}
                  className="block"
                >
                  <Button 
                    size="lg" 
                    className="w-full justify-center gap-1 rounded-full bg-gradient-to-r from-blue-600 to-teal-500 hover:shadow-md hover:shadow-primary/20 text-white"
                  >
                    <UserPlus className="h-4 w-4" />
                    Contribute Now
                  </Button>
                </Link>
              </div>
            )}
            </div>
            
            {/* Footer with theme toggle */}
            <div className="mt-auto p-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Switch theme</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-accent/50"
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
      )}
      
      {/* Modal overlay for mobile menu */}
      {isOpen && (
        <motion.div 
          className="md:hidden fixed inset-0 bg-black/30 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </header>
  );
};

export default Navbar;