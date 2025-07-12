import {
  GET_QUESTIONS,
  GET_QUESTION,
  ADD_QUESTION,
  QUESTION_ERROR,
  VOTE_QUESTION,
  ACCEPT_ANSWER
} from '../actions/types';

const initialState = {
  questions: [],
  question: null,
  loading: true,
  error: {}
};

export default function(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case GET_QUESTIONS:
      return {
        ...state,
        questions: payload,
        loading: false
      };
    case GET_QUESTION:
      return {
        ...state,
        question: payload,
        loading: false
      };
    case ADD_QUESTION:
      return {
        ...state,
        questions: [payload, ...state.questions],
        loading: false
      };
    case VOTE_QUESTION:
      return {
        ...state,
        questions: state.questions.map(q =>
          q._id === payload.id ? { ...q, votes: payload.votes, voters: payload.voters } : q
        ),
        question:
          state.question && state.question._id === payload.id
            ? { ...state.question, votes: payload.votes, voters: payload.voters }
            : state.question,
        loading: false
      };
    case ACCEPT_ANSWER:
      return {
        ...state,
        question: {
          ...state.question,
          acceptedAnswer: payload.acceptedAnswer
        },
        loading: false
      };
    case QUESTION_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
}