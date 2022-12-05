import { NextApiRequest, NextApiResponse } from 'next';
import pug from 'pug';

// eslint-disable-next-line
// @ts-ignore
import load from 'pug-load';

const sendResponse = (
  res: NextApiResponse,
  status: number,
  body: Record<string, string>,
): void => {
  res
    .status(status)
    .setHeader('Content-Type', 'application/json')
    .send(JSON.stringify(body));
};

const handler = (req: NextApiRequest, res: NextApiResponse): void => {
  if (req.method !== 'POST')
    return sendResponse(res, 405, { error: 'Invalid Operation' });

  if (!req.body?.template || typeof req.body.template !== 'string')
    return sendResponse(res, 400, { error: 'Invalid template' });

  if (req.body.css && typeof req.body.css !== 'string')
    return sendResponse(res, 400, { error: 'Invalid css' });

  try {
    load.resolve = (f: string) => {
      if (f !== 'css.pug') throw new Error('Can only import "css.pug"');
      return 'css.pug';
    };

    load.read = (f: string) => {
      if (f !== 'css.pug') throw new Error('Can only import "css.pug"');
      const fCSS = (req.body.css ?? '')
        .split('\n')
        .map((v: string) => `  ${v.trim()}`)
        .join('\n');

      return `style(type='text/css').\n${fCSS}`;
    };

    const compiled = pug.render(req.body.template, {
      vars: req.body.values,
      filename: 'main.pug',
      pretty: true,
      name: 'template',
    });
    return sendResponse(res, 200, { compiled });
  } catch (err) {
    return sendResponse(res, 500, {
      error: (err as Error)?.message ?? 'Unknown Error',
    });
  }
};

export default handler;
