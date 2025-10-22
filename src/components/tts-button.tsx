'use client';

import { useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TTSButtonProps {
  text?: string;
  lang?: string;
}

export default function TTSButton({ text, lang }: TTSButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const extractTextFromPage = (): string => {
    // If text is provided, use it
    if (text) return text;

    // Otherwise, extract from the MDX content
    const contentElement = document.querySelector('.nd-prose, article, main');
    
    if (!contentElement) return '';

    // Clone to avoid modifying original
    const clone = contentElement.cloneNode(true) as HTMLElement;

    // Remove non-content elements
    const removeSelectors = [
      'pre',
      'code',
      'nav',
      'button',
      'aside',
      '[role="navigation"]',
      '.toc',
      'header',
      'footer',
      'script',
      'style',
    ];

    removeSelectors.forEach(selector => {
      clone.querySelectorAll(selector).forEach(el => el.remove());
    });

    return clone.textContent?.trim() || '';
  };

  const speak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported in this browser.');
      return;
    }

    // Stop if already speaking
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToSpeak = extractTextFromPage();

    if (!textToSpeak) {
      alert('No content found to read.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Set language based on prop or document lang
    const languageCode = lang || document.documentElement.lang || 'en-IN';
    utterance.lang = languageCode;
    
    // Set voice parameters
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    // Handle events
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  return (
    <Button
      onClick={speak}
      variant="outline"
      size="sm"
      className="gap-2"
      aria-label={isSpeaking ? 'Stop reading' : 'Read aloud'}
    >
      {isSpeaking ? (
        <>
          <VolumeX className="h-4 w-4" />
          Stop
        </>
      ) : (
        <>
          <Volume2 className="h-4 w-4" />
          Listen
        </>
      )}
    </Button>
  );
}
