import React from 'react';

interface HighlightedTitleProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div';
}

/**
 * Renders text with words wrapped in asterisks highlighted in primary color.
 * Example: "Прозоре *ціноутворення*" -> "Прозоре <span class="text-primary-fixed">ціноутворення</span>"
 */
export default function HighlightedTitle({ text, className = '', as: Component = 'h2' }: HighlightedTitleProps) {
  if (!text) return null;

  // Split by asterisk. Every odd index will be the highlighted word.
  // Example: "Hello *world* today" -> ["Hello ", "world", " today"]
  const parts = text.split('*');

  return (
    <Component className={className}>
      {parts.map((part, i) => (
        i % 2 === 1 ? (
          <span key={i} className="text-primary-fixed">{part}</span>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        )
      ))}
    </Component>
  );
}
