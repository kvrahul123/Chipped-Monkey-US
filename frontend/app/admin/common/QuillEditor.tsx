'use client';

import React, { useEffect, useRef } from 'react';
import ReactQuill, { Quill } from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import Table from 'quill/modules/table';

// Register table module
Quill.register('modules/table', Table);

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link', 'image', 'video'],
    [{ color: [] }, { background: [] }],
    ['clean'],
    ['table'], // table button
  ],
  table: true,
};

const formats = [
  'header',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet',
  'link', 'image', 'video',
  'color', 'background',
  'table', 'table-row', 'table-cell', 'table-column',
];

interface Props {
  value: string;
  onChange: (val: string) => void;
}

const QuillEditor: React.FC<Props> = ({ value, onChange }) => {
  const quillRef = useRef<ReactQuill | null>(null);

  // ✅ Sync external value (Formik saved data) into editor
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.getEditor().root.innerHTML) {
      quillRef.current.getEditor().root.innerHTML = value || '';
    }
  }, [value]);

  return (
    <ReactQuill
      ref={quillRef}
      value={value}
      onChange={onChange}
      theme="snow"
      modules={modules}
      formats={formats}
      style={{ minHeight: '400px', height: '400px' }}
    />
  );
};

export default QuillEditor;
