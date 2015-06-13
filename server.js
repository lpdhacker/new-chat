var io  = require('socket.io');  
var server = io.listen(4732);

// usernames which are currently connected to the chat
var lovegurus = {};
var users={};


server.sockets.on('connection', function(socket) {  
    socket.emit('connected', {msg: 'welcome to love guru chat'});
    
	socket.on('add_user', function(data) {
        if (data.type == "user") {
			socket.username = data.username;
			users[data.username] = 'avail';
			socket.emit('add_user_response', {msg: 'user: '+data.username+' added'});
        }
		if (data.type == "loveguru") {
            socket.username = data.username;
			lovegurus[data.username] = 'avail';
			socket.join(data.username);
			socket.emit('add_user_response', {msg: 'loveguru: '+data.username+' added'});
        }
    }); //socket.on('user', function(data)

	//user's methods
	socket.on('join_loveguru', function(data){
		if(!users[data.username]=='avail') 
		{
			socket.emit('join_loveguru_response', {'status_code':0,'msg':'can not join chat, user status is '+users[data.username]});
			return;
		}
		if(!lovegurus[data.loveguru_name]=='avail')
		{
			socket.emit('join_loveguru_response', {'status_code':0,'msg':'can not join chat, loveguru status is '+users[data.loveguruname]});
			return;
		}
		
		socket.join(data.loveguru_name);
		lovegurus[data.loveguru_name]='bussy';
		users[data.username]='bussy';
		
		socket.broadcast.to(data.loveguru_name).emit('updatechat', 'SERVER', data.username + ' has connected to '+data.loveguru_name);
		socket.emit('join_loveguru_response', {'status_code':1,'msg':'user '+data.username+' joined '+data.loveguru_name});
	}); //socket.on('join_loveguru', function(data)
		
	socket.on('get_loveguru_list', function(){
		socket.emit('get_loveguru_list_response',{'lovegurus':lovegurus});
	}); //socket.on('join_loveguru', function(data)		
	
	socket.on('leave_loveguru', function(data){
		socket.leave(data.loveguru_name);
		lovegurus[data.loveguru_name]='avail';
		users[data.username]='avail';
		
		socket.emit('leave_loveguru_response',{'status_code':1,'msg':'user '+data.username+' leaved '+data.loveguru_name});
	}); //socket.on('leave_loveguru', function(data)
	
	//loveguru's methods
	
	
	//common methods	
	socket.on('send_msg',function(data){
		socket.broadcast.to(data.loveguru_name).emit('chat_msg',{'msg':data.msg});
		});
}); //server.sockets.on('connection', function(socket)

