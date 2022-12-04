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
  body
    p Hello World
`,
  html: `<!DOCTYPE html>
<head>
  <title>Hello World</title>
</head>
<body>
  Hello World
</body>
`,
  json: `{}`,
};

type RequiredProps = {
  language: 'pug' | 'html' | 'json';
};

type OptionalProps = {
  height?: string;
  theme?: 'light' | 'vs-dark';
};

export type RefProps = { isReady?: boolean } & Pick<
  monaco.editor.IStandaloneCodeEditor,
  'getValue' | 'setValue'
>;

const CodeEditor = forwardRef<RefProps, RequiredProps & OptionalProps>(
  ({ height, language, theme }, ref) => {
    const [editorRef, setEditorRef] = useState<RefProps>();

    useImperativeHandle(
      ref,
      () => ({
        isReady: editorRef != null,
        getValue: (...args) => editorRef?.getValue(...args) ?? '',
        setValue: (...args) => editorRef?.setValue(...args),
      }),
      [editorRef],
    );

    return (
      <MonacoEditor
        height={height ?? '100%'}
        loading="Loading Editor.."
        language={language}
        theme={theme}
        defaultValue={defaultContent[language]}
        onMount={(e) => setEditorRef(e)}
      />
    );
  },
);

export default CodeEditor;
