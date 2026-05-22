"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false, loading: () => <div className="h-64 bg-surface-container rounded-lg flex items-center justify-center text-secondary-fixed-dim">Завантаження редактора...</div> });

interface RichEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function RichEditor({ value, onChange, placeholder }: RichEditorProps) {
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'header': [2, 3, 4, false] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'indent': '-1'}, { 'indent': '+1' }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
  }), []);

  return (
    <div className="bg-background rounded-lg text-white rich-editor-container">
      <style dangerouslySetInnerHTML={{__html: `
        .rich-editor-container .ql-toolbar {
          border-color: rgba(255, 255, 255, 0.2);
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          background-color: #1e1e1e;
        }
        .rich-editor-container .ql-container {
          border-color: rgba(255, 255, 255, 0.2);
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          min-height: 200px;
          font-size: 1rem;
          background-color: transparent;
        }
        .rich-editor-container .ql-stroke { stroke: #e0e0e0; }
        .rich-editor-container .ql-fill { fill: #e0e0e0; }
        .rich-editor-container .ql-picker { color: #e0e0e0; }
      `}} />
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder}
      />
    </div>
  );
}
