const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Question = require('../models/Question');
const Answer = require('../models/Answer');

// @route   POST api/answers
// @desc    Add an answer
router.post(
  '/',
  [
    auth,
    [
      check('content', 'Content is required').not().isEmpty(),
      check('question', 'Question ID is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const question = await Question.findById(req.body.question);
      if (!question) {
        return res.status(404).json({ msg: 'Question not found' });
      }

      const newAnswer = new Answer({
        content: req.body.content,
        question: req.body.question,
        author: req.user.id
      });

      const answer = await newAnswer.save();
      question.answers.push(answer._id);
      await question.save();

      res.json(answer);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   PUT api/answers/:id/vote
// @desc    Vote on an answer
router.put('/:id/vote', auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ msg: 'Answer not found' });
    }

    const { voteType } = req.body;
    const userId = req.user.id;

    // Check if user already voted
    const existingVoteIndex = answer.voters.findIndex(
      v => v.userId.toString() === userId
    );

    if (existingVoteIndex >= 0) {
      // User already voted - check if same vote type
      if (answer.voters[existingVoteIndex].vote === (voteType === 'upvote' ? 1 : -1)) {
        // Same vote - remove vote
        answer.votes -= answer.voters[existingVoteIndex].vote;
        answer.voters.splice(existingVoteIndex, 1);
      } else {
        // Different vote - update vote
        answer.votes += voteType === 'upvote' ? 2 : -2;
        answer.voters[existingVoteIndex].vote = voteType === 'upvote' ? 1 : -1;
      }
    } else {
      // New vote
      answer.votes += voteType === 'upvote' ? 1 : -1;
      answer.voters.push({
        userId,
        vote: voteType === 'upvote' ? 1 : -1
      });
    }

    await answer.save();
    res.json({ votes: answer.votes, voters: answer.voters });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;