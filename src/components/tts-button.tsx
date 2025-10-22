'use client';

import { useState, useEffect } from 'react';
import { Volume2, VolumeX, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from 'fumadocs-ui/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface TTSButtonProps {
  text?: string;
  lang?: string;
}

export default function TTSButton({ text, lang }: TTSButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState([0.9]);
  const [pitch, setPitch] = useState([1]);
  const [volume, setVolume] = useState([1]);

  useEffect(() => {
    // Load available voices
    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      setVoices(availableVoices);
      
      // Set default voice if not set
      if (!selectedVoice && availableVoices.length > 0) {
        const defaultVoice = availableVoices.find(voice => voice.lang.startsWith('en')) || availableVoices[0];
        setSelectedVoice(defaultVoice.name);
      }
    };

    loadVoices();
    
    // Some browsers load voices asynchronously
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [selectedVoice]);

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
      '.page-actions',
      '.feedback-section',
    ];

    removeSelectors.forEach(selector => {
      clone.querySelectorAll(selector).forEach(el => el.remove());
    });

    // Extract text with better structure
    const textContent = clone.textContent?.trim() || '';
    
    // Clean up extra whitespace
    return textContent.replace(/\s+/g, ' ').trim();
  };

  const speak = () => {
    if (!('speechSynthesis' in window)) {
      alert('Text-to-Speech is not supported in this browser.');
      return;
    }

    // Stop if already speaking
    if (isSpeaking) {
      if (isPaused) {
        speechSynthesis.resume();
        setIsPaused(false);
      } else {
        speechSynthesis.pause();
        setIsPaused(true);
      }
      return;
    }

    const textToSpeak = extractTextFromPage();

    if (!textToSpeak) {
      alert('No content found to read.');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Set voice
    if (selectedVoice) {
      const voice = voices.find(v => v.name === selectedVoice);
      if (voice) {
        utterance.voice = voice;
      }
    }
    
    // Set language based on prop or document lang
    const languageCode = lang || document.documentElement.lang || 'en-IN';
    utterance.lang = languageCode;
    
    // Set voice parameters
    utterance.rate = rate[0];
    utterance.pitch = pitch[0];
    utterance.volume = volume[0];

    // Handle events
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  };

  const stop = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const getButtonText = () => {
    if (!isSpeaking) return 'Listen';
    if (isPaused) return 'Resume';
    return 'Pause';
  };

  const getButtonIcon = () => {
    if (!isSpeaking) return <Volume2 className="h-4 w-4" />;
    if (isPaused) return <Volume2 className="h-4 w-4" />;
    return <VolumeX className="h-4 w-4" />;
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        onClick={speak}
        variant="outline"
        size="sm"
        className="gap-2"
        aria-label={isSpeaking ? (isPaused ? 'Resume reading' : 'Pause reading') : 'Read aloud'}
      >
        {getButtonIcon()}
        {getButtonText()}
      </Button>

      {isSpeaking && (
        <Button
          onClick={stop}
          variant="outline"
          size="sm"
          className="gap-2"
          aria-label="Stop reading"
        >
          <VolumeX className="h-4 w-4" />
          Stop
        </Button>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="p-2"
            aria-label="TTS Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div>
              <Label htmlFor="voice-select">Voice</Label>
              <Select value={selectedVoice} onValueChange={setSelectedVoice}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.name} value={voice.name}>
                      {voice.name} ({voice.lang})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Speed: {rate[0].toFixed(1)}x</Label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate[0]}
                onChange={(e) => setRate([parseFloat(e.target.value)])}
                className="w-full mt-2"
              />
            </div>

            <div>
              <Label>Pitch: {pitch[0].toFixed(1)}</Label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={pitch[0]}
                onChange={(e) => setPitch([parseFloat(e.target.value)])}
                className="w-full mt-2"
              />
            </div>

            <div>
              <Label>Volume: {Math.round(volume[0] * 100)}%</Label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume[0]}
                onChange={(e) => setVolume([parseFloat(e.target.value)])}
                className="w-full mt-2"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
