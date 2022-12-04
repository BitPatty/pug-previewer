import 'bulma/css/bulma.min.css';
import 'fontawesome-free/css/all.min.css';

import '../styles/globals.css';

import { AppProps } from 'next/app';
import { ReactElement } from 'react';

const App = ({ Component, pageProps }: AppProps): ReactElement => {
  return (
    <>
      <main className="p-5">
        <Component {...pageProps} />
      </main>
    </>
  );
};

export default App;
