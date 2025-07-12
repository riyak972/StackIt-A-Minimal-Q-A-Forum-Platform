import React, { useState, useRef } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { ImageResize } from 'quill-image-resize-module-ts';
import Quill from 'quill';
import { uploadImage } from '../../actions/question';
import { useDispatch } from 'react-redux';

Quill.register('modules/imageResize', ImageResize);

const RichTextEditor = ({ content, setContent }) => {
  const quillRef = useRef(null);
  const dispatch = useDispatch();

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image', 'video'],
      [{ 'align': [] }],
      ['clean'],
      ['emoji']
    ],
    imageResize: {
      parchment: Quill.import('parchment'),
      modules: ['Resize', 'DisplaySize']
    },
    'emoji-toolbar': true,
    'emoji-textarea': false,
    'emoji-shortname': true
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet',
    'link', 'image', 'video',
    'align',
    'emoji'
  ];

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (!file) return;

      try {
        const formData = new FormData();
        formData.append('image', file);
        
        const imageUrl = await dispatch(uploadImage(formData));
        const quill = quillRef.current.getEditor();
        const range = quill.getSelection();
        quill.insertEmbed(range.index, 'image', imageUrl);
      } catch (err) {
        console.error(err);
      }
    };
  };

  return (
    <div className="rich-text-editor">
      <ReactQuill
        ref={quillRef}
        value={content}
        onChange={setContent}
        modules={{
          ...modules,
          toolbar: {
            ...modules.toolbar,
            handlers: { image: handleImageUpload }
          }
        }}
        formats={formats}
        placeholder="Write your content here..."
      />
    </div>
  );
};

export default RichTextEditor;