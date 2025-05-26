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
import { Copy, Check, Code2 } from 'lucide-react';
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
  const [isHovered, setIsHovered] = useState(false);

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

  const getLanguageIcon = () => {
    switch (language.toLowerCase()) {
      case 'javascript':
      case 'js':
        return '🟨';
      case 'java':
        return '☕';
      case 'cpp':
      case 'c++':
        return '🔧';
      case 'c':
        return '⚡';
      default:
        return <Code2 className="h-3 w-3" />;
    }
  };

  return (
    <Card 
      className="relative overflow-hidden border-gray-800/50 bg-gradient-to-br from-gray-900/90 via-gray-900 to-gray-800/90 backdrop-blur-sm shadow-2xl transition-all duration-300 hover:shadow-blue-500/10 hover:border-blue-500/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-blue-500/5 transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} 
      />
      
      {/* Header */}
      <div className="relative flex items-center justify-between border-b border-gray-800/50 bg-gray-900/30 px-4 py-2.5 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          {/* Traffic lights */}
          <div className="flex gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80 transition-all duration-200 hover:bg-red-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80 transition-all duration-200 hover:bg-yellow-400" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/80 transition-all duration-200 hover:bg-green-400" />
          </div>
          
          {/* Language info */}
          <div className="flex items-center gap-2">
            <span className="text-sm">{getLanguageIcon()}</span>
            <span className="text-xs font-medium text-blue-400/90 bg-blue-500/10 px-2 py-1 rounded-full border border-blue-500/20">
              {language.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Copy button */}
        <Button
          variant="ghost"
          size="sm"
          className={`h-8 px-3 text-xs font-medium transition-all duration-200 ${
            copied 
              ? 'bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/20' 
              : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600/50'
          }`}
          onClick={copyToClipboard}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3 mr-1.5" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-3 w-3 mr-1.5" />
              Copy
            </>
          )}
        </Button>
      </div>

      {/* Code content with line numbers */}
      <div className="relative">
        {/* Line numbers */}
        <div className="absolute left-0 top-0 flex flex-col border-r border-gray-800/50 bg-gray-900/20 px-3 py-4 text-right text-xs text-gray-500 font-mono select-none min-w-[3rem]">
          {code.split('\n').map((_, index) => (
            <div key={index} className="leading-5 h-5 flex items-center justify-end">
              {index + 1}
            </div>
          ))}
        </div>

        {/* Code block */}
        <pre className="p-4 pl-16 overflow-x-auto bg-transparent font-mono text-sm leading-5">
          <code ref={codeRef} className={`language-${language} text-gray-100`}>
            {code}
          </code>
        </pre>

        {/* Animated border effect */}
        <div className={`absolute inset-0 rounded-lg transition-opacity duration-500 pointer-events-none ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 blur-sm" />
        </div>
      </div>
    </Card>
  );
}