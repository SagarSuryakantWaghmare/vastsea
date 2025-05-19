"use client";

import { useEffect, useRef } from 'react';
import hljs from 'highlight.js/lib/core';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import c from 'highlight.js/lib/languages/c';
import javascript from 'highlight.js/lib/languages/javascript';
import 'highlight.js/styles/atom-one-dark.css';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

// Register the languages
hljs.registerLanguage('java', java);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('c', c);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);

interface CodeBlockProps {
  code: string;
  language: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  
  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightElement(codeRef.current);
    }
  }, [code, language]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="relative overflow-hidden border">
      <div className="absolute right-2 top-2 z-10">
        <Button
          variant="secondary"
          size="icon"
          className="h-7 w-7 bg-card/80 backdrop-blur-sm"
          onClick={copyToClipboard}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          <span className="sr-only">Copy code</span>
        </Button>
      </div>
      <pre className="p-4 overflow-x-auto bg-card font-mono text-sm">
        <code ref={codeRef} className={`language-${language}`}>
          {code}
        </code>
      </pre>
    </Card>
  );
}