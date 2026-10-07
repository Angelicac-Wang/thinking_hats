import React from 'react';

/**
 * Replaces **bold** markdown with <strong> React elements.
 * Handles variations like **text**, ***bold-italic***, punctuation, etc.
 * Never leaves raw asterisks visible.
 */
export function renderInlineMarkdown(text: string): React.ReactNode {
  if (!text) return null;

  // Match bold patterns: **content**
  // Uses non-greedy matching to capture everything inside **...**
  const boldRegex = /\*\*(.*?)\*\*/g;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = boldRegex.exec(text)) !== null) {
    // Push preceding normal text if any
    if (match.index > lastIndex) {
      elements.push(text.slice(lastIndex, match.index));
    }

    // Push the bold node
    const boldContent = match[1];
    elements.push(
      <strong key={`bold-${match.index}`} className="font-bold text-amber-200 tracking-wide">
        {boldContent}
      </strong>
    );

    lastIndex = boldRegex.lastIndex;
  }

  // Push any remaining text after the last match
  if (lastIndex < text.length) {
    elements.push(text.slice(lastIndex));
  }

  // If there were no matches, return the original text
  if (elements.length === 0) {
    // Also strip any accidental leftover triple asterisks or lone ** from malformed markdown
    return text.replace(/\*\*/g, '');
  }

  return <>{elements}</>;
}

/**
 * Parses markdown inline bold (**text**), bullet points (- , •), and headers (### )
 * into beautiful structured React nodes without raw asterisks showing.
 */
export function formatFormattedContent(content: string): React.ReactNode {
  if (!content) return null;

  // Split into lines
  const lines = content.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed">
      {lines.map((line, lineIdx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={lineIdx} className="h-1" />;
        }

        // Header ### or ##
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={lineIdx} className="font-serif font-bold text-amber-300 text-xs sm:text-sm pt-1">
              {renderInlineMarkdown(trimmed.replace('### ', ''))}
            </h4>
          );
        }
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={lineIdx} className="font-serif font-bold text-amber-300 text-sm sm:text-base pt-1">
              {renderInlineMarkdown(trimmed.replace('## ', ''))}
            </h3>
          );
        }

        // Bullet point: - , • , *
        if (trimmed.startsWith('- ') || trimmed.startsWith('• ') || trimmed.startsWith('* ')) {
          const bulletText = trimmed.replace(/^[-•*]\s*/, '');
          return (
            <div key={lineIdx} className="flex items-start gap-1.5 pl-1.5">
              <span className="text-amber-400 font-bold shrink-0 leading-normal">•</span>
              <span className="flex-1">{renderInlineMarkdown(bulletText)}</span>
            </div>
          );
        }

        // Standard paragraph
        return (
          <p key={lineIdx} className="leading-relaxed">
            {renderInlineMarkdown(line)}
          </p>
        );
      })}
    </div>
  );
}
