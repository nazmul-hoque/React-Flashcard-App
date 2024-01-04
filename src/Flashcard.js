import React, { useState, useEffect, useRef, useCallback } from 'react';

export default function Flashcard({ flashcard }) {
  const [flip, setFlip] = useState(false);
  const [height, setHeight] = useState('initial');

  const frontEl = useRef();
  const backEl = useRef();

  const flipHandler = useCallback(() => setFlip((prevFlip) => !prevFlip), []);

  const { question, answer, options } = flashcard;

  function setMaxHeight() {
    const frontHeight = frontEl.current.getBoundingClientRect().height;
    const backHeight = backEl.current.getBoundingClientRect().height;
    setHeight(Math.max(frontHeight, backHeight, 100));
  }

  useEffect(setMaxHeight, [question, answer, options]);
  useEffect(() => {
    window.addEventListener('resize', setMaxHeight);
    return () => window.removeEventListener('resize', setMaxHeight);
  }, []);

  return (
    <div
      className={`card ${flip ? 'flip' : ''}`}
      style={{ height }}
      onClick={flipHandler}
    >
      <div className="front" ref={frontEl}>
        {question}
        <div className="flashcard-options">
          {options.map((option) => (
            <div className="flashcard-option" key={option}>
              {option}
            </div>
          ))}
        </div>
      </div>
      <div className="back" ref={backEl}>
        {answer}
      </div>
    </div>
  );
}
