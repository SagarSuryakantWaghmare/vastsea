"use client";
import { useEffect, useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Code2, Play, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: string;
  placeholder?: string;
}

export default function CodeEditor({
  value,
  onChange,
  language,
  placeholder = "// Enter code here...",
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [lineCount, setLineCount] = useState(1);

  // Handle tab key for indentation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      
      // Insert two spaces for indentation
      const newValue = value.substring(0, start) + '  ' + value.substring(end);
      onChange(newValue);
      
      // Move cursor position after the inserted tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2;
        }
      }, 0);
    }
  };

  // Auto-resize the textarea and update line count
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
    
    // Update line count
    const lines = value.split('\n').length;
    setLineCount(lines);
  }, [value]);

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
      case 'python':
        return '🐍';
      default:
        return <Code2 className="h-3 w-3" />;
    }
  };

  const clearEditor = () => {
    onChange('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-xl border border-gray-800/50 bg-gradient-to-br from-gray-900/90 via-gray-900 to-gray-800/90 backdrop-blur-sm shadow-2xl transition-all duration-300 ${
        isFocused ? 'shadow-blue-500/20 border-blue-500/40' : 'hover:shadow-blue-500/10 hover:border-blue-500/30'
      } ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}
    >
      {/* Animated gradient overlay */}
      <div 
        className={`absolute inset-0 bg-gradient-to-r from-blue-500/5 via-cyan-500/5 to-blue-500/5 transition-opacity duration-500 ${
          isFocused ? 'opacity-100' : 'opacity-0'
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

          {/* Stats */}
          <div className="hidden sm:flex items-center gap-3 text-xs text-gray-400">
            <span>{lineCount} lines</span>
            <span>{value.length} chars</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600/50"
            onClick={clearEditor}
          >
            <RotateCcw className="h-3 w-3 mr-1.5" />
            Clear
          </Button>
          
          {/* <Button
            variant="ghost"
            size="sm"
            className="h-7 px-2 text-xs bg-green-500/20 text-green-300 hover:bg-green-500/30 border border-green-500/30"
          >
            <Play className="h-3 w-3 mr-1.5" />
            Run
          </Button> */}

          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-gray-600/50"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? (
              <Minimize2 className="h-3 w-3" />
            ) : (
              <Maximize2 className="h-3 w-3" />
            )}
          </Button>
        </div>
      </div>

      {/* Editor content */}
      <div className="relative flex">
        {/* Line numbers */}
        <div className="flex flex-col border-r border-gray-800/50 bg-gray-900/20 px-3 py-4 text-right text-xs text-gray-500 font-mono select-none min-w-[3rem]">
          {Array.from({ length: Math.max(lineCount, 20) }, (_, index) => (
            <div key={index + 1} className="leading-6 h-6 flex items-center justify-end">
              {index < lineCount ? index + 1 : ''}
            </div>
          ))}
        </div>

        {/* Code editor */}
        <div className="flex-1 relative">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={`
              font-mono text-sm bg-transparent border-none resize-none outline-none 
              focus-visible:ring-0 focus-visible:ring-offset-0 p-4 leading-6
              placeholder:text-gray-500 text-gray-100 w-full
              ${isFullscreen ? 'min-h-[calc(100vh-8rem)]' : 'min-h-80'}
            `}
            spellCheck={false}
            style={{
              height: isFullscreen ? 'calc(100vh - 8rem)' : 'auto',
            }}
          />

          {/* Syntax highlighting overlay could go here */}
          <div className="absolute bottom-2 right-2 opacity-0 transition-opacity duration-300 hover:opacity-100">
            <div className="rounded-full bg-gray-800/80 p-2 backdrop-blur-sm">
              <Code2 className="h-4 w-4 text-gray-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="border-t border-gray-800/50 bg-gray-900/20 px-4 py-2 backdrop-blur-sm">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-4">
            <span>UTF-8</span>
            <span>Spaces: 2</span>
            <span className="sm:hidden">{lineCount} lines • {value.length} chars</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500/80" />
            <span>Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
}