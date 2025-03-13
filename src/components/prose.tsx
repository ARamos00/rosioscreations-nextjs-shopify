import clsx from "clsx";
import { FunctionComponent } from "react";

interface TextProps {
    html: string;
    className?: string;
}

const Prose: FunctionComponent<TextProps> = ({ html, className }) => {
    return (
        <div
            className={clsx(
                "prose mx-auto max-w-6xl text-base leading-7 text-primary " +
                "prose-headings:mt-8 prose-headings:font-semibold prose-headings:tracking-wide prose-headings:text-primary " +
                "prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg " +
                "prose-a:text-primary prose-a:underline hover:prose-a:text-primary " +
                "prose-strong:text-primary " +
                "prose-ol:mt-8 prose-ol:list-decimal prose-ol:pl-6 " +
                "prose-ul:mt-8 prose-ul:list-disc prose-ul:pl-6 " +
                "dark:text-primary dark:prose-headings:text-primary dark:prose-a:text-primary dark:prose-strong:text-primary",
                className
            )}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
};

export default Prose;
