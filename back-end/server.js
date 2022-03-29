require('dotenv').config();
const app = require('express')();
const {checkUser, requireAuth} = require ('./middleware/auth.middleware')
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const UserRouter= require('./api/User');
//const CategorieRouter = require('./api/Categorie');
const ressourceRoutes = require('./routes/ressources')
//const RessourceRouter = require('./api/Ressource');
const bodyParser = require('express').json;
const port = 3005;


mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('DB is OK'))
  
  .catch((ex)=> console.log(ex));

app.use(bodyParser());
app.use(cookieParser());


//jwt 
app.get('*', checkUser)
app.get('/jwtid', requireAuth, (req, res)=>{
  // console.log('sallllllllllllllllut');
  // console.log(res);
  // console.log(res);


  // res.locals.user = req.user;
  res.status(200).send(res.locals._id)
})


//routes
app.use('/user', UserRouter);
//app.use('/categorie', CategorieRouter);
app.use('/ressource', ressourceRoutes);

//const server = http.createServer(app);

/*server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});*/

app.listen(port);