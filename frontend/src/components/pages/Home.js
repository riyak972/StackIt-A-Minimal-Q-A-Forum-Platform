import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getQuestions } from '../../actions/question';
import { Card, Button, Spinner, Badge } from 'react-bootstrap';
import Moment from 'react-moment';

const Home = () => {
  const dispatch = useDispatch();
  const { questions, loading } = useSelector(state => state.question);
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    dispatch(getQuestions());
  }, [dispatch]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="home-page">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Top Questions</h1>
        {auth.isAuthenticated && (
          <Link to="/ask">
            <Button variant="primary">Ask Question</Button>
          </Link>
        )}
      </div>

      {questions.length === 0 ? (
        <p>No questions yet. Be the first to ask!</p>
      ) : (
        questions.map(question => (
          <Card key={question._id} className="mb-3">
            <Card.Body>
              <div className="d-flex">
                <div className="vote-section text-center mr-3">
                  <div className="votes-count">{question.votes}</div>
                  <small>votes</small>
                </div>
                <div className="flex-grow-1">
                  <Card.Title>
                    <Link to={`/questions/${question._id}`}>{question.title}</Link>
                  </Card.Title>
                  <Card.Text className="text-muted">
                    {question.description.length > 150
                      ? `${question.description.substring(0, 150)}...`
                      : question.description}
                  </Card.Text>
                  <div className="d-flex justify-content-between">
                    <div className="tags">
                      {question.tags.map(tag => (
                        <Badge key={tag} pill variant="primary" className="mr-2">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="text-muted small">
                      asked <Moment fromNow>{question.createdAt}</Moment> by {question.author.username}
                    </div>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default Home;