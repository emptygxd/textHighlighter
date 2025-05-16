import { useState, type TextareaHTMLAttributes } from 'react';
import { Input } from 'antd';
import classNames from 'classnames';

import styles from './HighlightedTextarea.module.scss';

const { TextArea } = Input;

type Props = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const HighlightedTextarea = ({ className, style, ...rest }: Props) => {
  const [value, setValue] = useState('');

  const highlight = (text: string) => {
    let s = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const quotes: string[] = [];
    s = s.replace(
      /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g,
      (_: string, m: string) => {
        const ph = `__QUOTE_${quotes.length}__`;
        quotes.push(`<span class="${styles.value}">${m}</span>`);
        return ph;
      }
    );

    s = s.replace(
      /(^|[\s(])([A-Za-z_][A-Za-z0-9_]*)\s*(?==)/g,
      (_, pre, key) => `${pre}<span class="${styles.key}">${key}</span>`
    );

    s = s.replace(
      /\b(AND|OR|NOT)\b/g,
      '<span class="' + styles.op + '">$1</span>'
    );

    quotes.forEach((realHtml, i) => {
      s = s.replace(`__QUOTE_${i}__`, realHtml);
    });

    return s;
  };

  return (
    <div className={classNames(styles.container, className)} style={style}>
      <div
        className={styles.highlighter}
        dangerouslySetInnerHTML={{ __html: highlight(value) + '<br />' }}
      />

      <TextArea
        {...rest}
        className={styles.textarea}
        value={value}
        onChange={e => setValue(e.target.value)}
        autoSize
      />
    </div>
  );
};
