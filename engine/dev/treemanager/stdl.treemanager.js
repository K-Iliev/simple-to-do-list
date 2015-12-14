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
	stdl.treeManager.executeCommand(e.keyCode);
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
	
	// hardcore :/
	if(keyCode == 13){
		focus = stdl.tree.currentDOMElement.hasFocus;
	}
	// refresh buttons 
	this.setHowToUseKeysInstructions(stdl.tree.context, focus);
};
/*
*	It sets the active element based on focus
*/
TreeManager.prototype.setActiveElement = function(){
	var isFocusOnTask = stdl.treeManager.isFocusOnSpecificTask();
	if(isFocusOnTask){
		var parentNode = $(document.activeElement).closest(stdl.paths.focusElement);
		stdl.tree.currentDOMElement.setNewElement(parentNode);
		stdl.treeManager.setHowToUseKeysInstructions(stdl.tree.context, isFocusOnTask); 
	}else{
		if(document.activeElement.localName != "a"){
			stdl.tree.currentDOMElement.removeFocusFromInput();
		}
		stdl.treeManager.setHowToUseKeysInstructions(stdl.tree.context, isFocusOnTask); 
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
	var instructions = [];
	
	//  based on CURRENT context and focus, we find in the tree events
	// 	which tree events to display, so that the client could see only
	//	and execute commands that work.
	for(var i=0;i<this.eventList.length;i++){
		for(var j=0;j<this.eventList[i].howToUse.length;j++){
			for(var k=0;k<this.eventList[i].howToUse[j].context.length;k++){
				if(this.eventList[i].howToUse[j].context[k] == context &&
				 this.eventList[i].howToUse[j].onfocus == focus){
				 	
				 	if(typeof(this.eventList[i].howToUse[j].buttonName) !== 'undefined'){
				 		buttons.push(this.eventList[i].howToUse[j].buttonName);
				 		keyCodes.push(this.eventList[i].keys[0]);
				 		templateNames.push(this.eventList[i].templateName); 
				 		instructions.push(this.eventList[i].howToUse[j].text);		
				 	}

				 }
			}
		}
	}

	for(var i=0; i< buttons.length; i++){
		var template = {
			buttonName : buttons[i],
			keyCode : keyCodes[i],
			toolTip : instructions[i]
		}
		var tmp = $(templateNames[i]).tmpl(template);
		$("#buttons").append(tmp);
		
	}
	$('[data-toggle="tooltip"]').tooltip();
};
/*
*	It hides the tasks if the clients closes it. 
*	Then the new task is marked as active.
*/
TreeManager.prototype.setVisabilityOfTask = function(){
	stdl.tree.currentDOMElement.hideIfClosedFilterDoNotMatch();
	stdl.tree.refreshDOMCounter();
};
/*
*	On every change in the dropdown menus or textarea input
*	it saves the current state in the tree.
*/
TreeManager.prototype.writeChanges = function(){
	stdl.tree.currentDOMElement.writeChangesToTreeTask(stdl.tree._root);
}
/*
*	It simulates click for showing the open file fialog window 
*/
TreeManager.prototype.showOpenFileDialog = function(){
	$("#upload").click();
};
TreeManager.prototype.filterTasks = function(path, charactertic, filter){
	if(typeof(charactertic) !== 'undefined' && typeof(path) !== 'undefined'){
		stdl.tree.showTasksBasedOnCharacteristic(path, charactertic);
	}else{
		stdl.tree.showAll();
	}
	stdl.tree.setFilter(filter);
};
TreeManager.prototype.changePriorityColor = function(){
	stdl.tree.currentDOMElement.colorBasedOnPriority();
	stdl.tree.currentDOMElement.hideIfPriorityFilterDoNotMatch();
	stdl.tree.refreshDOMCounter();	

};
/*
*	It saves the tree on the local drive if there are created tasks.
TreeManager.prototype.saveBeforeUnloadThePage = function(){
    if(stdl.tree._root.hasChildren()){
		stdl.tree.downloadAsTxtFile();
	}
}
*/