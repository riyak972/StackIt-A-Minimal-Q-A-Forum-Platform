import axios from 'axios';
import { setAlert } from './alert';
import {
  ADD_ANSWER,
  ANSWER_ERROR,
  VOTE_ANSWER
} from './types';

// Add answer
export const addAnswer = formData => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const res = await axios.post('/api/answers', formData, config);

    dispatch({
      type: ADD_ANSWER,
      payload: res.data
    });

    dispatch(setAlert('Answer Posted', 'success'));
  } catch (err) {
    dispatch({
      type: ANSWER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};

// Vote on answer
export const voteAnswer = (answerId, voteType) => async dispatch => {
  try {
    const res = await axios.put(`/api/answers/${answerId}/vote`, { voteType });
    dispatch({
      type: VOTE_ANSWER,
      payload: { answerId, votes: res.data.votes, voters: res.data.voters }
    });
  } catch (err) {
    dispatch({
      type: ANSWER_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status }
    });
  }
};