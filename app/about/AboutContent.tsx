"use client";

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, ExternalLink, Code, Heart, Star, Target, Users, Zap } from 'lucide-react';
import { FaBehance } from 'react-icons/fa';
import Link from 'next/link';

const AboutContent = () => {
  const skills = [
    'React', 'Next.js', 'TypeScript', 'Node.js', 'MongoDB', 
    'TailwindCSS', 'JavaScript', 'Python', 'Java', 'C++'
  ];

  const stats = [
    { label: 'Problems Created', value: '50+', icon: Code },
    { label: 'Users Helped', value: '100+', icon: Users },
    { label: 'GitHub Stars', value: '25+', icon: Star },
    { label: 'Projects Built', value: '10+', icon: Target },
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
      label: "Behance", 
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
    <div className="min-h-screen py-12">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex flex-col items-center gap-6">
            <Avatar className="h-32 w-32 border-4 border-primary/20 shadow-xl">
              <AvatarImage src="/avatars/sagar.jpg" alt="Sagar Suryakant Waghmare" />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                SW
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h1 className="py-4 text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-transparent bg-clip-text leading-tight tracking-tight mb-4">
                Sagar Suryakant Waghmare
              </h1>
              <div className="flex flex-wrap justify-center gap-2 mb-6">
                <Badge variant="outline" className="px-3 py-1 text-sm">
                  Full Stack Developer
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-sm">
                  UI/UX Designer
                </Badge>
                <Badge variant="outline" className="px-3 py-1 text-sm">
                  Open Source Enthusiast
                </Badge>
              </div>
              
              <p className="text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
                Passionate developer and creator of VastSea - a comprehensive platform for coding challenges 
                and algorithmic problem solving. I believe in building tools that empower developers to grow 
                and learn together.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
        >
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="text-center p-6 border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                  <CardContent className="p-0">
                    <IconComponent className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <div className="text-2xl font-bold text-foreground mb-1">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* About & Mission Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-12 mb-16"
        >
          <motion.div variants={itemVariants}>
            <Card className="p-8 h-full border-border/50 bg-gradient-to-br from-background via-background/95 to-background/90">
              <CardHeader className="p-0 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Heart className="h-6 w-6 text-red-500" />
                  <CardTitle className="text-2xl">About Me</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  I'm a dedicated full-stack developer with a passion for creating meaningful digital experiences. 
                  My journey in programming started with curiosity and has evolved into a mission to build tools 
                  that help others learn and grow.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  When I'm not coding, you'll find me exploring new technologies, contributing to open source 
                  projects, or mentoring fellow developers in their coding journey.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="p-8 h-full border-border/50 bg-gradient-to-br from-background via-background/95 to-background/90">
              <CardHeader className="p-0 mb-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="h-6 w-6 text-blue-500" />
                  <CardTitle className="text-2xl">Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <p className="text-muted-foreground leading-relaxed mb-4">
                  My mission is to democratize programming education by creating accessible, engaging, and 
                  comprehensive learning platforms. VastSea represents this vision - a place where developers 
                  of all levels can challenge themselves and grow.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  I believe that great software is built by great communities, and I'm committed to fostering 
                  an environment where knowledge sharing and collaboration thrive.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mb-16"
        >
          <motion.div variants={itemVariants} className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Skills & Technologies</h2>
            <p className="text-muted-foreground">
              Technologies and tools I work with to bring ideas to life
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-3">
            {skills.map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border border-primary/20 hover:border-primary/40 transition-all duration-200"
              >
                {skill}
              </Badge>
            ))}
          </motion.div>
        </motion.div>

        {/* Connect Section */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div variants={itemVariants} className="mb-8">
            <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
            <p className="text-muted-foreground mb-8">
              I'm always excited to connect with fellow developers and discuss new opportunities
            </p>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mb-8">
            {socialLinks.map((social, index) => {
              const IconComponent = social.icon;
              return (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`group flex items-center gap-3 px-6 py-3 rounded-xl border border-border/50 hover:border-current/30 bg-background/50 hover:bg-current/5 transition-all duration-200 ${social.color}`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="font-medium">{social.label}</span>
                  <ExternalLink className="h-4 w-4 opacity-60 group-hover:opacity-100 transition-opacity" />
                </Link>
              );
            })}
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="px-8 py-3 rounded-xl">
              <Link href="/problems" className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Explore Problems
              </Link>
            </Button>
            
            <Button size="lg" variant="outline" asChild className="px-8 py-3 rounded-xl">
              <Link href="/add" className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Contribute Now
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutContent;
