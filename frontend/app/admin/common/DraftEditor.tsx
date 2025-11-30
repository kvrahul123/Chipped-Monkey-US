"use client";

import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import {
  EditorState,
  convertToRaw,
  ContentState,
  convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

interface DraftEditorProps {
  value: string; // HTML string
  onChange: (content: string) => void;
}

const DraftEditor: React.FC<DraftEditorProps> = ({ value, onChange }) => {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  // ✅ Only sync when value changes from outside (Formik → Editor)
  useEffect(() => {
    if (!value) return;

    const blocksFromHTML = convertFromHTML(value);
    const content = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );

    const newState = EditorState.createWithContent(content);

    // avoid resetting if already same
    if (editorState.getCurrentContent() !== newState.getCurrentContent()) {
      setEditorState(newState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // Editor → Formik
  const handleChange = (state: EditorState) => {
    setEditorState(state);

    const raw = convertToRaw(state.getCurrentContent());
    const html = draftToHtml(raw);

    // ✅ update only if changed
    if (html !== value) {
      onChange(html);
    }
  };

  return (
    <div className="border rounded-md min-h-[300px] p-2">
      <Editor
        editorState={editorState}
        onEditorStateChange={handleChange}
        toolbar={{
          options: ["inline", "blockType", "list", "link", "history"],
          inline: { options: ["bold", "italic", "underline"] },
        }}
      />
    </div>
  );
};

export default DraftEditor;
