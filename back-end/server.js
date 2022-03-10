require('dotenv').config();
const app = require('express')();
const mongoose = require('mongoose');
const UserRouter= require('./api/User');
const CategorieRouter = require('./api/Categorie');
const RessourceRouter = require('./api/Ressource');
const bodyParser = require('express').json;
const port = 3005;

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('DB is OK'))
  
  .catch((ex)=> console.log(ex));

  app.use(bodyParser());
app.use('/user', UserRouter);
app.use('/categorie', CategorieRouter);
app.use('/ressource', CategorieRouter);

//const server = http.createServer(app);

/*server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});*/

app.listen(port);