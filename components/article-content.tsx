import Link from "next/link";

export function ArticleContent({ content }: { content: string }) {
  const paragraphs = content.split(/\n{2,}/).filter(Boolean);
  const elements: React.ReactNode[] = [];
  let paragraphIndex = 0;
  let hasQuizGuide = false;

  while (paragraphIndex < paragraphs.length) {
    const paragraph = paragraphs[paragraphIndex];

    if (paragraph.startsWith("## クイズ")) {
      if (!hasQuizGuide) {
        elements.push(
          <aside key="quiz-guide" className="rounded-2xl border border-fruit-200 bg-fruit-50/70 p-4 text-sm font-semibold leading-7 text-leaf-900 sm:p-5">
            選択肢を一つ決めてから「答えを見る」を押してください。答えと詳しい解説は、押すまで表示されません。
          </aside>
        );
        hasQuizGuide = true;
      }

      const questionLines = paragraph.split("\n").map((line) => line.trim()).filter(Boolean);
      const question = questionLines[0].slice(3);
      const options = parseQuizOptions(questionLines.slice(1).join(" "));
      const answerParagraphs: string[] = [];
      paragraphIndex += 1;

      while (paragraphIndex < paragraphs.length && !paragraphs[paragraphIndex].startsWith("## ")) {
        answerParagraphs.push(paragraphs[paragraphIndex]);
        paragraphIndex += 1;
      }

      elements.push(
        <section key={`quiz-${paragraphIndex}`} className="overflow-hidden rounded-2xl border border-leaf-200 bg-white shadow-soft">
          <div className="p-5 sm:p-7">
            <h2 className="display-serif text-xl font-bold leading-9 text-leaf-900 sm:text-2xl sm:leading-10">
              <InlineLinks text={question} />
            </h2>
            {options.length > 0 ? (
              <ol className="mt-5 grid list-none gap-3 p-0">
                {options.map((option) => (
                  <li key={option.label} className="flex min-w-0 items-start gap-3 rounded-xl border border-leaf-100 bg-leaf-50/60 px-4 py-3.5">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-leaf-700 text-sm font-black text-white">
                      {option.label}
                    </span>
                    <span className="min-w-0 pt-0.5 font-semibold leading-7 text-leaf-900">
                      <InlineLinks text={option.text} />
                    </span>
                  </li>
                ))}
              </ol>
            ) : null}
          </div>
          <details className="group border-t border-leaf-100 bg-leaf-50/35">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 font-bold text-leaf-800 transition hover:bg-leaf-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-leaf-600 sm:px-7 [&::-webkit-details-marker]:hidden">
              <span>答えを見る</span>
              <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full border border-leaf-200 bg-white text-xl leading-none transition-transform group-open:rotate-45">＋</span>
            </summary>
            <div className="space-y-4 border-t border-leaf-100 px-5 py-5 leading-8 text-leaf-900/82 sm:px-7 sm:py-6">
              {answerParagraphs.map((answerParagraph, answerIndex) => renderParagraph(answerParagraph, answerIndex))}
            </div>
          </details>
        </section>
      );
      continue;
    }

    elements.push(renderParagraph(paragraph, paragraphIndex));
    paragraphIndex += 1;
  }

  return elements;
}

type QuizOption = { label: string; text: string };

function parseQuizOptions(text: string): QuizOption[] {
  return Array.from(text.matchAll(/([A-Z])\.\s*(.*?)(?=\s+[A-Z]\.\s|$)/g), (match) => ({
    label: match[1],
    text: match[2].trim()
  }));
}

function renderParagraph(paragraph: string, key: number) {
  if (paragraph.startsWith("## ")) return <h2 key={key} className="display-serif pt-4 text-2xl font-bold leading-10 text-leaf-900"><InlineLinks text={paragraph.slice(3)} /></h2>;
  if (paragraph.startsWith("### ")) return <h3 key={key} className="text-lg font-bold leading-8 text-leaf-900"><InlineLinks text={paragraph.slice(4)} /></h3>;
  const image = paragraph.match(/^!\[([^\]]+)\]\((https:\/\/[^)\s]+)\)$/);
  if (image) {
    return (
      <figure key={key} className="overflow-hidden rounded-2xl border border-leaf-100 bg-white shadow-soft">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image[2]} alt={image[1]} loading="lazy" className="max-h-[42rem] w-full object-contain bg-leaf-50" />
        <figcaption className="border-t border-leaf-100 px-4 py-3 text-sm leading-6 text-leaf-900/65 sm:px-5">
          {image[1]}（けんゆーの熱帯果樹図鑑に登録された写真）
        </figcaption>
      </figure>
    );
  }
  return <p key={key} className="whitespace-pre-line"><InlineLinks text={paragraph} /></p>;
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
