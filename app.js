//import server configs
var app = require('./config/server');

//Set listening port
var server = app.listen(3000, function(){
	console.log('Server listening on port 3000');
});

var io = require('socket.io').listen(server);

//Define 'io' as a global var
app.set('io', io);

var userNames = [];
var usersCount = 0;

//Init websocket connection
io.on('connection', function(socket){

	//On disconnect
	socket.on('disconnect', function(){

		//Lets look for the user that just disconnected on "userNames" array
		var index = -1;
		for(var i=0; i < userNames.length; i++){
			if(userNames[i] == socket.username){
				index = i;
				break;
			}
		}

		//If we found the user, lets remove it from the "userNames" array and send a msg to the clint to update the online users
		if(index > -1){
			usersCount--;
			userNames.splice(index, 1);

			//Send to everyone else except the sender
			socket.broadcast.emit(
				'clientUpdateUsersOnline', 
				{
					users: userNames,
					usersCount: usersCount
				}
			);

			//Send to everyone else except the sender
			socket.broadcast.emit(
				'msgToClient', 
				{
					name: socket.username,
					msg: 'just left the chat',
					isSender: false
				}
			);

		}

	});

	//Event of someone sending a message
	socket.on('msgToServer', function(data){

		//Send msg to the sender
		socket.emit(
			'msgToClient', 
			{
				name: data.name, 
				msg: data.msg,
				isSender: true
			}
		);

		//Send to everyone else except the sender
		socket.broadcast.emit(
			'msgToClient', 
			{
				name: data.name, 
				msg: data.msg,
				isSender: false
			}
		);

	});

	//Event to update the online users to the client
	socket.on('serverUpdateUsersOnline', function(data){

		usersCount++;
		socket.username = data.name;
		userNames.push(data.name);

		//Send msg to the sender
		socket.emit(
			'clientUpdateUsersOnline', 
			{
				users: userNames,
				usersCount: usersCount
			}
		);

		//Send to everyone else except the sender
		socket.broadcast.emit(
			'clientUpdateUsersOnline', 
			{
				users: userNames,
				usersCount: usersCount
			}
		);

	});

});