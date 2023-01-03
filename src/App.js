import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';

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
  const [refresh, setRefresh] = useState(false);
  const [showingAnswer, setShowingAnswer] = useState(false);
  const [correctAnswerInsertionIndex, setCorrectAnswerInsertionIndex] = useState(0);
  const [quizLength, setQuizLength] = useState(10);
  const [difficulty, setDifficulty] = useState('easy');

  // Generate the URL for the Twitter web intent for creating a new tweet
  const tweetUrl = encodeURI(
    `https://twitter.com/intent/tweet?url=https://qwzya.com&text=I just scored ${Math.round(score / quizLength * 100)}% in the ${difficulty} Trivia Game on Qwzya! Can you beat me?&hashtags=games,trivia,quiz,quizzes,qwzya`
  );

  // Fetch a set of questions from the Open Trivia DB API
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          `https://opentdb.com/api.php?amount=${quizLength}&category=9&difficulty=${difficulty}&type=multiple`
        );
        setQuestions(response.data.results);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [refresh]);

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


      <Card className='shadow-lg col-12 col-md-9 col-lg-6 m-auto'>
        <Card.Body>
          <Card.Title className='text-capitalize border-bottom pb-3 fs-6'>Game over!</Card.Title>
          <Card.Text className='fs-2'>
            Your score is: {Math.round(score / quizLength * 100)}%


          </Card.Text>
          <Card.Text className='border-bottom mb-4 pb-4'>
            <a href={tweetUrl} target="_blank" rel="noopener noreferrer"
              className='btn btn-primary me-2'
            >
              Tweet Score
            </a>
          </Card.Text>

          <Card.Text>
            <Form.Group controlId="formBasicSelect" className='m-auto'>
              <Form.Label className='fs-6 w-25'>Difficulty</Form.Label>
              <Form.Select
                className='w-auto m-auto'
                value={difficulty}
                onChange={(e: any) => setDifficulty(e.currentTarget.value)}
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </Form.Select>
            </Form.Group>
          </Card.Text>

        </Card.Body>
        <Card.Footer className='d-grid'>
          <Button
            variant="secondary"
            className='btn btn-secondary fw-bold btn-lg'
            onClick={() => {
              setCurrentQuestionIndex(0);
              setScore(0);
              setIncorrectCount(0);
              setShowingAnswer(false);
              setRefresh(true);
            }}
          >
            Go again!
          </Button>
        </Card.Footer>
      </Card>



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
    <div className='fs-4'>
      <p className='p-8'></p>

      <div class="container">

        <div className='row mb-4'>
          <Card className='shadow-lg col-12 col-md-9 col-lg-6 m-auto'>
            <Card.Body>
              <Card.Title className='text-capitalize border-bottom pb-3 fs-6'>{difficulty} Quiz</Card.Title>
              <Card.Text>
                {decodedQuestion}
              </Card.Text>
              <div class="row gap-2">
                {currentQuestion.incorrect_answers.map((answer, index) => (
                  <>
                    {index === correctAnswerInsertionIndex &&
                      <Button variant="secondary"
                        className='col-sm'
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
                      </Button>
                    }
                    <Button variant="secondary"
                      className='col-sm'
                      key={index}
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
                    </Button>
                  </>
                ))}
              </div>
            </Card.Body>
          </Card>
        </div>


      </div>

      {/* <div className="d-grid gap-2 grid-cols cols-2">
        {currentQuestion.incorrect_answers.map((answer, index) => (
          <>
            {index === correctAnswerInsertionIndex &&
              <Button variant="secondary"
                className='col-1'
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
              </Button>
            }
            <Button variant="secondary"
              className='col-1'
              key={index}
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
            </Button>
          </>
        ))}

      </div> */}
      <p>
        Correct: {score} Incorrect: {incorrectCount}
      </p>
    </div>
  );
};

const App = () => {

  const [gameStarted, setGameStarted] = useState(false);


  return (
    <div className='container container-xxl text-center p-4'>
      <img src={logo} alt="Qwzya" className='logo mb-4' width="20%" />
      <p>Fun trivia games for free! Compare with friends on social media!</p>
      <hr />
      { gameStarted ? <TriviaGame /> : 
        <>Pick a game category and difficulty to start!</>
      }
      
    </div>
  )
}

export default App;
