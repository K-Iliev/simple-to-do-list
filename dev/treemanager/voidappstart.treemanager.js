/*
*	Used for catching key and mouse events,
*	then it manages which tree operation has to
*	be done.
*/
function TreeManager(){
	// it contains all tree events
	this.eventList = [];
}
/*
*	Used for attacing event to tree manager
*/
TreeManager.prototype.addEvent = function(event){
	this.eventList.push(event);
}
/*
*	It servers as a layer, so that executeCommand can be invoked 
*	also from the link and key event
*/
TreeManager.prototype.recognizeEvent = function(e){
	e = e || window.event;
	voidappstart.treeManager.executeCommand(e.keyCode);
};
/*
*	Based on the tree events permissions and the entered key code,
*	it executes the tree event command, which it is tree function
*/
TreeManager.prototype.executeCommand = function(keyCode){
	var focus = this.isFocusOnSpecificTask();
	
	// pattern for executing the tree event command
	for(var i=0;i<this.eventList.length;i++){
		for(var j=0;j<this.eventList[i].commands.length;j++){
			if(this.eventList[i].commands[j].hasFocusPermission(focus) &&
				this.eventList[i].contains(keyCode) && 
				  this.eventList[i].commands[j].hasContextPermission()){
				this.eventList[i].commands[j].execute();
		  }
		}	
		
	}
	// refresh buttons 
	this.setHowToUseKeysInstructions(voidappstart.tree.context, voidappstart.tree.currentDOMElement.hasFocus);
};
/*
*	It sets the active element based on focus
*/
TreeManager.prototype.setActiveElement = function(){
	if(event.which != 1){
		var isFocusOnTask = voidappstart.treeManager.isFocusOnSpecificTask();
		if(isFocusOnTask){
			var parentNode = $(document.activeElement).closest(voidappstart.paths.focusElement);
			voidappstart.tree.currentDOMElement.setNewElement(parentNode);
		}else{
			voidappstart.tree.currentDOMElement.removeFocusFromInput();
		}
		if(voidappstart.tree.context == voidappstart.enumContext.read){
			isFocusOnTask = false;
		}
		if(voidappstart.tree.currentDOMElement.hasFocus == false){
			voidappstart.treeManager.setHowToUseKeysInstructions(voidappstart.tree.context, isFocusOnTask); 
		}
	}else{
		voidappstart.tree.currentDOMElement.hasFocus = false;
		voidappstart.treeManager.setHowToUseKeysInstructions(voidappstart.tree.context, "false"); 
	}
	
};
/*
*	Checks whether focus is on the input or not
*/
TreeManager.prototype.isFocusOnSpecificTask = function(){
	var activeElement = document.activeElement.name;
	if(activeElement == "description" ||
		 activeElement == "taskPriority" ||
		 	 activeElement == "taskStatus"){
				return true;
	}
	return false;	
};
/*
*	It sets the active element based on focus
*/
TreeManager.prototype.setHowToUseKeysInstructions = function(context, hasFocus){

	$("#buttons").html('');
	var focus = hasFocus.toString();
	//var instructions = [];
	var buttons = [];
	var keyCodes = [];
	var templateNames = [];
	
	//  based on CURRENT context and focus, we find in the tree events
	// 	which tree events to display, so that the client could see only
	//	and execute commands that work.
	for(var i=0;i<this.eventList.length;i++){
		for(var j=0;j<this.eventList[i].howToUse.length;j++){
			for(var k=0;k<this.eventList[i].howToUse[j].context.length;k++){
				if(this.eventList[i].howToUse[j].context[k] == context &&
				 this.eventList[i].howToUse[j].onfocus == focus){
				 	//instructions.push(this.eventList[i].howToUse[j].text);
				 	if(typeof(this.eventList[i].howToUse[j].buttonName) !== 'undefined'){
				 		buttons.push(this.eventList[i].howToUse[j].buttonName);
				 		keyCodes.push(this.eventList[i].keys[0]);
				 		templateNames.push(this.eventList[i].templateName); 		
				 	}

				 }
			}
		}
	}

	for(var i=0; i< buttons.length; i++){
		var template = {
			buttonName : buttons[i],
			keyCode : keyCodes[i]
		}
		var tmp = $(templateNames[i]).tmpl(template);
		$("#buttons").append(tmp);
		
	}

	// OBSOLETE
	// uncomment this for displaying the instructions 
	// for using the buttons
	/*
	$("#instructions").html('');
	for(var i=0;i< instructions.length;i++){
		$("#instructions").append(instructions[i]+'<br />');
	}
	*/
};
/*
*	It hides the tasks if the clients closes it. 
*	Then the new task is marked as active.
*/
TreeManager.prototype.setVisabilityOfTask = function(){
	if(voidappstart.tree.isContext(voidappstart.enumContext.read)){
		var element = voidappstart.tree.currentDOMElement.element;
		if(voidappstart.tree.hideIfClosed(element)){
			setTimeout(function() { voidappstart.tree.currentDOMElement.selectNewOne() }, 500);
		}
	}
};
/*
*	On every change in the dropdown menus or textarea input
*	it saves the current state in the tree.
*/
TreeManager.prototype.writeChanges = function(){
	voidappstart.tree.currentDOMElement.writeChangesToTreeTask(voidappstart.tree._root);
}
/*
*	It simulates click for showing the open file fialog window 
*/
TreeManager.prototype.showOpenFileDialog = function(){
	$("#upload").click();
}
/*
*	It saves the tree on the local drive if there are created tasks.
*/
TreeManager.prototype.saveBeforeUnloadThePage = function(){
    if(voidappstart.tree._root.hasChildren()){
		voidappstart.tree.downloadAsTxtFile();
	}
}