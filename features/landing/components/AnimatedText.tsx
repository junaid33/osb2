'use client';

import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface AnimatedTextProps {
  words?: string[];
  typingSpeed?: number;
  erasingSpeed?: number;
  pauseDuration?: number;
  className?: string;
}

export default function AnimatedText({
  words = [
    'Shopify',
    'Notion', 
    'Tailwind Plus',
    'v0',
    'Cursor',
    'Figma',
    'Slack',
    'Zoom'
  ],
  typingSpeed = 100,
  erasingSpeed = 50,
  pauseDuration = 2000,
  className = ''
}: AnimatedTextProps) {
  const router = useRouter();
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [chevronText, setChevronText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isTypingChevron, setIsTypingChevron] = useState(false);

  const fullChevron = ' ⌄'; // The chevron character that gets typed

  useEffect(() => {
    // Don't animate if paused
    if (isPaused) return;
    
    const currentWord = words[currentWordIndex];
    
    const timeout = setTimeout(() => {
      if (isTyping && !isDeleting && !isTypingChevron) {
        // Typing phase - typing the word
        if (currentText.length < currentWord.length) {
          setCurrentText(currentWord.slice(0, currentText.length + 1));
        } else {
          // Finished typing word, now type chevron
          setIsTypingChevron(true);
        }
      } else if (isTypingChevron) {
        // Type the chevron
        if (chevronText.length < fullChevron.length) {
          setChevronText(fullChevron.slice(0, chevronText.length + 1));
        } else {
          // Finished typing chevron, pause then start deleting
          setTimeout(() => {
            setIsDeleting(true);
            setIsTyping(false);
            setIsTypingChevron(false);
          }, pauseDuration);
        }
      } else if (isDeleting) {
        // Deleting phase - delete chevron first, then word
        if (chevronText.length > 0) {
          setChevronText(chevronText.slice(0, -1));
        } else if (currentText.length > 0) {
          setCurrentText(currentText.slice(0, -1));
        } else {
          // Finished deleting, move to next word
          setIsDeleting(false);
          setIsTyping(true);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? erasingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [currentText, chevronText, currentWordIndex, isTyping, isDeleting, isTypingChevron, words, typingSpeed, erasingSpeed, pauseDuration, isPaused]);

  const handleClick = () => {
    setShowDropdown(!showDropdown);
    setIsPaused(true);
  };

  const handleWordSelect = (word: string) => {
    const slug = word.toLowerCase().replace(/\s+/g, '-');
    router.push(`/alternatives/${slug}`);
    setShowDropdown(false);
    setIsPaused(false);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    if (!showDropdown) {
      setIsPaused(false);
    }
  };

  return (
    <div className="relative inline-block">
      <span 
        className={`inline-flex items-center text-muted-foreground cursor-pointer hover:text-foreground transition-colors ${className}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {currentText}
        {chevronText}
        <span className={`animate-pulse text-muted-foreground ml-1 ${isPaused ? 'opacity-100' : ''}`}>|</span>
      </span>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-background border border-border rounded-lg shadow-lg z-50">
          <div className="py-2">
            {words.map((word, index) => (
              <button
                key={index}
                className="w-full px-4 py-2 text-left hover:bg-muted transition-colors text-sm"
                onClick={() => handleWordSelect(word)}
              >
                {word}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}