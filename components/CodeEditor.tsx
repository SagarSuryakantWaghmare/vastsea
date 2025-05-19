"use client";

import { useEffect, useRef } from 'react';
import { Textarea } from '@/components/ui/textarea';

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

  // Auto-resize the textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value]);

  return (
    <Textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      className="font-mono min-h-64 text-sm focus-visible:ring-1"
      spellCheck={false}
    />
  );
}