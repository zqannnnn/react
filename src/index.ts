import * as bodyParser from 'body-parser'
import * as express from 'express'
import * as session from 'express-session'
import * as morgan from 'morgan'
import * as passport from 'passport'
import * as path from 'path'


import { i18n, middleware } from './middleware/i18n'
import { webpackMiddleware } from './middleware/webpack'
import { initDatabase } from './models'
import { passportConfig } from './passport'
import { router } from './routes'
import * as socket from 'socket.io' //1532692062 chat
//https://socket.io/get-started/chat/
//https://codeburst.io/isomorphic-web-app-react-js-express-socket-io-e2f03a469cd3

const app = express()
webpackMiddleware(app)
app.use(middleware.handle(i18n))

// initDatabase()
// Get the exchange rate API
// import { getApi as currencyApi } from './api/currency'
// currencyApi()
app.set('secretKey', 'just a test')

passportConfig(passport) // pass passport for configuration

// set up our express application
app.use(express.static(path.join(__dirname, '../public')))
app.use(morgan('dev')) // log every request to the console
app.use(bodyParser.json()) // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }))

// required for passport
app.use(
  session({
    secret: 'fun coding', // session secret
    resave: true,
    saveUninitialized: true
  })
)
app.use(passport.initialize())

// routes
router(app, passport) // load our routes and pass in our app and fully configured passport

// static
app.use('/static', express.static('./uploads'))

// launch
const port = process.env.PORT || 3000
const server = app.listen(port, (err: string) => {
  if (err) {
    console.log(err)
  }
  console.log(
    `⚡ Express started on port ${port}, in ${process.env.NODE_ENV} mode`
  )
})
//1532692062 chat
const io = socket(server)
export interface IHash {
  [details: string] : string;
}
let users: IHash = {};
io.sockets.on('connection', function (socket) {
  socket.on('set email', function (email) {
    console.log('!!!!!!!!!! set nickname')
    //console.log(name)
    //console.log(socket.id)
    users[socket.id] = email
    //console.log(socket.nsp.sockets[socket.id])
    //console.log(Object.keys(socket.nsp.sockets));
    //io.sockets.sockets['nickname'] = name;
    //socket.set('nickname', name, function () { socket.emit('ready'); })
  })
})
/*
io.sockets.on('connection',function(socket){ 
  io.sockets.sockets['nickname'] = socket.id;
  client.on("chat", function(data) {      
      var sock_id = io.sockets.sockets['nickname']
      io.sockets.sockets[sock_id].emit("private", "message");
  });    
});
*/
io.on('connection', socket => {
  console.log('New client connected')
  
  // just like on the client side, we have a socket.on method that takes a callback function
  socket.on('change color', (color) => {
    // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
    // we make use of the socket.emit method again with the argument given to use from the callback function above
    console.log('Color Changed to: ', color)
    io.sockets.emit('change color', color)
  })
  /*
  socket.on('set nickname', function (name) {
    socket.set('nickname', name, function () { socket.emit('ready'); });
  });  
  */
  socket.on('get-users', (nothing) => {
    // once we get a 'change color' event from one of our clients, we will send it to the rest of the clients
    // we make use of the socket.emit method again with the argument given to use from the callback function above
    //let clients = io.sockets.clients()
    console.log(users)
    io.sockets.clients((error :any, clients :any) => {
      //if (error) throw error;
      //console.log(clients); // => [PZDoMHjiu8PYfRiKAAAF, Anw2LatarvGVVXEIAAAD]
    });    
    //console.log('Users: ', clients)
    //io.sockets.emit('get-users', clients)
  })
  
  // disconnect is fired when a client leaves the server
  socket.on('disconnect', () => {
    console.log('user disconnected')
  })
})

export { app }
