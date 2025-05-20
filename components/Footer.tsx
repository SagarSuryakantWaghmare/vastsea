import Link from 'next/link';
import { Github, Heart, Star, ExternalLink, Code, Coffee } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t bg-background/90 backdrop-blur-sm">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Top section with logo and links */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
          <div className="flex items-center gap-2 mb-6 md:mb-0">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text">
              VastSea
            </div>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Beta</span>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link 
              href="https://github.com/SagarSuryakantWaghmare"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full bg-background shadow-sm border border-border hover:border-primary/40 hover:shadow-md transition-all group"
            >
              <Star className="h-4 w-4 text-yellow-500" />
              <span>Rate me on GitHub</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            
            <Link
              href="https://github.com/SagarSuryakantWaghmare/vastsea"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-full bg-background shadow-sm border border-border hover:border-primary/40 hover:shadow-md transition-all group"
            >
              <Code className="h-4 w-4 text-blue-500" />
              <span>Source Code</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
            
            <Link
              href="https://github.com/SagarSuryakantWaghmare"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center h-10 w-10 rounded-full bg-background shadow-sm border border-border hover:border-primary/40 hover:shadow-md transition-all"
            >
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </div>
        
        {/* Center decoration */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border/30"></div>
          </div>
          <div className="relative flex justify-center">
            <div className="bg-background px-4">
              <Coffee className="h-6 w-6 text-orange-400" />
            </div>
          </div>
        </div>
        
        {/* Bottom section with copyright and creator info */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <p className="text-center text-sm text-muted-foreground md:text-left mb-4 md:mb-0">
            © {currentYear} VastSea. All rights reserved.
          </p>
          <div className="flex items-center gap-3 bg-gradient-to-r from-orange-500/10 to-amber-500/10 px-4 py-2 rounded-full">
            <p className="text-sm">Made with</p>
            <Heart className="h-5 w-5 text-red-500 animate-pulse" />
            <p className="text-sm">by</p>
            <Link 
              href="https://github.com/SagarSuryakantWaghmare"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-bold bg-gradient-to-r from-orange-500 to-amber-500 text-transparent bg-clip-text hover:from-orange-600 hover:to-amber-600 transition-all"
            >
              Sagar Waghmare
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;