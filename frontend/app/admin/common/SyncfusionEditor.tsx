"use client";

import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-buttons/styles/material.css";
import "@syncfusion/ej2-dropdowns/styles/material.css";
import "@syncfusion/ej2-inputs/styles/material.css";
import "@syncfusion/ej2-navigations/styles/material.css";
import "@syncfusion/ej2-popups/styles/material.css";
import "@syncfusion/ej2-splitbuttons/styles/material.css";
import "@syncfusion/ej2-richtexteditor/styles/material.css";

import React from "react";
import {
  RichTextEditorComponent,
  Inject,
  HtmlEditor,
  Toolbar,
  Link,
  Image,
  Table,
  QuickToolbar,
  ChangeEventArgs,
} from "@syncfusion/ej2-react-richtexteditor";

interface Props {
  value?: string;
  onChange?: (content: string) => void;
}

const SyncfusionEditor: React.FC<Props> = ({ value = "Welcome", onChange }) => {
  const handleChange = (args: ChangeEventArgs) => {
    if (onChange) {
      onChange(args.value as string); // gives raw HTML
    }
  };

  return (
    <RichTextEditorComponent
      value={value}
      change={handleChange}
      height={500}
      enableHtmlSanitizer={false} // ✅ official way to allow raw HTML
      editorMode="HTML"
      toolbarSettings={{
        items: [
          "Bold",
          "Italic",
          "Underline",
          "StrikeThrough",
          "|",
          "Formats",
          "Alignments",
          "OrderedList",
          "UnorderedList",
          "|",
          "CreateTable",
          "CreateLink",
          "Image",
          "|",
          "SourceCode",
          "FullScreen",
        ],
      }}
      pasteCleanupSettings={{
        prompt: false,
        plainText: false,
        keepFormat: true,
        deniedTags: [],
        allowedStyleProps: null,
      }}
    >
      <Inject
        services={[HtmlEditor, Toolbar, Link, Image, Table, QuickToolbar]}
      />
    </RichTextEditorComponent>
  );
};

export default SyncfusionEditor;
