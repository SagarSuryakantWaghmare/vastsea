"use client";
import Link from 'next/link';
import { Github, Heart, Star, ExternalLink, Mail, Linkedin, Code, Globe, Zap } from 'lucide-react';
import { FaBehance } from 'react-icons/fa';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const quickLinks = [
    { href: "/", label: "Home", icon: Globe },
    { href: "/problems", label: "Problems", icon: Code },
    { href: "/about", label: "About", icon: Heart },
    { href: "/contact", label: "Contact", icon: Mail },
  ];

  const socialLinks = [
    { 
      href: "https://github.com/SagarSuryakantWaghmare", 
      label: "GitHub", 
      icon: Github,
      color: "hover:text-gray-900 dark:hover:text-gray-100"
    },
    { 
      href: "https://linkedin.com/in/sagarwaghmare44", 
      label: "LinkedIn", 
      icon: Linkedin,
      color: "hover:text-blue-600"
    },
    { 
      href: "mailto:sagarwaghmare1384@gmail.com", 
      label: "Email", 
      icon: Mail,
      color: "hover:text-green-500"
    },
    { 
      href: "https://www.behance.net/sagarwaghmare", 
      label: "behance", 
      icon: FaBehance,
      color: "hover:text-blue-400"
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="w-full border-t border-border/50 bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <motion.div 
          className="py-12 md:py-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            
            {/* Brand Section */}
            <motion.div className="lg:col-span-2" variants={itemVariants}>
              <div className="flex items-center gap-3 mb-4">
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 text-transparent bg-clip-text">
                  VastSea
                </div>
                <span className="text-xs bg-gradient-to-r from-primary/20 to-secondary/20 text-primary px-3 py-1 rounded-full font-medium border border-primary/20">
                  Beta
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-md">
                Empowering developers with a comprehensive platform for coding challenges, 
                algorithmic problems, and collaborative learning. Join our community and 
                enhance your programming skills.
              </p>
              
              {/* CTA Section */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="https://github.com/SagarSuryakantWaghmare/vastsea"
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-blue-600/10 to-teal-500/10 hover:from-blue-600/20 hover:to-teal-500/20 border border-primary/20 hover:border-primary/40 rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-primary/10"
                >
                  <Star className="h-4 w-4 group-hover:text-yellow-500 transition-colors" />
                  <span>Star on GitHub</span>
                  <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100 transition-opacity" />
                </Link>
                
                <Link
                  href="/auth/signup"
                  className="group inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-gradient-to-r from-purple-600/10 to-pink-500/10 hover:from-purple-600/20 hover:to-pink-500/20 border border-purple-500/20 hover:border-purple-500/40 rounded-xl transition-all duration-200 hover:shadow-md hover:shadow-purple-500/10"
                >
                  <Zap className="h-4 w-4" />
                  <span>Contribute</span>
                </Link>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div variants={itemVariants}>
              <h3 className="text-sm font-semibold mb-4 text-foreground">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => {
                  const IconComponent = link.icon;
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                      >
                        <IconComponent className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                        <span>{link.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </motion.div>

            {/* Connect Section */}
            <motion.div variants={itemVariants}>
              <h3 className="text-sm font-semibold mb-4 text-foreground">Connect</h3>
              <div className="space-y-3">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <Link
                      key={social.href}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      className={`group flex items-center gap-3 text-sm text-muted-foreground transition-all duration-200 ${social.color}`}
                    >
                      <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-background border border-border/50 group-hover:border-current/30 group-hover:bg-current/5 transition-all duration-200">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <span className="group-hover:translate-x-1 transition-transform duration-200">
                        {social.label}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="py-6 border-t border-border/30"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Copyright */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>© {currentYear} VastSea. All rights reserved.</span>
              <div className="hidden md:flex items-center gap-4">
                <Link 
                  href="/privacy" 
                  className="hover:text-foreground transition-colors"
                >
                  Privacy
                </Link>
                <Link 
                  href="/terms" 
                  className="hover:text-foreground transition-colors"
                >
                  Terms
                </Link>
              </div>
            </div>

            {/* Creator Info */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Crafted with</span>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Heart className="h-4 w-4 text-red-500" />
              </motion.div>
              <span className="text-sm text-muted-foreground">by</span>
              <Link
                href="https://github.com/SagarSuryakantWaghmare"
                target="_blank"
                rel="noreferrer"
                className="group inline-flex items-center gap-1"
              >
                <span className="text-sm font-semibold bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-transparent bg-clip-text group-hover:from-orange-400 group-hover:via-amber-400 group-hover:to-yellow-400 transition-all duration-300">
                  Sagar Waghmare
                </span>
                <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-foreground transition-colors ml-1" />
              </Link>
            </div>
          </div>
          
          {/* Mobile Privacy Links */}
          <div className="flex md:hidden items-center justify-center gap-4 mt-4 pt-4 border-t border-border/20">
            <Link 
              href="/privacy" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link 
              href="/terms" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;