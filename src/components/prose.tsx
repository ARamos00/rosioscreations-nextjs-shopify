import clsx from "clsx"; // Utility for conditionally joining CSS class names
import { FunctionComponent } from "react"; // Import the FunctionComponent type from React

// Define the props for the Prose component
interface TextProps {
  html: string; // HTML string to be rendered
  className?: string; // Optional additional class names
}

// Prose component renders styled HTML content using dangerouslySetInnerHTML
const Prose: FunctionComponent<TextProps> = ({ html, className }) => {
  return (
      <div
          // Combine default prose styling with any additional class names passed via props
          className={clsx(
              "prose mx-auto max-w-6xl text-base leading-7 text-black prose-headings:mt-8 prose-headings:font-semibold prose-headings:tracking-wide prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg prose-a:text-black prose-a:underline hover:prose-a:text-neutral-300 prose-strong:text-black prose-ol:mt-8 prose-ol:list-decimal prose-ol:pl-6 prose-ul:mt-8 prose-ul:list-disc prose-ul:pl-6 dark:text-white dark:prose-headings:text-white dark:prose-a:text-white dark:prose-strong:text-white",
              className
          )}
          // Set the inner HTML of the div with the provided HTML content.
          // Use caution with dangerouslySetInnerHTML to avoid potential XSS vulnerabilities.
          dangerouslySetInnerHTML={{ __html: html as string }}
      />
  );
};

export default Prose; // Export the Prose component
