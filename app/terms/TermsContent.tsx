"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { FileText, UserCheck, Shield, AlertCircle, Scale, Mail, Calendar, CheckCircle } from 'lucide-react';

const TermsContent = () => {
  const lastUpdated = "December 2024";

  const sections = [
    {
      title: "Acceptance of Terms",
      icon: UserCheck,
      content: [
        "By accessing VastSea, you agree to be bound by these Terms of Service",
        "You must be at least 13 years old to use our platform",
        "If you disagree with any terms, please discontinue use immediately",
        "These terms apply to all users, including visitors and registered members",
        "Terms are effective immediately upon first use of the platform"
      ]
    },
    {
      title: "User Accounts & Responsibilities",
      icon: Shield,
      content: [
        "You are responsible for maintaining account security and confidentiality",
        "Provide accurate and complete information during registration",
        "You are liable for all activities that occur under your account",
        "Notify us immediately of any unauthorized account access",
        "One account per person; multiple accounts are not permitted"
      ]
    },
    {
      title: "Platform Usage & Content",
      icon: FileText,
      content: [
        "Use VastSea only for lawful purposes and educational activities",
        "Do not submit malicious code, viruses, or harmful content",
        "Respect intellectual property rights of others",
        "Your submitted solutions may be visible to other users",
        "We reserve the right to remove inappropriate content"
      ]
    },
    {
      title: "Prohibited Activities",
      icon: AlertCircle,
      content: [
        "Attempting to hack, compromise, or disrupt platform security",
        "Sharing solutions to ongoing contests or plagiarizing work",
        "Harassment, discrimination, or abusive behavior toward other users",
        "Creating multiple accounts to circumvent platform limitations",
        "Commercial use without explicit written permission"
      ]
    },
    {
      title: "Intellectual Property Rights",
      icon: Scale,
      content: [
        "VastSea retains ownership of platform design, code, and original content",
        "Users retain ownership of their original problem solutions",
        "By submitting content, you grant us a license to display and distribute it",
        "Respect copyrights and do not submit plagiarized content",
        "Report any intellectual property violations to our team"
      ]
    },
    {
      title: "Limitation of Liability",
      icon: CheckCircle,
      content: [
        "VastSea is provided 'as is' without warranties of any kind",
        "We are not liable for any indirect, incidental, or consequential damages",
        "Our total liability is limited to the amount you paid for services",
        "You use the platform at your own risk and discretion",
        "We do not guarantee uninterrupted or error-free service"
      ]
    },
    {
      title: "Contact & Support",
      icon: Mail,
      content: [
        "Questions about terms: sagarwaghmare1384@gmail.com",
        "Report violations or abuse through our contact form",
        "We respond to inquiries within 48 hours during business days",
        "For urgent matters, mark emails as 'URGENT' in the subject line",
        "Legal notices should be sent to our registered business address"
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
            <Scale className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 text-transparent bg-clip-text leading-tight tracking-tight">
              Terms of Service
            </h1>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            <Badge variant="outline" className="px-3 py-1 text-sm">
              <Calendar className="h-3 w-3 mr-1" />
              Last Updated: {lastUpdated}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-sm">
              <CheckCircle className="h-3 w-3 mr-1" />
              Legally Binding
            </Badge>
          </div>
          
          <p className="text-lg leading-8 text-muted-foreground max-w-3xl mx-auto">
            These Terms of Service govern your use of VastSea. Please read them carefully 
            as they contain important information about your rights and obligations.
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

        {/* Agreement Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 text-center"
        >
          <Card className="border-blue-200/50 bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-blue-800 dark:text-blue-200">Agreement</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                By continuing to use VastSea, you acknowledge that you have read, understood, 
                and agree to be bound by these Terms of Service. These terms may be updated 
                periodically, and continued use constitutes acceptance of any modifications.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Termination Notice */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <Card className="border-red-200/50 bg-gradient-to-br from-red-50/50 to-pink-50/50 dark:from-red-950/20 dark:to-pink-950/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-center gap-2 mb-3">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                <span className="font-semibold text-red-800 dark:text-red-200">Termination</span>
              </div>
              <p className="text-sm text-red-700 dark:text-red-300 leading-relaxed">
                We reserve the right to terminate or suspend accounts that violate these terms. 
                Users may also terminate their accounts at any time through account settings or 
                by contacting our support team.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default TermsContent;
