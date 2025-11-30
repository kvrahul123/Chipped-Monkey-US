"use client";
import React, { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    CKEDITOR: any;
  }
}

interface Props {
  value: string;
  onChange: (val: string) => void;
}

const DynamicCkEditor: React.FC<Props> = ({ value, onChange }) => {
  const editorRef = useRef<any>(null);
  const [editorId] = useState(
    () => `ckeditor-${Math.random().toString(36).substr(2, 9)}`
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const didInitRef = useRef(false);

  useEffect(() => {
    if (!window.CKEDITOR) {
      const script = document.createElement("script");
script.src = "https://cdn.ckeditor.com/4.22.1/full-all/ckeditor.js";
      script.onload = () => setIsLoaded(true);
      document.body.appendChild(script);
    } else {
      setIsLoaded(true);
    }
  }, []);

 useEffect(() => {
  if (isLoaded && !editorRef.current && window.CKEDITOR) {
const instance = window.CKEDITOR.replace(editorId, {
  height: 400,
  allowedContent: true, // ⚡ allows everything
   autoParagraph: false,
  extraAllowedContent: `
    div(*){*}[*];
    h1,h2,h3,h4,h5,h6(*){*}[*];
    p(*){*}[*];
    table(*){*}[*];
    thead(*){*}[*];
    tbody(*){*}[*];
    tfoot(*){*}[*];
    tr(*){*}[*];
    th(*){*}[*];
    td(*){*}[*];
    ul,ol,li(*){*}[*];
    span(*){*}[*];
    *[*]{*}(*);
  `,
});


    editorRef.current = instance;

    instance.on("instanceReady", () => {
      if (value) {
        instance.setData(value);
      }
      didInitRef.current = true;
    });

    instance.on("change", () => {
      const data = instance.getData();
      onChange(data);
    });
  }
}, [isLoaded, editorId, onChange]);


  // 🔑 if Formik gives a new value (like on Edit), update editor
  useEffect(() => {
    if (
      editorRef.current &&
      didInitRef.current && // only after init
      value &&
      value !== editorRef.current.getData()
    ) {
      editorRef.current.setData(value);
    }
  }, [value]);

  return <textarea id={editorId} />;
};

export default DynamicCkEditor;
