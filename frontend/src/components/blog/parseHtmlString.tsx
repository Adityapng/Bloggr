import React from "react";
import Image from "next/image";
import { TiptapDocument, Block, InlineContent } from "@/lib/tiptap-types";

const styleMap: Record<string, string> = {
  doc: "text-gray-800 dark:text-gray-200",
  heading_1: "text-4xl font-bold my-6",
  heading_2: "text-3xl font-bold my-6 pt-6 pb-2",
  heading_3: "text-2xl font-bold my-4",
  heading_4: "text-xl font-bold my-3",
  paragraph: "my-4 leading-relaxed",
  bulletList: "list-disc list-inside space-y-2 my-4 pl-4",
  orderedList: "list-decimal list-inside space-y-2 my-4 pl-4",
  listItem: "my-1",
  blockquote:
    "border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic my-6",
  codeBlock:
    "bg-gray-900 text-white rounded-lg p-4 my-6 overflow-x-auto font-mono text-sm",
  image: "my-6 relative flex justify-center max-h-[468px] ",
  bold: "font-bold",
  italic: "italic",
  underline: "underline",
  strike: "line-through",
  code: "bg-gray-200 dark:bg-gray-800 rounded px-1 font-mono text-sm",
  link: "text-blue-500 hover:underline cursor-pointer",
  highlight: "bg-yellow-200 dark:bg-yellow-800 px-1 rounded",
};

const renderInlineContent = (
  inline: InlineContent,
  index: number
): JSX.Element => {
  let element: JSX.Element = <>{inline.text}</>;

  if (inline.marks) {
    [...inline.marks].reverse().forEach((mark) => {
      const className = styleMap[mark.type] || "";
      switch (mark.type) {
        case "bold":
          element = <strong className={className}>{element}</strong>;
          break;
        case "italic":
          element = <em className={className}>{element}</em>;
          break;
        case "link":
          const href =
            typeof mark.attrs?.href === "string" ? mark.attrs.href : "#";
          element = (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={className}
            >
              {element}
            </a>
          );
          break;
        default:
          element = <span className={className}>{element}</span>;
          break;
      }
    });
  }
  return <React.Fragment key={index}>{element}</React.Fragment>;
};

const renderBlock = (block: Block, index: number): JSX.Element | null => {
  const key = `${block.type}-${index}`;
  const textAlign =
    typeof block.attrs?.textAlign === "string"
      ? `text-${block.attrs.textAlign}`
      : "";

  switch (block.type) {
    case "heading":
      const level =
        typeof block.attrs?.level === "number" ? block.attrs.level : 1;
      const headingClassName = `${
        styleMap[`heading_${level}`] || ""
      } ${textAlign}`;
      const headingContent = block.content?.map((inline, idx) =>
        renderInlineContent(inline as InlineContent, idx)
      );
      if (level === 1)
        return (
          <h1 key={key} className={headingClassName}>
            {headingContent}
          </h1>
        );
      if (level === 2)
        return (
          <h2 key={key} className={headingClassName}>
            {headingContent}
          </h2>
        );
      if (level === 3)
        return (
          <h3 key={key} className={headingClassName}>
            {headingContent}
          </h3>
        );
      return (
        <h4 key={key} className={headingClassName}>
          {headingContent}
        </h4>
      );

    case "paragraph":
      return (
        <p key={key} className={`${styleMap.paragraph} ${textAlign} `}>
          {block.content?.map((inline, idx) =>
            renderInlineContent(inline as InlineContent, idx)
          ) || <br />}
        </p>
      );

    case "bulletList":
      return (
        <ul key={key} className={styleMap.bulletList}>
          {block.content?.map((item, idx) => renderBlock(item as Block, idx))}
        </ul>
      );

    case "orderedList":
      return (
        <ol key={key} className={styleMap.orderedList}>
          {block.content?.map((item, idx) => renderBlock(item as Block, idx))}
        </ol>
      );

    case "listItem":
      return (
        <li key={key} className={styleMap.listItem}>
          {block.content?.map((item, idx) => {
            if ((item as Block).type === "paragraph") {
              return (item as Block).content?.map((inline, inlineIdx) =>
                renderInlineContent(inline as InlineContent, inlineIdx)
              );
            }
            return renderBlock(item as Block, idx);
          })}
        </li>
      );

    case "blockquote":
      return (
        <blockquote key={key} className={styleMap.blockquote}>
          {block.content?.map((item, idx) => renderBlock(item as Block, idx))}
        </blockquote>
      );

    case "codeBlock":
      return (
        <pre key={key} className={styleMap.codeBlock}>
          <code>
            {block.content?.map((inline, idx) =>
              renderInlineContent(inline as InlineContent, idx)
            )}
          </code>
        </pre>
      );

    case "image":
      const src = typeof block.attrs?.src === "string" ? block.attrs.src : "";
      if (!src) return null;
      const alt =
        typeof block.attrs?.alt === "string"
          ? block.attrs.alt
          : "Blog post image";
      return (
        <figure key={key} className={styleMap.image}>
          <Image
            src={src}
            alt={alt}
            width={800}
            height={450}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-lg object-cover object-center"
          />
        </figure>
      );

    default:
      return null;
  }
};

interface TiptapRendererProps {
  content: string;
}

export default function TiptapRenderer({ content }: TiptapRendererProps) {
  try {
    const json: TiptapDocument = JSON.parse(content);
    if (!json || json.type !== "doc" || !Array.isArray(json.content)) {
      throw new Error("Invalid Tiptap content");
    }

    return (
      <div className={styleMap.doc}>
        {json.content.map((block, index) => renderBlock(block, index))}
      </div>
    );
  } catch (error) {
    console.error("Failed to render Tiptap content:", error);
    return <p className="text-red-500">Error rendering content.</p>;
  }
}
