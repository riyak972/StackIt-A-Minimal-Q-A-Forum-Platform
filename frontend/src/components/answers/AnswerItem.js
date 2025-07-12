import React from 'react';
import { Link } from 'react-router-dom';
import Moment from 'react-moment';
import { Button, Badge } from 'react-bootstrap';

const AnswerItem = ({ 
  answer, 
  questionAuthorId, 
  onVote, 
  onAccept, 
  isAccepted, 
  currentUserId 
}) => {
  const handleVote = (voteType) => {
    onVote(answer._id, voteType);
  };

  const handleAccept = () => {
    onAccept(answer._id);
  };

  const userVote = answer.voters.find(v => v.userId === currentUserId);

  return (
    <div className={`answer-item mb-4 p-3 ${isAccepted ? 'accepted-answer' : ''}`}>
      <div className="d-flex">
        <div className="vote-section text-center mr-3">
          <Button 
            variant="link" 
            onClick={() => handleVote('upvote')}
            disabled={!currentUserId}
          >
            <i className={`fas fa-chevron-up ${userVote?.vote === 1 ? 'text-primary' : ''}`}></i>
          </Button>
          <h4>{answer.votes}</h4>
          <Button 
            variant="link" 
            onClick={() => handleVote('downvote')}
            disabled={!currentUserId}
          >
            <i className={`fas fa-chevron-down ${userVote?.vote === -1 ? 'text-danger' : ''}`}></i>
          </Button>
          
          {questionAuthorId === currentUserId && (
            <Button 
              variant={isAccepted ? 'success' : 'outline-success'} 
              size="sm" 
              className="mt-2"
              onClick={handleAccept}
              disabled={isAccepted}
            >
              <i className="fas fa-check"></i>
            </Button>
          )}
        </div>
        
        <div className="flex-grow-1">
          <div className="answer-content" dangerouslySetInnerHTML={{ __html: answer.content }} />
          
          <div className="answer-meta mt-3 d-flex justify-content-between align-items-center">
            <div>
              <Link to={`/users/${answer.author._id}`}>
                {answer.author.username}
              </Link>
              <span className="text-muted ml-2">
                answered <Moment fromNow>{answer.createdAt}</Moment>
              </span>
            </div>
            
            {isAccepted && (
              <Badge pill variant="success">
                Accepted
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerItem;