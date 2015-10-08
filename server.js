var express = require("express");
var path = require("path");
var app = express();
var bodyParser = require('body-parser');


app.use(express.static(path.join(__dirname, './client')));
app.use('/node_modules',express.static(__dirname + '/node_modules'))
app.use(bodyParser.json());

app.set('views', __dirname + '/client/views/');
app.set("view engine", 'ejs');

require('./server/route.js')(app);

var server = app.listen(8000, function() {
	console.log("listening on port 8000");
})

var io = require('socket.io').listen(server); 

io.sockets.on('connection', function (socket) {
	console.log('connectio established')
	var something = "ajlsdkfjalsdf"
	socket.on('start', function(name){
		user = "New user " + name['name'] + " has just joined your game!";
		socket.broadcast.emit('new_user', user);
	});
	socket.on('get_in_to_positions', function(){
		io.sockets.emit('start_game', "starting");
	})
	socket.on('writting_game', function(){
		sentences = ["WOW this game is so amazing and beautifully crafted I'm speechless! - Jay", "As I play this game I realize that it is entirely eloquent, and yet utterly ineffable.", "Matthew finds the box empty.", "We called her 'the crazy flight attendant'", "Those dentists named the ship Titanic.", "That gardener leaves the door open.", "That computer programmer named the dog Fido.", "Donna's daughter elected Bill captain of our team.", "That computer programmer named the dog Fido.", "That flight attendant elected Bill captain of our team.", "Those bartenders elected her chairperson.", "That garbage man named the baby Susan.", "Those carpenters paint the room green.", "The summer uncovers the awful advertisement.", "The produce fine-tunes the encouraging grip.", "The connection discharges the glossy motion.", "The road cooperates the measly purpose.", "The porter expands the rambunctious level."];
		random_sentence = sentences[Math.floor(Math.random()*(sentences.length - 1))]
		console.log(random_sentence)
		game = {
			answer: random_sentence,
			rule: "Type out this sentence correctly as fast as you can."
		}
		io.sockets.emit('start_writting', game);
	})
	socket.on('riddle_game', function(){
		options = ['You Console it!', "There's nothing you can do.", "You ask Jay!", "You don't, you should switch to ruby"];
		game = {
			answer: "You Console it!",
			rule: "Answer the Question, you only get one attempt!",
			question: "How do you make javascript feel better?",
			option: options
		};
		console.log(game)
		io.sockets.emit('riddling', game);
	})
	socket.on('clicked', function(name){
		lose = "GAME OVER homie, you lost! The winner is " + name + "!"
		win = "CONGRATULATIONS YOU WON!"
		socket.broadcast.emit('loser', lose);
		socket.emit('winner', win);
	})
});