import app from './app';

import { createServer } from 'http';

const server = createServer(app);

const { PORT = 8080 } = process.env;
server.listen(PORT, () => {
  console.info(`IPFS Pinning Server is now running on http://localhost:${PORT}`); // eslint-disable-line no-console
  // console.info(
  //   `API Server over web socket with subscriptions is now running on ws://localhost:${PORT}${WS_GQL_PATH}`
  // ); // eslint-disable-line no-console
});