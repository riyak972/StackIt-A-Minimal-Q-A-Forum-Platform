import {
  ADD_ANSWER,
  ANSWER_ERROR,
  VOTE_ANSWER
} from '../actions/types';

const initialState = {
  answers: [],
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case ADD_ANSWER:
      return {
        ...state,
        answers: [payload, ...state.answers],
        loading: false
      };
    case VOTE_ANSWER:
      return {
        ...state,
        answers: state.answers.map(answer =>
          answer._id === payload.answerId
            ? { ...answer, votes: payload.votes, voters: payload.voters }
            : answer
        ),
        loading: false
      };
    case ANSWER_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}