import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* 
// COMMENTED: Emotion map for converting emotion tags to emojis
// Uncomment this when you want to use emoji rendering instead of removing tags
const emotionMap: Record<string, string> = {
  happy: "😊",
  excited: "🤩",
  enthusiastic: "😁",
  elated: "🥳",
  euphoric: "✨",
  triumphant: "🏆",
  amazed: "😮",
  surprised: "😲",
  flirtatious: "😉",
  "joking/comedic": "🤣",
  curious: "🤔",
  content: "☺️",
  peaceful: "😌",
  serene: "🌿",
  calm: "🧘",
  grateful: "🙏",
  affectionate: "🥰",
  trust: "🤝",
  sympathetic: "😔",
  anticipation: "⏳",
  mysterious: "🕵️",
  angry: "😠",
  mad: "😡",
  outraged: "🤬",
  frustrated: "😤",
  agitated: "😖",
  threatened: "⚠️",
  disgusted: "🤢",
  contempt: "🙄",
  envious: "😒",
  sarcastic: "😏",
  ironic: "😼",
  sad: "😢",
  dejected: "😞",
  melancholic: "😔",
  disappointed: "😕",
  hurt: "💔",
  guilty: "😣",
  bored: "🥱",
  tired: "😴",
  rejected: "🚫",
  nostalgic: "📷",
  wistful: "💭",
  apologetic: "🙇",
  hesitant: "😬",
  insecure: "😳",
  confused: "😵",
  resigned: "😑",
  anxious: "😰",
  panicked: "😱",
  alarmed: "🚨",
  scared: "😨",
  neutral: "😐",
  proud: "😌",
  confident: "😎",
  distant: "🫥",
  skeptical: "🤨",
  contemplative: "🤔",
  determined: "🔥",
};
*/

interface EmotionRendererProps {
  text: string;
}

