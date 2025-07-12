import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { addQuestion } from '../../actions/question';
import RichTextEditor from '../editor/RichTextEditor';
import { Form, Button, Spinner, Card } from 'react-bootstrap';

const AskQuestion = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { isAuthenticated } = useSelector(state => state.auth);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);

  const { title, description, tags } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onEditorChange = value => {
    setFormData({ ...formData, description: value });
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...tags, tagInput.trim()] });
      setTagInput('');
    }
  };

  const removeTag = tagToRemove => {
    setFormData({
      ...formData,
      tags: tags.filter(tag => tag !== tagToRemove)
    });
  };

  const onSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await dispatch(addQuestion(formData, history));
    setLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center mt-5">
        <h3>Please login to ask a question</h3>
      </div>
    );
  }

  return (
    <Card className="mt-4">
      <Card.Body>
        <h2>Ask a Question</h2>
        <Form onSubmit={onSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={title}
              onChange={onChange}
              placeholder="What's your question?"
              required
            />
            <Form.Text className="text-muted">
              Be specific and imagine you're asking a question to another person
            </Form.Text>
          </Form.Group>

          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <RichTextEditor content={description} setContent={onEditorChange} />
          </Form.Group>

          <Form.Group controlId="tags">
            <Form.Label>Tags</Form.Label>
            <div className="d-flex mb-2">
              <Form.Control
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                placeholder="Add tags (e.g. react, javascript)"
              />
              <Button variant="outline-primary" className="ml-2" onClick={addTag} type="button">
                Add
              </Button>
            </div>
            <div className="tags-container">
              {tags.map(tag => (
                <span key={tag} className="tag-badge">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>×</button>
                </span>
              ))}
            </div>
            <Form.Text className="text-muted">
              Add up to 5 tags to describe what your question is about
            </Form.Text>
          </Form.Group>

          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : 'Post Your Question'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default AskQuestion;