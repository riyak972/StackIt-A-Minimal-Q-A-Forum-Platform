import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getQuestion, voteQuestion, acceptAnswer } from '../../actions/question';
import { addAnswer, voteAnswer } from '../../actions/answer';
import { createNotification } from '../../actions/notification';
import RichTextEditor from '../editor/RichTextEditor';
import AnswerItem from '../answers/AnswerItem';
import Moment from 'react-moment';
import { Button, Card, Badge, Spinner, Form } from 'react-bootstrap';

const Question = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { question, loading } = useSelector(state => state.question);
  const auth = useSelector(state => state.auth);
  const [answerContent, setAnswerContent] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    dispatch(getQuestion(id));
  }, [dispatch, id]);

  const handleVote = (voteType) => {
    if (!auth.isAuthenticated) {
      return;
    }
    dispatch(voteQuestion(id, voteType));
  };

  const handleAnswerVote = (answerId, voteType) => {
    if (!auth.isAuthenticated) {
      return;
    }
    dispatch(voteAnswer(answerId, voteType));
  };

  const handleAcceptAnswer = (answerId) => {
    dispatch(acceptAnswer(id, answerId));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);
    
    try {
      const answer = {
        content: answerContent,
        question: id
      };
      
      await dispatch(addAnswer(answer));
      
      // Create notification for question author
      if (question.author._id !== auth.user._id) {
        const notification = {
          recipient: question.author._id,
          sender: auth.user._id,
          question: id,
          type: 'answer',
          message: `${auth.user.username} answered your question: "${question.title}"`
        };
        dispatch(createNotification(notification));
      }
      
      setAnswerContent('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (loading || !question) {
    return <Spinner animation="border" />;
  }

  return (
    <div className="question-page">
      <Card className="mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h1>{question.title}</h1>
            <div>
              <Link to="/ask">
                <Button variant="primary">Ask Question</Button>
              </Link>
            </div>
          </div>
          
          <div className="d-flex mb-3">
            <div className="vote-section text-center mr-3">
              <Button 
                variant="link" 
                onClick={() => handleVote('upvote')}
                disabled={!auth.isAuthenticated}
              >
                <i className={`fas fa-chevron-up ${question.voters.find(v => v.userId === auth.user?._id && v.vote === 1) ? 'text-primary' : ''}`}></i>
              </Button>
              <h4>{question.votes}</h4>
              <Button 
                variant="link" 
                onClick={() => handleVote('downvote')}
                disabled={!auth.isAuthenticated}
              >
                <i className={`fas fa-chevron-down ${question.voters.find(v => v.userId === auth.user?._id && v.vote === -1) ? 'text-danger' : ''}`}></i>
              </Button>
            </div>
            
            <div className="flex-grow-1">
              <div className="question-content" dangerouslySetInnerHTML={{ __html: question.description }} />
              
              <div className="tags-section mt-3">
                {question.tags.map(tag => (
                  <Badge key={tag} pill variant="primary" className="mr-2">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <div className="question-meta mt-4 d-flex justify-content-between">
                <div>
                  <Link to={`/users/${question.author._id}`}>
                    {question.author.username}
                  </Link>
                  <span className="text-muted ml-2">
                    asked <Moment fromNow>{question.createdAt}</Moment>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>
      
      <h3 className="mb-3">{question.answers.length} Answers</h3>
      
      {question.answers.map(answer => (
        <AnswerItem 
          key={answer._id} 
          answer={answer} 
          questionAuthorId={question.author._id}
          onVote={handleAnswerVote}
          onAccept={handleAcceptAnswer}
          isAccepted={question.acceptedAnswer === answer._id}
          currentUserId={auth.user?._id}
        />
      ))}
      
      {auth.isAuthenticated ? (
        <Card className="mt-4">
          <Card.Body>
            <h4>Your Answer</h4>
            <Form onSubmit={onSubmit}>
              <RichTextEditor 
                content={answerContent} 
                setContent={setAnswerContent} 
              />
              <Button 
                type="submit" 
                variant="primary" 
                className="mt-3"
                disabled={!answerContent || loadingSubmit}
              >
                {loadingSubmit ? 'Posting...' : 'Post Answer'}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <div className="mt-4 text-center">
          <Link to="/login" className="btn btn-primary">
            Login to post an answer
          </Link>
        </div>
      )}
    </div>
  );
};

export default Question;