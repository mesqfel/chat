module.exports.beginChat = function(application, req, res){

	var formData = req.body;

	req.assert('name', 'A name is required').notEmpty();
	req.assert('name', 'Your name must be from 1 to 15 characters').len(1, 15);

	var errors = req.validationErrors();

	if(errors){
		res.render('index', {errors : errors});
		return;
	}

	//Get 'io' global var and emit a msg to the client
	application.get('io').emit(
		'msgToClient',
		{name : formData.name, msg: ' just joined the chat'}
	);

	res.render('chat', {formData: formData});
};