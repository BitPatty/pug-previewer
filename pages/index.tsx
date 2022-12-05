import { useEffect, useRef, useState } from 'react';

import Button from '../components/Button';
import CodeEditor, { CodeEditorRef } from '../components/CodeEditor';
import Preview from '../components/Preview';
import SaveModal from '../components/SaveModal';

import { SaveHandler } from '../utils';

const Home: React.FC = () => {
  const pugEditorRef = useRef<CodeEditorRef>(null);
  const jsonEditorRef = useRef<CodeEditorRef>(null);
  const cssEditorRef = useRef<CodeEditorRef>(null);

  const [projectName, setProjectName] = useState<string>('Unnamed Project');
  const [compiled, setCompiled] = useState<string>('');
  const [loadingCounter, setLoadingCounter] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);

  // Add save event listener (Ctrl + S)
  useEffect(() => {
    const listener = async (e: KeyboardEvent): Promise<void> => {
      if (
        (e.keyCode === 83 || e.key === 's') &&
        (navigator.platform.match('Mac') ? e.metaKey : e.ctrlKey)
      ) {
        e.preventDefault();
        await pugEditorRef.current?.format();
        await jsonEditorRef.current?.format();
        await cssEditorRef.current?.format();

        const content = pugEditorRef.current?.getValue() ?? '';
        const values = jsonEditorRef.current?.getValue() ?? '';
        const css = cssEditorRef.current?.getValue() ?? '';

        SaveHandler.addSave({
          projectName:
            projectName.trim().length > 0 ? projectName : 'Unnamed Project',
          content,
          values,
          css,
        });
      }
    };

    document.addEventListener('keydown', listener, false);
    return () => document.removeEventListener('keydown', listener);
  }, [projectName]);

  // Compile the template
  const compile = async (): Promise<void> => {
    setLoadingCounter((c) => c + 1);

    // Reset states
    setError(null);
    setCompiled('');

    try {
      const template = pugEditorRef.current?.getValue();
      const stringValues = jsonEditorRef.current?.getValue();
      const css = cssEditorRef.current?.getValue();

      if (!template) return;

      // Parse values JSON
      const values: Record<string, unknown> = (() => {
        if (stringValues != null && stringValues.trim().length > 0) {
          try {
            return JSON.parse(stringValues);
          } catch {
            setError('Invalid JSON Data');
            return;
          }
        }
      })();

      const res = await fetch('/api/compile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          template,
          values,
          css: css ?? '',
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        if (typeof json.error === 'string') throw new Error(json.error);
        throw new Error(JSON.stringify(json));
      }

      setCompiled(json.compiled);
    } catch (err) {
      setError((err as Error)?.message ?? 'Unknown Error');
    } finally {
      setLoadingCounter((c) => c - 1);
    }
  };

  return (
    <div>
      <div className="columns is-vcentered">
        <div className="column is-half">
          <h1 className="title is-inline">Pug Preview</h1>
          <input
            onChange={(v) => setProjectName(v.target.value)}
            placeholder="Project Name"
            className="input is-inline ml-4"
            value={projectName}
          />
        </div>
        <div className="column is-half has-text-right">
          <Button
            onClick={() => setShowSaveModal(true)}
            theme="info"
            iconClass="fa-list"
            label="View Saves"
          />
        </div>
      </div>
      <div className="columns">
        <div className="column is-half has-text-centered">
          <h2 className="title is-4">Pug Template (main.pug)</h2>
        </div>
        <div className="column is-one-quarter has-text-centered">
          <h2 className="title is-4">JSON Values</h2>
        </div>
        <div className="column is-one-quarter has-text-centered">
          <h2 className="title is-4">CSS Styles (css.pug)</h2>
        </div>
      </div>
      <div className="columns">
        <div
          className="column is-half"
          style={{ height: '50vh', resize: 'vertical', overflow: 'auto' }}
        >
          <div style={{ height: '100%' }}>
            <CodeEditor theme="vs-dark" language="pug" ref={pugEditorRef} />
          </div>
        </div>
        <div
          className="column is-one-quarter"
          style={{ height: '50vh', resize: 'vertical', overflow: 'auto' }}
        >
          <div style={{ height: '100%' }}>
            <CodeEditor theme="vs-dark" language="json" ref={jsonEditorRef} />
          </div>
        </div>
        <div
          className="column is-one-quarter"
          style={{ height: '50vh', resize: 'vertical', overflow: 'auto' }}
        >
          <div style={{ height: '100%' }}>
            <CodeEditor theme="vs-dark" language="css" ref={cssEditorRef} />
          </div>
        </div>
      </div>
      <div className="columns is-centered">
        <div className="column has-text-centered">
          <Button
            theme="primary"
            label="Compile"
            disabled={loadingCounter > 0}
            isLoading={loadingCounter > 0}
            onClick={() => compile()}
          />
        </div>
      </div>
      <div className="columns">
        {error ? (
          <div className="column">
            <div className="notification is-danger">Error: {error}</div>
          </div>
        ) : (
          <div className="column">
            <Preview resizable content={compiled} />
          </div>
        )}
      </div>
      {!error && compiled && compiled.trim().length > 0 && (
        <div className="columns">
          <div className="column">
            <h3 className="title is-5">HTML Output:</h3>
            <pre>{compiled}</pre>
          </div>
        </div>
      )}
      {showSaveModal && (
        <SaveModal
          onClose={() => setShowSaveModal(false)}
          onRestore={(v) => {
            const [p, j, c] = [
              pugEditorRef.current,
              jsonEditorRef.current,
              cssEditorRef.current,
            ];
            if (!p || !j || !c) return setError('Editor not initialized');
            p.setValue(v.content ?? '');
            j.setValue(v.values ?? '');
            c.setValue(v.css ?? '');
            setShowSaveModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Home;
