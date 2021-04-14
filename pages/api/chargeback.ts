import type express from 'express';
import * as lib from './lib';

export default async function Task(req: express.Request, res: express.Response) {
  console.log('chargeback');
  console.log(1, req.params);
  console.log(2, req.body);
  console.log(3, req.headers);
  console.log(4, req.query);
  console.log(5, req.path);
  console.log(6, req.method);
  res.status(200).json({
    status: 'success',
    requestId: lib.getHash(8),
  });
}