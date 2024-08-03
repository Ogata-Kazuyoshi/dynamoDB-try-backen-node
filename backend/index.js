import { setupServer } from './server.js';

const server = setupServer();
const PORT = process.env.PORT || 8090;

server.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
