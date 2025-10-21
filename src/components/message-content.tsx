"use client";

import { memo } from 'react';

interface MessageContentProps {
  content: string;
}

export const MessageContent = memo(function MessageContent({ content }: MessageContentProps) {
  // Split content by code blocks first
  const parts = content.split(/(```[\w]*\n[\s\S]*?\n```)/g);

  return (
    <div className="space-y-3 text-sm">
      {parts.map((part, index) => {
        // Check if this is a code block
        const codeMatch = part.match(/```([\w]*)\n([\s\S]*?)\n```/);
        
        if (codeMatch) {
          const language = codeMatch[1] || 'code';
          const code = codeMatch[2];
          
          return (
            <div key={index} className="my-3">
              <div className="bg-muted/50 rounded-md overflow-hidden border border-border">
                {language && (
                  <div className="px-3 py-1.5 text-xs font-mono bg-muted border-b border-border text-muted-foreground">
                    {language}
                  </div>
                )}
                <pre className="p-3 overflow-x-auto text-xs">
                  <code className="font-mono text-foreground">{code}</code>
                </pre>
              </div>
            </div>
          );
        }

        // Process regular text with multiple formatting types
        return (
          <div key={index} className="space-y-2">
            {part.split('\n').map((line, lineIndex) => {
              // Skip empty lines
              if (!line.trim()) return null;

              // Check for headings (## or ###)
              const headingMatch = line.match(/^(#{2,3})\s+(.+)$/);
              if (headingMatch) {
                const level = headingMatch[1].length;
                const text = headingMatch[2];
                
                if (level === 2) {
                  return (
                    <h3 key={lineIndex} className="text-base font-semibold mt-4 mb-2 text-foreground">
                      {text}
                    </h3>
                  );
                } else {
                  return (
                    <h4 key={lineIndex} className="text-sm font-semibold mt-3 mb-1.5 text-foreground">
                      {text}
                    </h4>
                  );
                }
              }

              // Check for bullet points
              const bulletMatch = line.match(/^[•\-\*]\s+(.+)$/);
              if (bulletMatch) {
                const text = bulletMatch[1];
                
                // Process inline formatting (bold, inline code)
                const formattedText = processInlineFormatting(text);
                
                return (
                  <div key={lineIndex} className="flex gap-2 ml-2">
                    <span className="text-muted-foreground mt-0.5">•</span>
                    <span className="flex-1 leading-relaxed">{formattedText}</span>
                  </div>
                );
              }

              // Regular paragraph
              const formattedText = processInlineFormatting(line);
              
              return (
                <p key={lineIndex} className="leading-relaxed text-foreground/90">
                  {formattedText}
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
});

// Helper function to process inline formatting
function processInlineFormatting(text: string): React.ReactNode {
  const segments: React.ReactNode[] = [];
  let currentIndex = 0;
  let segmentKey = 0;

  // Regex to match inline code, bold text
  const inlinePattern = /(`[^`\n]+`)|(\*\*[^*\n]+\*\*)/g;
  let match;

  while ((match = inlinePattern.exec(text)) !== null) {
    // Add text before the match
    if (match.index > currentIndex) {
      segments.push(
        <span key={`text-${segmentKey++}`}>
          {text.slice(currentIndex, match.index)}
        </span>
      );
    }

    // Process the match
    if (match[1]) {
      // Inline code
      segments.push(
        <code 
          key={`code-${segmentKey++}`}
          className="px-1.5 py-0.5 mx-0.5 rounded bg-muted text-xs font-mono border border-border text-foreground"
        >
          {match[1].slice(1, -1)}
        </code>
      );
    } else if (match[2]) {
      // Bold text
      segments.push(
        <strong key={`bold-${segmentKey++}`} className="font-semibold text-foreground">
          {match[2].slice(2, -2)}
        </strong>
      );
    }

    currentIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (currentIndex < text.length) {
    segments.push(
      <span key={`text-${segmentKey++}`}>
        {text.slice(currentIndex)}
      </span>
    );
  }

  return segments.length > 0 ? segments : text;
}
