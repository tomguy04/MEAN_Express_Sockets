// Import express and path modules.
var express = require( "express");
var path = require( "path");
// Create the express app.
var app = express();
// Define the static folder.
app.use(express.static(path.join(__dirname, "./static")));
// Setup ejs templating and define the views folder.
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
//body parser
var bodyParser = require('body-parser');
// use it!
app.use(bodyParser.urlencoded({ extended: true }));

//**1
// Have the server render views/index.ejs that has the form for the user to fill out 
// Root route to render the index.ejs view.
app.get('/', function(req, res) {
 res.render("index");
})

app.post('/result', function(req,res) {
    console.log("POST DATA", req.body);
    res.redirect('/');
})


//we are retrieving an object given to us from the 'app.listen' method (we named it 'server'), and we pass the 'server' object into the socket, listen method.
var server = app.listen(8000, function() {
    console.log("listening on port 8000");
});
//the io object which we are going to use to control our sockets.
var io = require('socket.io').listen(server);

//we are going to set up the connection event. 
//Remember the order! Server and our port listener come first, the 'io' variable and require socket statement second, and last we'll have the io.sockets.on line as seen in the below snippet:
io.sockets.on('connection', function (socket) { //when a client connects, this code runs!
    console.log("Client/socket is connected!");
    console.log("Client/socket id is: ", socket.id);
    // all the server socket code goes in here

    socket.on( "button_clicked", function (data){
        //the result route is performed
        console.log( 'Someone clicked a button!  Reason: '  + data.reason);
        //EMIT
        socket.emit( 'server_response', {response:  "sockets are the best!"});
        //BROADCAST:
        socket.broadcast.emit( 'server_response',{response: "my_broadcast_event"});
        //FULL BROADCAST:
        io.emit( 'server_response', {response: "my_full_broadcast_event"});
        })

    socket.on( "posting_form", function (data){
        //console log the user_info object sent from the client
        console.log( `Someone submitted!  ${data.user.name}`);
        //console.log( 'Someone submitted!  Reason: '  + data.reason);
        //EMIT
        socket.emit( 'server__form_response', {response:  "you submitted the form!"});
        socket.emit( 'server_response', {response:  "you submitted the form!"});
        //BROADCAST:
        socket.broadcast.emit( 'server_response',{response: "someone ELSE submitted the form"});
        //FULL BROADCAST:
        io.emit( 'server_response', {response: "TO ALL: ONE OF YOU SUBMITTED A FORM"});
        })

  })
  

// Start Node server listening on port 8000.
// app.listen(8000, function() {
//  console.log("listening on port 8000");
// })