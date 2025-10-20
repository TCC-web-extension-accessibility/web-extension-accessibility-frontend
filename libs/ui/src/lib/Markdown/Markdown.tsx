import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

interface MarkdownProps {
  children: string;
  className?: string;
}

const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-xl font-semibold text-foreground mb-4 mt-6 first:mt-0">
      {children}
    </h3>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h4 className="text-lg font-semibold text-foreground mb-3 mt-6 first:mt-0">
      {children}
    </h4>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h5 className="text-base font-medium text-grey-700 mb-2 mt-4">
      {children}
    </h5>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-grey-700 mb-3 leading-relaxed">{children}</p>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => {
    const text = children?.toString() || '';
    if (text.includes('Prioridade:')) {
      const priority = text.replace('Prioridade:', '').trim();
      const colorClass =
        priority === 'Alta'
          ? 'bg-danger-100 text-danger-700'
          : priority === 'Média'
          ? 'bg-warn-100 text-warn-700'
          : 'bg-success-100 text-success-700';
      return (
        <span
          className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}
        >
          {priority} Prioridade
        </span>
      );
    }
    return (
      <strong className="font-semibold text-foreground">{children}</strong>
    );
  },
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="space-y-1 text-grey-600 text-sm">{children}</ul>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="flex items-start gap-2">
      <span className="text-primary-500 mt-1 flex-shrink-0">•</span>
      <span>{children}</span>
    </li>
  ),
  hr: () => <div className="border-t border-grey-200 my-8" />,
  code: ({
    inline,
    className,
    children,
    ...props
  }: {
    inline?: boolean;
    className?: string;
    children?: React.ReactNode;
  }) => {
    const match = /language-(\w+)/.exec(className || '');

    if (!inline && match) {
      return (
        <div className="my-4 rounded-lg overflow-hidden border border-grey-200">
          <SyntaxHighlighter
            style={vscDarkPlus}
            language={match[1]}
            PreTag="div"
            customStyle={{
              margin: 0,
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
            }}
            {...props}
          >
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      );
    }

    return (
      <code
        className="bg-grey-100 px-1.5 py-0.5 rounded text-sm font-mono text-grey-800"
        {...props}
      >
        {children}
      </code>
    );
  },
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="overflow-x-auto my-6 border border-grey-200 rounded-lg">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="bg-grey-50">{children}</thead>
  ),
  tbody: ({ children }: { children?: React.ReactNode }) => (
    <tbody className="divide-y divide-grey-200">{children}</tbody>
  ),
  tr: ({ children }: { children?: React.ReactNode }) => <tr>{children}</tr>,
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="px-4 py-3 font-semibold text-left text-foreground tracking-wider">
      {children}
    </th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="px-4 py-3 text-grey-700">{children}</td>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-4 border-primary-200 pl-4 py-2 my-4 bg-primary-50 text-grey-700 italic">
      {children}
    </blockquote>
  ),
  a: ({ children, href }: { children?: React.ReactNode; href?: string }) => (
    <a
      href={href}
      className="text-primary-600 hover:text-primary-700 underline transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
};

export function Markdown({ children, className = '' }: MarkdownProps) {
  return (
    <div
      className={`prose max-w-none prose-headings:text-foreground prose-strong:text-foreground ${className}`}
    >
      <ReactMarkdown
        components={markdownComponents}
        remarkPlugins={[remarkGfm]}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}

export default Markdown;
