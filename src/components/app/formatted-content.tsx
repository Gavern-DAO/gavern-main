import React from "react";
import { cn } from "@/lib/utils";

interface FormattedContentProps {
    content: string;
    className?: string;
}

/**
 * A component that safely renders description content.
 * It detects if the content contains HTML tags and renders accordingly.
 * If no tags are found, it applies fallback logic for plain text (linkification, bullets).
 */
export function FormattedContent({ content, className }: FormattedContentProps) {
    if (!content) return null;

    // Simple heuristic to detect HTML tags
    const hasHtml = /<[a-z][\s\S]*>/i.test(content);

    if (hasHtml) {
        return (
            <div
                className={cn("formatted-html-content", className)}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        );
    }

    // Fallback for plain text parsing (original logic)
    return (
        <div className={cn("formatted-text-content whitespace-pre-wrap", className)}>
            {parsePlainText(content)}
        </div>
    );
}

/**
 * Internal helper to handle plain text formatting (links and bullet points)
 */
function parsePlainText(text: string) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.split("\n").map((line, idx) => {
        const trimmedLine = line.trim();
        if (!trimmedLine) return <br key={idx} />;

        // Detect bullet points
        const isBullet = /^[•*-]\s+/.test(trimmedLine);
        const content = trimmedLine.split(urlRegex).map((part, i) => {
            if (part.match(urlRegex)) {
                return (
                    <a
                        key={i}
                        href={part}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#3B82F6] hover:underline break-all"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {part}
                    </a>
                );
            }
            return part;
        });

        if (isBullet) {
            return (
                <li key={idx} className="ml-4 list-disc mb-1">
                    {content}
                </li>
            );
        }

        return (
            <p key={idx} className={idx === 0 ? "font-bold mb-2 text-[#101828] dark:text-[#EDEDED]" : "mb-2"}>
                {content}
            </p>
        );
    });
}
