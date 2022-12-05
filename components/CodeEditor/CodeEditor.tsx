import dynamic from 'next/dynamic';
import { forwardRef, useImperativeHandle, useState } from 'react';

import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

const MonacoEditor = dynamic(import('@monaco-editor/react'), { ssr: false });

const defaultContent = {
  pug: `doctype html
html
  head
    block head
      meta(charset="utf-8")
      meta(name="viewport", content="width=device-width")
      meta(name="x-apple-disable-message-reformatting")
      include css.pug
  body
    p Hello #{vars.world}
`,
  html: `<!DOCTYPE html>
<head>
  <title>Hello World</title>
</head>
<body>
  Hello World
</body>
`,
  json: `{
    "world": "World"
}`,
  css: `p {
  text-align: center;
  color: red;
}
`,
};

type RequiredProps = {
  language: 'pug' | 'html' | 'json' | 'css';
};

type OptionalProps = {
  height?: string;
  theme?: 'light' | 'vs-dark';
  defaultValue?: string;
};

export type RefProps = {
  isReady?: boolean;
  format: () => Promise<void>;
} & Pick<monaco.editor.IStandaloneCodeEditor, 'getValue' | 'setValue'>;

const CodeEditor = forwardRef<RefProps, RequiredProps & OptionalProps>(
  ({ height, language, theme, defaultValue }, ref) => {
    const [editorRef, setEditorRef] =
      useState<monaco.editor.IStandaloneCodeEditor>();

    useImperativeHandle(
      ref,
      () => ({
        isReady: editorRef != null,
        getValue: (...args) => editorRef?.getValue(...args) ?? '',
        setValue: (...args) => editorRef?.setValue(...args),
        format: async () => {
          const action = editorRef?.getAction('editor.action.formatDocument');
          if (!action?.isSupported) return;
          await action.run();
        },
      }),
      [editorRef],
    );

    return (
      <MonacoEditor
        height={height ?? '100%'}
        loading="Loading Editor.."
        language={language}
        theme={theme}
        defaultValue={defaultValue ?? defaultContent[language]}
        onMount={(e) => setEditorRef(e)}
      />
    );
  },
);

CodeEditor.displayName = 'CodeEditor';

export default CodeEditor;
