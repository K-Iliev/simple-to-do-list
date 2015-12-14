/*
*	Tree Event declares permissions 
*	( which context, keys, focus - in the Command class)
*	in order to one command to be executed.
*	It also declares  permissions (context,focus) for displaying 
*	the names of the buttons (and additional info, which is obsolete)
*	This info can work againg if some code is uncommented
*/
function TreeEvent(templateName){
	this.commands = [];
	this.keys = [];
	this.howToUse = [];
	this.templateName = null;
	this.initTemplate(templateName);
}
/*
*	The default template is button template.
*	You can change it by passing other template name.
*	First you create template script in the page,
*	then set unique id
*/
TreeEvent.prototype.initTemplate = function(templateName){
	if(typeof(templateName) !== 'undefined'){
		this.templateName = templateName;
	}else{
		this.templateName = "#ButtonTemplate"; // default template
	}

};
/*
*	Push the keys and howtouse objects which explains how to use them.
*	When client press some key, it executes the command in 
*	tree event based on the settings in the howtouse object
*/
TreeEvent.prototype.registerKeys = function(keys, howToUse){
	this.keys.registerKeys(keys);
	this.addHowToUseObjects(howToUse);
};
/*
*	Add aditional 'how to use' objects to the arrays
*/
TreeEvent.prototype.addHowToUseObjects = function(howToUse){
	for(var i=0; i<howToUse.length;i++){
		this.howToUse.push(howToUse[i]);
	}
};
/*
*	Checks whether the given keycode is contained in the 
*	tree event keys
*/
TreeEvent.prototype.contains = function(keyCode){
	for(var i=0; i< this.keys.length;i++){
		if(keyCode == this.keys[i]){
			return true;
		}
	}
	return false;
};
/*
*	Registers command
*/
TreeEvent.prototype.pushCommand = function(command){
	this.commands.push(command);
};
/*
*	Gets the command based on the given index
*/
TreeEvent.prototype.getCommand = function(index){
	return this.commands[index];
};