export default function EmotionRenderer({ text }: EmotionRendererProps) {
  // Simply remove emotion, speed, volume tags and [laughter] from the text
  const cleanedText = text
    .replace(/<emotion\s+value=["']([^"']+)["']\s*\/?>/gi, '') // Remove emotion tags
    .replace(/<speed\s+ratio=["']([^"']+)["']\s*\/?>/gi, '') // Remove speed tags
    .replace(/<volume\s+ratio=["']([^"']+)["']\s*\/?>/gi, '') // Remove volume tags
    .replace(/\[laughter\]/gi, ''); // Remove laughter tags

  /* 
  // COMMENTED: Code to convert emotions to icons/emojis
  // Uncomment this section if you want to show emojis instead of removing tags
  //
  // Currently removed tags:
  // - <emotion value="happy"/> etc.
  // - <speed ratio="1.5"/> etc.
  // - <volume ratio="2.0"/> etc.
  // - [laughter]
  
  const processTextWithEmotions = (input: string): React.ReactNode[] => {
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    
    // Pattern to match emotion, speed, volume tags and [laughter]
    const emotionPattern = /<emotion\s+value=["']([^"']+)["']\s*\/?>/g;
    const speedPattern = /<speed\s+ratio=["']([^"']+)["']\s*\/?>/g;
    const volumePattern = /<volume\s+ratio=["']([^"']+)["']\s*\/?>/g;
    const laughterPattern = /\[laughter\]/gi;
    
    // Combine patterns
    const combinedPattern = new RegExp(
      `${emotionPattern.source}|${speedPattern.source}|${volumePattern.source}|${laughterPattern.source}`,
      'gi'
    );
    
    let match;
    while ((match = combinedPattern.exec(input)) !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        parts.push(input.substring(lastIndex, match.index));
      }
      
      // Check if it's an emotion tag
      if (match[0].startsWith('<emotion')) {
        const emotionMatch = match[0].match(/<emotion\s+value=["']([^"']+)["']\s*\/?>/i);
        if (emotionMatch && emotionMatch[1]) {
          const emotion = emotionMatch[1].toLowerCase();
          const emoji = emotionMap[emotion];
          
          // Only add emoji if it exists in the map
          if (emoji) {
            parts.push(
              <span key={match.index} style={{ fontSize: 22, marginRight: 6 }}>
                {emoji}
              </span>
            );
          }
        }
      } else if (match[0].toLowerCase() === '[laughter]') {
        // Handle laughter
        parts.push(
          <span key={match.index} style={{ fontSize: 22, marginRight: 6 }}>
            😂
          </span>
        );
      }
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < input.length) {
      parts.push(input.substring(lastIndex));
    }
    
    return parts;
  };

  const processedParts = processTextWithEmotions(text);
  
  // If we have mixed content (text + emotions), render each part
  if (processedParts.length > 1) {
    return (
      <div className="inline">
        {processedParts.map((part, index) => {
          if (typeof part === 'string') {
            // Render text parts with markdown
            return (
              <ReactMarkdown
                key={index}
                remarkPlugins={[remarkGfm]}
                components={{
                  // Customize elements for chat style
                  p: ({ children }) => <span className="inline">{children}</span>,
                  code: ({ inline, children, ...props }: { inline?: boolean; children?: React.ReactNode }) => {
                    return inline ? (
                      <code className="bg-gray-200 px-1 py-0.5 rounded text-sm" {...props}>
                        {children}
                      </code>
                    ) : (
                      <code
                        className="block bg-gray-800 text-white p-2 rounded my-2 overflow-x-auto"
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  },
                  ul: ({ children }) => <ul className="my-2 list-disc list-inside">{children}</ul>,
                  ol: ({ children }) => <ol className="my-2 list-decimal list-inside">{children}</ol>,
                  li: ({ children }) => <li className="my-1">{children}</li>,
                  a: ({ children, href }) => (
                    <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                  h1: ({ children }) => <h1 className="text-xl font-bold my-2">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-lg font-bold my-2">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-base font-bold my-2">{children}</h3>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-300 pl-3 my-2 italic">{children}</blockquote>
                  ),
                  table: ({ children }) => (
                    <table className="border-collapse border border-gray-300 my-2">{children}</table>
                  ),
                  th: ({ children }) => (
                    <th className="border border-gray-300 px-2 py-1 bg-gray-100 font-bold">{children}</th>
                  ),
                  td: ({ children }) => <td className="border border-gray-300 px-2 py-1">{children}</td>,
                }}
              >
                {part}
              </ReactMarkdown>
            );
          } else {
            // Render emotion emoji components directly
            return part;
          }
        })}
      </div>
    );
  }
  */

  // Render the cleaned text with markdown
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        // Customize elements for chat style
        p: ({ children }) => <p className="my-2 first:mt-0 last:mb-0">{children}</p>,
        code: ({ inline, children, ...props }: { inline?: boolean; children?: React.ReactNode }) => {
          return inline ? (
            <code className="bg-gray-200 px-1 py-0.5 rounded text-sm" {...props}>
              {children}
            </code>
          ) : (
            <code
              className="block bg-gray-800 text-white p-2 rounded my-2 overflow-x-auto"
              {...props}
            >
              {children}
            </code>
          );
        },
        ul: ({ children }) => <ul className="my-2 list-disc list-inside">{children}</ul>,
        ol: ({ children }) => <ol className="my-2 list-decimal list-inside">{children}</ol>,
        li: ({ children }) => <li className="my-1">{children}</li>,
        a: ({ children, href }) => (
          <a href={href} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        ),
        h1: ({ children }) => <h1 className="text-xl font-bold my-2">{children}</h1>,
        h2: ({ children }) => <h2 className="text-lg font-bold my-2">{children}</h2>,
        h3: ({ children }) => <h3 className="text-base font-bold my-2">{children}</h3>,
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-300 pl-3 my-2 italic">{children}</blockquote>
        ),
        table: ({ children }) => (
          <table className="border-collapse border border-gray-300 my-2">{children}</table>
        ),
        th: ({ children }) => (
          <th className="border border-gray-300 px-2 py-1 bg-gray-100 font-bold">{children}</th>
        ),
        td: ({ children }) => <td className="border border-gray-300 px-2 py-1">{children}</td>,
      }}
    >
      {cleanedText}
    </ReactMarkdown>
  );
}

