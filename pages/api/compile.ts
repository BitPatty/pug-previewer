import { NextApiRequest, NextApiResponse } from 'next';
import pug from 'pug';

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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST')
    return sendResponse(res, 405, { error: 'Invalid Operation' });

  if (!req.body?.template || typeof req.body.template !== 'string')
    return sendResponse(res, 400, { error: 'Bad Request' });

  try {
    const compiled = pug.render(req.body.template, req.body.values ?? {});
    return sendResponse(res, 200, { compiled });
  } catch (err) {
    console.error(err);
    return sendResponse(res, 500, {
      error: (err as Error)?.message ?? 'Unknown Error',
    });
  }
};

export default handler;
