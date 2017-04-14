var socket = io('http://localhost:3000');

$(document).ready(function(){

	//Update the server with the online users
	socket.emit(
		'serverUpdateUsersOnline',
		{
			name: $('#username').val(),
		}
	);

	//Show Chat section
	$("#showChat").click(function(){

		$("#showOnlineUsers, #showAbout").parent().removeClass('active');
		$("#showChat").parent().addClass('active');

		
		$("#onlineUsers, #aboutSection").hide();
		$("#conversation").show();
		
		hideNavbar();
	});
	
	//Show Online Users section
	$("#showOnlineUsers").click(function(){

		$("#showChat, #showAbout").parent().removeClass('active');
		$("#showOnlineUsers").parent().addClass('active');

		$("#conversation, #aboutSection").hide();
		$("#onlineUsers").show();
		
		hideNavbar();
	});

	//Show About section
	$("#showAbout").click(function(){

		$("#showOnlineUsers, #showChat").parent().removeClass('active');
		$("#showAbout").parent().addClass('active');

		$("#conversation, #onlineUsers").hide();
		$("#aboutSection").show();
		
		hideNavbar();
	});

});

//Hide the navbar
function hideNavbar(){
	$("#btn_navbar_toggle").attr("class","navbar-toggle collapsed");
	$("#navbar-collapse-1").attr("class","navbar-collapse collapse");
	$("#btn_navbar_toggle").attr("aria-expanded","false");
	$("#navbar-collapse-1").attr("aria-expanded","false");
}

//Send msg
$('#btnSendMsg').click(function(){
	socket.emit(
		'msgToServer',
		{
			name: $('#username').val(), 
			msg: $('#msg').val()
		}
	);

	$('#msg').val('');
});

//On keypress ENTER
$(document).keypress(function(e) {
    if(e.which == 13) {
        $('#btnSendMsg').trigger('click');
    }
});

//Update view with the incoming message
socket.on('msgToClient', function(data){

	var html = '';

	if(data.isSender){
		html += '<div class="chat bg-chat-sender">';
			html += '<h4>You</h4>';
	}
	else{
		html += '<div class="chat bg-chat-recipient">';
			html += '<h4>'+data.name+'</h4>';
	}

		html += '<p>'+data.msg+'</p>';
	html += '</div>';

	$('#dialogs').append(html);

	window.scrollTo(0, document.body.scrollHeight);
});

//Update view to show current online users
socket.on('clientUpdateUsersOnline', function(data){

	var html = '';

	for(var i=0; i < data.users.length; i++){

		html += '<span class="participant">';
			html += '<img src="images/ico_usuario.png"> ';
			html += data.users[i];
		html += '</span>';

	}

	$('#peopleOnline').html(html);
	$('#usersCount').html(data.usersCount);

});