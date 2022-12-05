import 'bulma/css/bulma.min.css';
import 'fontawesome-free/css/all.min.css';

import '../styles/globals.css';

import { AppProps } from 'next/app';
import { ReactElement } from 'react';
import Head from 'next/head';

const App = ({ Component, pageProps }: AppProps): ReactElement => {
  return (
    <>
      <Head>
        <title>Pug Previewer</title>
      </Head>
      <main className="p-5">
        <Component {...pageProps} />
      </main>
    </>
  );
};

export default App;
