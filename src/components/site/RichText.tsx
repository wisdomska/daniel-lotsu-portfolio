import { richSegments } from '@/lib/rich-text';

/** Renders CMS rich text: plain text with **bold** runs. Never parses HTML. */
export function RichText({ text, boldClassName }: { text: string; boldClassName?: string }) {
  return (
    <>
      {richSegments(text).map((s, i) =>
        s.bold ? (
          <strong key={i} className={boldClassName}>
            {s.text}
          </strong>
        ) : (
          <span key={i}>{s.text}</span>
        ),
      )}
    </>
  );
}
