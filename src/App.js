import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';


const randomInteger = (i) => {
  return Math.floor(i * Math.random());
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
  const [correctAnswerInsertionIndex, setCorrectAnswerInsertionIndex] = useState(0);
  const [quizLength, setQuizLength] = useState(1);

  // Generate the URL for the Twitter web intent for creating a new tweet
  const tweetUrl = encodeURI(
    `https://twitter.com/intent/tweet?url=https://qwzya.com&text=I just scored ${Math.round(score/quizLength)*100}% in the Trivia Game on Qwzya! Can you beat me? #trivia #game #qwzya`
  );

  // Fetch a set of questions from the Open Trivia DB API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `https://opentdb.com/api.php?amount=${quizLength}&category=9&difficulty=easy&type=multiple`
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

  // Assuming there are always four choices we can randomly get an index to put the answer at so that it's not always in the same place and therefore easily guessed
  useEffect(() => {
    setCorrectAnswerInsertionIndex(Math.floor(3 * Math.random()));
  }, [currentQuestionIndex])

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
        <a href={tweetUrl} target="_blank" rel="noopener noreferrer">
          Tweet Score
        </a>
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
      <ul>
        
        {currentQuestion.incorrect_answers.map((answer, index) => (
          <>
            {index === correctAnswerInsertionIndex && 
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
            }
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
          </>
        ))}
        
      </ul>
      <p>
        Correct: {score} Incorrect: {incorrectCount}
      </p>
    </div>
  );
};

const App = () => {
  return (
    <>
      <img src={logo} alt="Qwzya" />
      <p>What do you know?</p>
      <TriviaGame />
    </>
  )
}

export default App;
