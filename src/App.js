import React, { useState, useEffect, useRef } from 'react';
import FlashcardList from './FlashcardList';
import './App.css'
import axios from 'axios'


function App() {
  const [flashcards, setFlashcards] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const categoryEl = useRef();
  const amountEl = useRef();

  useEffect(() => {
    axios
      .get('https://opentdb.com/api_category.php')
      .then(res => {
        setCategories(res.data.trivia_categories);
      })
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  function decodeString(str) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = str;
    return textArea.value;
  }

  function handleApiCall(amount, category) {
    axios
      .get('https://opentdb.com/api.php', {
        params: {
          amount,
          category
        }
      })
      .then(res => {
        setFlashcards(res.data.results.map((questionItem, index) => {
          const answer = decodeString(questionItem.correct_answer);
          const options = [
            ...questionItem.incorrect_answers.map(a => decodeString(a)),
            answer
          ];
          return {
            id: `${index}-${Date.now()}`,
            question: decodeString(questionItem.question),
            answer,
            options: options.sort(() => Math.random() - 0.5)
          };
        }));
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        // Handle the error, e.g., set an error state to display to the user
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    handleApiCall(amountEl.current.value, categoryEl.current.value);
  }

  return (
    <>
      <form className="header" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" ref={categoryEl}>
            {categories.map(category => {
              return <option value={category.id} key={category.id}>{category.name}</option>
            })}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="amount">Number of Questions</label>
          <input type="number" id="amount" min="1" step="1" defaultValue={10} ref={amountEl} />
        </div>
        <div className="form-group">
          <button className="btn" disabled={loading}>
            {loading ? 'Generating...' : 'Generate'}
          </button>
        </div>
      </form>
      <div className="container">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <FlashcardList flashcards={flashcards} />
        )}
      </div>
    </>

  );
}

export default App;
