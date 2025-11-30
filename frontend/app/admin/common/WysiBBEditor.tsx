"use client";

import React, { useEffect, useRef } from "react";

declare global {
  interface Window {
    jQuery: any;
    $: any;
  }
}

interface Props {
  value: string;
  onChange: (val: string) => void;
}

const WysiBBEditor: React.FC<Props> = ({ value, onChange }) => {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const editorInstanceRef = useRef<any>(null);

  useEffect(() => {
    const loadScripts = async () => {
      if (!window.jQuery) {
        await new Promise<void>((res) => {
          const jq = document.createElement("script");
          jq.src =
            "https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.0/jquery.min.js";
          jq.onload = () => res();
          document.body.appendChild(jq);
        });
      }

      if (!window.$.wysibb) {
        await new Promise<void>((res) => {
          const css = document.createElement("link");
          css.rel = "stylesheet";
          css.href = "https://cdn.wysibb.com/css/default/wbbtheme.css";
          document.head.appendChild(css);

          const script = document.createElement("script");
          script.src = "https://cdn.wysibb.com/js/jquery.wysibb.min.js";
          script.onload = () => res();
          document.body.appendChild(script);
        });
      }

      if (editorRef.current && !editorInstanceRef.current) {
        const $editor = window.$(editorRef.current);

        $editor.wysibb({
          buttons:
            "bold,italic,underline,|,link,img,|,quote,code,list,|,fontcolor,fontsize",
          height: 500,
        });

        editorInstanceRef.current = $editor;

        // ✅ Always set initial value
        $editor.wysibb("setHTML", value || "");

        // 🔑 change handler (also catch blur to be safe)
        const handler = () => {
          const html = $editor.wysibb("getHTML");
          onChange(html);
        };

        $editor.on("change keyup blur", handler);
      }
    };

    loadScripts();

    // cleanup
    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.remove(); // destroy editor
        editorInstanceRef.current = null;
      }
    };
  }, []);

  // sync external -> editor
  useEffect(() => {
    if (editorInstanceRef.current) {
      const $editor = editorInstanceRef.current;
      const currentHtml = $editor.wysibb("getHTML");
      if (value !== currentHtml) {
        $editor.wysibb("setHTML", value || "welcone");
      }
    }
  }, [value]);

  return <textarea ref={editorRef} />;
};

export default WysiBBEditor;
