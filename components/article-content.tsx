import Link from "next/link";

export function ArticleContent({ content }: { content: string }) {
  return content.split(/\n{2,}/).filter(Boolean).map((paragraph, paragraphIndex) => (
    <p key={paragraphIndex} className="whitespace-pre-line">
      <InlineLinks text={paragraph} />
    </p>
  ));
}

function InlineLinks({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const linkPattern = /\[([^\]]+)\]\((\/[^)\s]+|https?:\/\/[^)\s]+)\)/g;
  let cursor = 0;
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(text)) !== null) {
    const index = match.index;
    if (index > cursor) parts.push(text.slice(cursor, index));
    const label = match[1];
    const href = match[2];
    const className = "font-bold text-leaf-800 underline decoration-leaf-300 decoration-2 underline-offset-4 hover:text-leaf-600";
    parts.push(href.startsWith("/")
      ? <Link key={`${index}-${href}`} href={href} className={className}>{label}</Link>
      : <a key={`${index}-${href}`} href={href} target="_blank" rel="noopener noreferrer" className={className}>{label}</a>);
    cursor = index + match[0].length;
  }

  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}
