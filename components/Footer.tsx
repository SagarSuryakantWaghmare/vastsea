import Link from 'next/link';
import { Github, Heart, Star } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="w-full border-t bg-background">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-6">
        {/* Top section with logo and links */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-teal-500 text-transparent bg-clip-text">
              VastSea
            </div>
            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Beta</span>
          </div>
          
          <div className="flex items-center gap-6">
            <Link 
              href="https://github.com/SagarSuryakantWaghmare"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary group"
            >
              <span>Rate me on GitHub</span>
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-background border border-border group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                <Star className="h-4 w-4 group-hover:text-yellow-500 transition-colors" />
              </div>
            </Link>
            
            <Link
              href="https://github.com/SagarSuryakantWaghmare/vastsea"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center h-8 w-8 rounded-full bg-background border border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <Github className="h-4 w-4" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </div>
        
        {/* Bottom section with copyright and creator info */}
        <div className="pt-6 border-t border-border/40 flex flex-col md:flex-row items-center justify-between">
          <p className="text-center text-sm text-muted-foreground md:text-left mb-3 md:mb-0">
            © {currentYear} VastSea. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <p className="text-sm">Made with</p>
            <Heart className="h-4 w-4 text-red-500 animate-pulse" />
            <p className="text-sm">by</p>
            <span className="text-sm font-medium bg-gradient-to-r from-orange-500 to-amber-500 text-transparent bg-clip-text">
              SagarSuyakantWaghmare
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;