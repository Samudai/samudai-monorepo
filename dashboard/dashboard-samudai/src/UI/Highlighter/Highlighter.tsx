import React from 'react';
import { splitter } from './deps/splitter';
import './Highlighter.scss';

interface HighlighterProps {
    highlightClass?: string;
    text: string | null;
    search: string | RegExp;
}

const Highlighter: React.FC<HighlighterProps> = ({ text, search, highlightClass }) => {
    const { partials, highlight } = splitter(text || '', search);

    console.log(partials, highlight);

    return (
        <React.Fragment>
            {highlight && partials
                ? partials.map((part, id) => (
                      <React.Fragment key={id}>
                          {part}
                          {highlight[id] && <span className={highlightClass}>{highlight[id]}</span>}
                      </React.Fragment>
                  ))
                : text}
        </React.Fragment>
    );
};

export default Highlighter;
