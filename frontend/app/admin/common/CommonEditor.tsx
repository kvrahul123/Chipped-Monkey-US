"use client";

import { FC, useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

interface CommonEditorProps {
  value: string;
  onChange: (value: string) => void;
  height?: number;
  placeholder?: string;
}

const CommonEditor: FC<CommonEditorProps> = ({
  value,
  onChange,
  height = 400,
  placeholder = "Start typing here...",
}) => {
  const editorRef = useRef<any>(null);

  return (
    <Editor
      apiKey="lai8epbtdpnk7699yftoxg1i0txko7rzi8a76z1o43m7248g"
      value={value}
      onEditorChange={(content) => onChange(content)}
      init={{
        height: height,
        menubar: true,
        plugins: [
          "advlist autolink lists link image charmap print preview anchor",
          "searchreplace visualblocks code fullscreen",
          "insertdatetime media table paste code help wordcount",
          "table",
        ],
        table_advtab: false, // Disables the "Advanced" tab in the table dialog
        table_cell_advtab: false, // Disables the "Advanced" tab in the cell dialog
        table_row_advtab: false,
        toolbar:
          "undo redo | formatselect | bold italic backcolor | " +
          "alignleft aligncenter alignalignright alignjustify | " +
          "bullist numlist outdent indent | removeformat | code | table",

        // 🚀 The most permissive configuration for elements and attributes
        // This is the key to preserving your styles.
        valid_elements: "+*[*]",
        extended_valid_elements: "+*[*]",
        custom_elements: "+*[*]",

        // This line is extremely important for preventing TinyMCE from "correcting" your HTML.
        verify_html: false,

        forced_root_block: false, // stop wrapping in <p>
        force_br_newlines: false,
        force_p_newlines: false,

        // paste config
        paste_retain_style_properties: "all",
        paste_webkit_styles: "all",
        paste_merge_formats: true,
        paste_data_images: true,

        // make Bootstrap tables render properly in the editor iframe
        content_css: [
          "/assets/css/bootstrap-5.3.8.min.css",
          "/assets/css/admin.css",
          "/assets/css/style.css",
        ],
        content_style: `
          @import url('/assets/css/bootstrap-5.3.8.min.css');
          body {   font-family: "Archivo Narrow", sans-serif; font-size: 14px; }
        `,
      }}
    />
  );
};

export default CommonEditor;
