"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Shield, Eye, Lock, Database, Users, Mail, Calendar, AlertTriangle } from 'lucide-react';

const PrivacyContent = () => {
  const lastUpdated = "July 2025";

  const sections = [
    {
      title: "Information We Collect",
      icon: Database,
      content: [
        "Account information (email, username, profile details)",
        "Problem submissions and solutions",
        "Usage analytics and performance metrics",
        "Communication data when you contact us",
        "Technical information (IP address, browser type, device info)"
      ]
    },
    {
      title: "How We Use Your Information",
      icon: Eye,
      content: [
        "Provide and improve our coding platform services",
        "Authenticate users and maintain account security",
        "Display leaderboards and track progress",
        "Send important updates and notifications",
        "Analyze usage patterns to enhance user experience"
      ]
    },
    {
      title: "Data Protection & Security",
      icon: Lock,
      content: [
        "Industry-standard encryption for data transmission",
        "Secure servers with regular security updates",
        "Limited access to personal data by authorized personnel",
        "Regular security audits and vulnerability assessments",
        "Secure password hashing and authentication"
      ]
    },
    {
      title: "Information Sharing",
      icon: Users,
      content: [
        "We do not sell your personal information to third parties",
        "Public profile information may be visible to other users",
        "Anonymous usage statistics may be shared for research",
        "Legal compliance when required by law",
        "Service providers who assist in platform operations"
      ]
    },
    {
      title: "Your Rights & Choices",
      icon: Shield,
      content: [
        "Access and update your personal information",
        "Delete your account and associated data",
        "Opt-out of non-essential communications",
        "Export your data in a portable format",
        "Request correction of inaccurate information"
      ]
    },
    {
      title: "Contact Information",
      icon: Mail,
      content: [
        "Email us at: sagarwaghmare1384@gmail.com",
        "Response time: Within 48 hours for privacy inquiries",
        "Data Protection Officer: Sagar Suryakant Waghmare",
        "Address any privacy concerns or questions",
        "Request data deletion or modification"
      ]
    }
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
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Shield className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-transparent bg-clip-text leading-tight tracking-tight">
              Privacy Policy
            </h1>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Badge variant="outline" className="px-3 py-1 text-sm">
              <Calendar className="h-3 w-3 mr-1" />
              Last Updated: {lastUpdated}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-sm">
              <AlertTriangle className="h-3 w-3 mr-1" />
              GDPR Compliant
            </Badge>
          </div>
          
          <p className="text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
            Your privacy is important to us. This policy explains how VastSea collects, uses, 
            and protects your personal information when you use our platform.
          </p>
        </motion.div>

        {/* Sections */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:gap-12"
        >
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="border-border/50 bg-gradient-to-br from-background via-background/95 to-background/90 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-2xl">{section.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex items-start gap-3">
                          <div className="flex-shrink-0 w-2 h-2 rounded-full bg-primary mt-2"></div>
                          <span className="text-muted-foreground leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <Card className="border-amber-200/50 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <span className="font-semibold text-amber-800 dark:text-amber-200">Important Notice</span>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-300 leading-relaxed">
                This privacy policy may be updated from time to time. We will notify users of any 
                significant changes via email or platform notifications. Continued use of VastSea 
                after policy updates constitutes acceptance of the new terms.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PrivacyContent;
