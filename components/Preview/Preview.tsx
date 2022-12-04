import { useEffect, useRef } from 'react';

type RequiredProps = {
  content: string;
};

type OptionalProps = {
  resizable?: boolean;
};

const Preview: React.FC<RequiredProps & OptionalProps> = ({
  content,
  resizable,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const currentRef = iframeRef.current;
    if (!currentRef) return;
    currentRef.contentWindow?.document.open();
    currentRef.contentWindow?.document.write(content);
    currentRef.contentWindow?.document.close();
  }, [content]);

  return (
    <div className="columns">
      <iframe
        className="column"
        style={
          resizable
            ? { resize: 'both', minHeight: '500px' }
            : { minHeight: '500px' }
        }
        ref={iframeRef}
      >
        {content}
      </iframe>
    </div>
  );
};

export default Preview;
