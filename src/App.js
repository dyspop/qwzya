import React, { useState, useEffect } from 'react';
import axios from 'axios';

const randomChoice = (arr) => {
  return arr[Math.floor(arr.length * Math.random())];
}

const decodeHTML = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const TriviaGame = () => {
  // Initialize state variables for the game
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showingAnswer, setShowingAnswer] = useState(false);

  // Fetch a set of questions from the Open Trivia DB API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple'
        );
        setQuestions(response.data.results);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  // Render the game UI
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>An error occurred: {error.message}</p>;
  }
  if (currentQuestionIndex >= questions.length) {
    return (
      <div>
        <p>Game over! Your score is: {score}</p>
        <button
          onClick={() => {
            setCurrentQuestionIndex(0);
            setScore(0);
            setIncorrectCount(0);
            setShowingAnswer(false);
          }}
        >
          Restart
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const decodedQuestion = decodeHTML(currentQuestion.question);

  // Handle the player selecting an answer
  const handleAnswer = (selectedAnswer) => {
    setShowingAnswer(true);
    if (selectedAnswer === currentQuestion.correct_answer) {
      setScore(score + 1);
    } else {
      setIncorrectCount(incorrectCount + 1);
    }
    setTimeout(() => {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowingAnswer(false);
    }, 1000);
  };

  return (
    <div>
      <p>{decodedQuestion}</p>
      {console.log(currentQuestion)}
      <ul>
        {currentQuestion.incorrect_answers.map((answer, index) => (
          <li key={index}>
            <button
              onClick={() => {
                handleAnswer(decodeHTML(answer));
              }}
              style={
                showingAnswer && answer !== currentQuestion.correct_answer
                  ? { backgroundColor: 'red' }
                  : {}
              }
            >
              {decodeHTML(answer)}
            </button>
          </li>
        ))}
        <li>
          <button
            onClick={() => {
              handleAnswer(decodeHTML(currentQuestion.correct_answer));
            }}
            style={
              showingAnswer &&
              decodeHTML(currentQuestion.correct_answer) === currentQuestion.correct_answer
                ? { backgroundColor: 'green' }
                : {}
            }
          >
            {decodeHTML(currentQuestion.correct_answer)}
          </button>
        </li>
      </ul>
      <p>
        Correct: {score} Incorrect: {incorrectCount}
      </p>
    </div>
  );
};

export default TriviaGame;
