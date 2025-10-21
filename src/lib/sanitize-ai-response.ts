/**
 * Sanitizes and formats AI responses for better UI presentation
 */

export function sanitizeAIResponse(response: string): string {
  let sanitized = response;

  // Remove any markdown code block wrappers if the entire response is wrapped
  sanitized = sanitized.replace(/^```[\w]*\n([\s\S]*?)\n```$/g, '$1');

  // Clean up excessive newlines (more than 2 consecutive)
  sanitized = sanitized.replace(/\n{3,}/g, '\n\n');

  // Remove leading/trailing whitespace
  sanitized = sanitized.trim();

  // Fix common formatting issues
  sanitized = sanitized
    // Ensure proper spacing after periods
    .replace(/\.([A-Z])/g, '. $1')
    // Ensure proper spacing after colons in lists
    .replace(/:\s*\n/g, ':\n')
    // Clean up bullet points
    .replace(/^\s*[-*]\s+/gm, '• ')
    // Fix numbered lists spacing
    .replace(/^(\d+)\.\s+/gm, '$1. ');

  // Remove potential harmful HTML tags (XSS prevention)
  sanitized = sanitized
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>[\s\S]*?<\/iframe>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');

  // Format code blocks for better readability
  sanitized = sanitized.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang || 'code';
    const trimmedCode = code.trim();
    return `\`\`\`${language}\n${trimmedCode}\n\`\`\``;
  });

  // Ensure inline code blocks are properly formatted
  sanitized = sanitized.replace(/`([^`\n]+)`/g, (match, code) => {
    return `\`${code.trim()}\``;
  });

  // Remove any "Error:" prefix that might appear at the start
  // but keep error messages that are part of the actual response
  if (sanitized.startsWith('Error: Failed to get response')) {
    // Keep error messages as-is
    return sanitized;
  }

  // Clean up any repeated spaces (but preserve single newlines)
  sanitized = sanitized.replace(/ {2,}/g, ' ');

  // Format headers (markdown style) - preserve existing spacing
  sanitized = sanitized.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, text) => {
    return `${hashes} ${text.trim()}`;
  });

  // Ensure at least one newline before headers (but don't add excessive spacing)
  sanitized = sanitized.replace(/([^\n])(#{1,6}\s+.+)/g, '$1\n$2');

  return sanitized;
}

/**
 * Extracts and formats code snippets from the response
 */
export function extractCodeSnippets(response: string): { language: string; code: string }[] {
  const codeBlocks: { language: string; code: string }[] = [];
  const regex = /```(\w+)?\n([\s\S]*?)```/g;
  
  let match;
  while ((match = regex.exec(response)) !== null) {
    codeBlocks.push({
      language: match[1] || 'text',
      code: match[2].trim(),
    });
  }
  
  return codeBlocks;
}

/**
 * Truncates long responses with a "read more" indicator
 */
export function truncateResponse(response: string, maxLength: number = 2000): { text: string; isTruncated: boolean } {
  if (response.length <= maxLength) {
    return { text: response, isTruncated: false };
  }

  // Try to truncate at a sentence boundary
  const truncated = response.slice(0, maxLength);
  const lastPeriod = truncated.lastIndexOf('.');
  const lastNewline = truncated.lastIndexOf('\n');
  
  const cutoff = Math.max(lastPeriod, lastNewline);
  const finalText = cutoff > 0 ? truncated.slice(0, cutoff + 1) : truncated;

  return {
    text: finalText + '\n\n...',
    isTruncated: true,
  };
}

/**
 * Formats the response for better readability
 */
export function formatResponse(response: string): string {
  let formatted = sanitizeAIResponse(response);

  // Add spacing around lists
  formatted = formatted.replace(/\n(•|\d+\.)\s/g, '\n\n$1 ');

  // Ensure proper paragraph spacing
  formatted = formatted.replace(/([.!?])\n([A-Z])/g, '$1\n\n$2');

  return formatted;
}
