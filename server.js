import jsonServer from 'json-server';
import auth from 'json-server-auth';

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.db = router.db;

server.use(middlewares);
server.use(jsonServer.bodyParser);
server.use(auth);
server.use(router);

server.listen(5000, () => {
  console.log('JSON Server is running on port 5000');
});
