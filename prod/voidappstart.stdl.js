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
/*
*   It defines rules - context, onfocus,
*   to show the buttons and (their instructions - obsolete)
*/
function HowToUse(context, onfocus, text, buttonName){
    this.context = context;
    this.onfocus = onfocus;
    this.text = text;
    this.buttonName = buttonName;
}
/*
*   This class defines the permission - context, focus
*   for executing the command - which it is link variable
*   linkContext is used for the context of 'this' pointer
*   linkParams are params of the link function
*/
function Command(permissionViaFocus, permissionsViaContext, link, linkContext, linkParams){
    this.permissionViaFocus = permissionViaFocus;
    this.permissionsViaContext = permissionsViaContext || [];
    this.link = link || null;
    this.linkContext = linkContext || null;
    this.linkParams = linkParams;
}
/*
*   It executes the command via call
*/
Command.prototype.execute = function(){
    this.link.call(this.linkContext, this.linkParams);
}
/*
*   It sets the focus permission
*/
Command.prototype.setPermissionViaFocus = function(focus){
    this.permisionsViaFocus = focus;
}
/*
*   Focus permission getter
*/
Command.prototype.getFocusPermission = function(){
    return this.permissionViaFocus;
}
/*  Link command setter
*
*/
Command.prototype.setCommand = function(command){
    this.link = command;
}
/*
*   Link command getter
*/
Command.prototype.getCommand = function(){
    return this.link;
}
/*
*   Sets the tree context permission. 
*   You can define more than one tree context
*/
Command.prototype.setPermissionsViaContext = function(permissions){
    for(var i=0;i<permissions.length;i++){
        this.permissionsViaContext.push(permissions[i]);
    }
}
/*
*   Context permission getter
*/
Command.prototype.getPermissionsViaContext = function(){
    return this.permissionsViaContext;
}
/*
*   Checks whether the event has permission based on focus
*/
Command.prototype.hasFocusPermission = function(focus){
    if(this.getFocusPermission() == focus){
        return true;
    }
    return false;;
}
/*
*   Checks whether the event has permission based on context
*/
Command.prototype.hasContextPermission = function(){
    for(var i=0; i<this.permissionsViaContext.length;i++){
        if(voidappstart.tree.context == this.permissionsViaContext[i]){
            return true;
        }
    }
    return false;
}
/*
*   enumerations for to-do list context
*   the context is used for enabling/disabling
*   the operations on tasks. 
*   (for example, when it is read context,
*   you cannot add new task and so on ..) 
*/
function EnumContext(){
    this.read = "read";
    this.write = "write";
    this.empty = "empty";
}
/*
*   enumerations for task's priority 
*	'low' colors the task in blue
*	'middle' colors the task in yellow
*	'high' colors the task in red
*/
function EnumPriority(){
	this.low = "low";
	this.middle = "middle";
	this.high = "high";
}
/*
*   enumerations for task's status
*	'active' task is always shown  
*	'closed' is used for show/hide taks 
*/
function EnumStatus(){
	this.active = "active";
	this.closed = "closed"
}
/*
*	It is used for visability of the task index
*/
function Index(){
    this._isVsibile = true;
}
/*
*	Getter of _isVsibile
*/
Index.prototype.isVisible = function(){
    return this._isVsibile;
}
/*
*	Setter of _isVsibile
*/
Index.prototype.setVisability = function(visible){
    this.isVisible = visible;
}
/*
*	Gets the visability for the html element
*/
Index.prototype.getVisability = function(){
    if(this.isVisible){
		return ""
	}else{
		return "display:none";
	}
}
/*
*	It is used for setting the selected priority in the created task
*	and hide/show the priority in the 'new task template'
*/
function Priority(){
	this.low = "";
	this.middle = "";
	this.high = "selected";
	this._isVisible = true;
}
/*
*	It sets which priority is selected and this 
*	priority is used in the dropdown priority menu.
*/
Priority.prototype.setPriority = function(priority){
	if(priority == voidappstart.enumPriority.middle){
		this.middle = "selected";
		this.high = "";
		this.low = "";
	} else if(priority == voidappstart.enumPriority.high){
		this.high = "selected";
		this.low = "";
		this.middle = "";
	}else if(priority == voidappstart.enumPriority.low){
		this.low = "selected";
		this.high = "";
		this.middle ="";
	}
};
/*
*	this._isVisible getter
*/
Priority.prototype.isVisible = function(){
	return this._isVisible;
};
/*
*	It sets the visability of the dropdown priority menu.
*/
Priority.prototype.setVisability = function(isVisible){
	this._isVisible = isVisible;
};
/*
*	It gets the visability for the dropdown priority menu.
*/
Priority.prototype.getVisability = function(){
	if(this.isVisible()){
		return ""
	}else{
		return "display:none";
	}
};
/*
*	It is used for setting the selected status in the created task
*	and hide/show the priority in the 'new task template'.
*/
function Status(){
	this.active = "selected";
	this.closed = "";
	this._isVisible = true;
}
/*
*	this._isVisible getter
*/
Status.prototype.isVisible = function(){
	return this._isVisible;
};
/*
*	It sets whether the status dropdown is visible
*	in the template for new task.
*/
Status.prototype.setVisability = function(isVisible){
	this._isVisible = isVisible;
};
/*
*	Gets the visability for the dropdown status menu.
*/
Status.prototype.getVisability = function(){
	if(this.isVisible()){
		return ""
	}else{
		return "display:none";
	}
};
/*
*	It sets which status is selected and this 
*	status is used in the dropdown status menu.
*/
Status.prototype.setStatus = function(status){
	if(status == voidappstart.enumStatus.active){
		this.active = "selected";
		this.closed ="";
	}else if(status == voidappstart.enumStatus.closed){
		this.active = "";
		this.closed ="selected";
	}
};
/*
*	It is used for operations on task in the tree structure,
*	not in the DOM structure.
*/
function Task(description, priority, status, parentTask, index) {
	this.index = index;
	this.description = description;
	this.priority = priority;
	this.status = status;
	this.parent = parentTask;
	this.children = [];
}
/*
*	It returns the whole (with nested indexes) index
*	of the task. For example, 1.2.3 and so on.
*/
Task.prototype.getTaskIndex = function(){
	var tmpTask = this;
	var taskIndex = "";
	while(typeof(tmpTask) !== 'undefined' && typeof(tmpTask.index) !== 'undefined'){
		taskIndex += tmpTask.index + ".";
		tmpTask = tmpTask.parent;
	}
	var result = taskIndex.split('.').reverse().join('.');
	return result.substring(1);
};
/*
*	It finds what is the own position in the parent children
*/
Task.prototype.findTaskPositionInParentChildren = function(){
	var index = null;
	for(var i=0;i<this.parent.children.length;i++){
		if(this == this.parent.children[i]){
			index = i;
			break;
		}
	}
	return index;
};
/*
*	It sets its own index based on the own the position in 
*	the parent children.
*/
Task.prototype.setTaskIndexByPositionInParrentArray = function(){
	var index = this.findTaskPositionInParentChildren();
	if(index != null){
		index++;
		this.index = index;
	}
};
/*
*	It checks whether it has children 
*/
Task.prototype.hasChildren = function(tree){
	if(this.children.length > 0){
		return true;
	}
	return false;
};
/*
*	It checks whether the task exist
*/
Task.prototype.isExist = function(){
	if(this == null){
		return false;
	}
	return true;
};
/*
*	It keeps functions for the html task element
*/
function TaskDOMElement(element, tree){
	this.element = element || null;
	this.pointerOfDOMElementWhileChangingIndexes = null;
	this.isFirstTaskDOMElement = null;
	this.hasFocus = false;
	this.tree = tree;
}
/*
*	Sets the input focus with KEY command
*/
TaskDOMElement.prototype.setActivInput = function(){
	this.hasFocus = true;
	var inputElement = $(this.element).find(voidappstart.paths.taskDescription);
	setTimeout(function(){ inputElement.focus() }, 200);
};
/*
*	Unsets the input focus with KEY command
*/
TaskDOMElement.prototype.removeFocusFromInput = function() {
	this.hasFocus = false;
	if(this.element != null){
		var byName = document.activeElement.localName + "[name="+ document.activeElement.name+"]";
		$(this.element).find(byName).blur();
	}
};
/*
*	It currently sets the background of the current 
*	task in grey
*/
TaskDOMElement.prototype.color = function(){
	if(this.element != null){
		$(this.element).addClass(voidappstart.paths.cssClassActive);
	}
};
/*
*	Uncolors all elements and then colors the 
*	new one.
*/
TaskDOMElement.prototype.setNewElement = function(element){
	this.uncolorAll();
	this.setElement(element);
	this.color();
};
/*
*	Return the element background in white.
*/
TaskDOMElement.prototype.uncolorAll = function(){
	$(voidappstart.paths.focusElement).removeClass(voidappstart.paths.cssClassActive);
};
/*
*	this.element getter
*/
TaskDOMElement.prototype.getElement = function(){
	return this.element;
}
/*
*	It looks for exising element in the UP direciton.
*	It also omits the closed tasks when it is read context.
* 	It is used for setting current active element, which it is
* 	displayed in grey.
*/
TaskDOMElement.prototype.searchPrevActiveElement = function(direction){
	if(direction == "up"){
		var element = this.getPrevNeighbourElement();
		while(isDOMElementExist(element)){
			var isTaskVisible = $(element).is(':visible');
			var isTaskActive = ($(element).find(voidappstart.paths.taskStatus).val() == voidappstart.enumStatus.active);
			if((isTaskVisible || isTaskActive) ||
					this.tree.context == voidappstart.enumContext.write){
				this.setElement(element);
				return true;
			}
			element = $(element).prev();
		}
	}
	return false;
}
/*
*	It looks for exising element in the DOWN direciton.
*	It also omits the closed tasks when it is read context
* 	It is used for setting current active element, which it is
* 	displayed in grey.
*/
TaskDOMElement.prototype.searchNextActiveElement = function(direction){
	if(direction == "down"){
		var element = this.getNextNeighbourElement();
		while(isDOMElementExist(element)){
			//varisShowMode = (this.tree.areClosedTaskHidden) && (voidappstart.enumContext.read == this.tree.context);
			var isTaskVisible = $(element).is(':visible');
			var isTaskActive = ($(element).find(voidappstart.paths.taskStatus).val() == voidappstart.enumStatus.active);
			if((isTaskVisible || isTaskActive) ||
				 	this.tree.context == voidappstart.enumContext.write){
				this.setElement(element);
				return true;
			}
			element = $(element).next();
		}
	}
	return false;
}
/*
*	Checks first for existing element in the up direction 
*	and if it can't find one, start looking in the opposite
*	direction.
*	If there is a match, it colors the element and the colored
*	element is the current.
*/
TaskDOMElement.prototype.selectNextElement = function(direction){
	this.uncolorAll();
	var isThereElement = false;
	if(direction == "up"){
		this.searchPrevActiveElement(direction);
	}
	if(direction == "down"){
		this.searchNextActiveElement(direction);
	}
	this.color();	
	

};
/*
*	Gets the task index which is contained in nested
* 	element of the task element
*/
TaskDOMElement.prototype.getIndex = function(){
	var taskIndex = $(this.element).find(voidappstart.paths.taskindex);
	var indexes = taskIndex.text().split('.');
	return indexes;
};
/*
*	It removes all the children elements of task based
*	on the indexes. 
*/
TaskDOMElement.prototype.removeChildren = function(){
	var parentIndexes = this.getIndex();
	var tmpElement = new TaskDOMElement($(this.element).next());
	while(tmpElement.isExist() && tmpElement.getIndex().length > parentIndexes.length){
		deletePointer = tmpElement.element;
		tmpElement.setElement(tmpElement.getNextNeighbourElement());
		deletePointer.remove();
	}
};
/*
*	Checks first for existing element in the up direction 
*	and if it can't find one, start looking in the opposite
*	direction.
*	If there is a match, it colors the element and the colored
*	element is the current.
*/
TaskDOMElement.prototype.selectNewOne = function(){
	var isThereElement = false;

	isThereElement = this.searchPrevActiveElement("up");
	if(isThereElement == false){
		isThereElement = this.searchNextActiveElement("down");
	}
	if(isThereElement){
		this.color();	
	}
};
/*
*	It selects new element, first checks up, then down.
*	Here there are no context or already hidden tasks.
*	This fuctions is only in write context.
*/
TaskDOMElement.prototype.removeCurrentElementAndSelectNewOne = function(){
	var nextElement = this.getNextNeighbourElement();
	if(isDOMElementExist(nextElement)){
		this.removeElement();
		this.setElement(nextElement);
		this.color();
	} else{
		prevElement = this.getPrevNeighbourElement();
		if(isDOMElementExist(prevElement)){
			this.removeElement();
			this.setElement(prevElement);
			this.color();
		}else{
			this.removeElement();
			this.setElement(null);
		}
	}
};
/*
*	It is used for foreaching all dom elements of the tree
*/
TaskDOMElement.prototype.stepThroughNextElement = function(){
	if(this.isFirstTaskDOMElement){
		this.pointerOfDOMElementWhileChangingIndexes =  $(voidappstart.paths.newTasks).first();
		this.isFirstTaskDOMElement = false;
	} else{
		this.pointerOfDOMElementWhileChangingIndexes = this.pointerOfDOMElementWhileChangingIndexes.next();
	}
	return this.pointerOfDOMElementWhileChangingIndexes;
};
/*
*	It is used for foreaching all dom elements of the tree
*/
TaskDOMElement.prototype.findMatchingTreeTask = function(root){
	var task = null;
	if(this.isExist()){
		var indexes = this.getIndex();
		var task = root;
		var counter = 0;
		while(counter != indexes.length){
			task = task.children[indexes[counter]-1];
			counter++;
		}
	}
	return task;
};
/*
*	Checks whether the element is initialized.
*/
TaskDOMElement.prototype.isExist = function(){
	if(this.element == null || this.element.length == 0){
		return false
	}
	return true;
};
/*
*	Add new element based on template.
*	Currently the template is not easily changeble.
*/
TaskDOMElement.prototype.addElement = function(treeTask){

	this.tree.status.setStatus(treeTask.status);
	this.tree.priority.setPriority(treeTask.priority);
	
	var template = [{
		// index section
		indexVisability : this.tree.index.getVisability(),
		index: treeTask.getTaskIndex(),
		// description section
		defaultText: treeTask.description,
		// priority section
		highPrioritySelected : this.tree.priority.high,
		middlePrioritySelected : this.tree.priority.middle,
		lowPrioritySelected : this.tree.priority.low,
		priorityVisability : this.tree.priority.getVisability(),
		// status section
		activeSelected : this.tree.status.active,
		closedSelected : this.tree.status.closed,
		statusVisability : this.tree.status.getVisability()
	}];
	
	if(this.isExist()){
		$(this.element).after($("#TaskTemplate").tmpl(template));
		this.selectNextElement("down");

	}else{
		this.setElement($("#TaskTemplate").tmpl(template).appendTo('#FutureTasks'))
	}
};
/*
*	this.element setter
*/
TaskDOMElement.prototype.setElement = function(element){
	this.element = element || null;
};
/*
*	Gets the previous element
*/
TaskDOMElement.prototype.getNextNeighbourElement = function(){
	if(this.isExist()){
		 return $(this.element).next();
	}
};
/*
*	Gets the next element
*/
TaskDOMElement.prototype.getPrevNeighbourElement = function(){
	if(this.isExist()){
		 return $(this.element).prev();
	}
};
/*
*	Removes task element
*/
TaskDOMElement.prototype.removeElement = function(){
	if(this.isExist){
		$(this.element).remove();
	}
};
/*
*	It is used for writing values from html structure
*	in the js tree 
*/
TaskDOMElement.prototype.writeChangesToTreeTask = function(root){
	
	var inputElement = $(this.element).find(voidappstart.paths.taskDescription);
	var selectStatusElement = $(this.element).find(voidappstart.paths.taskStatus);
	var selectPriorityElement = $(this.element).find(voidappstart.paths.taskPriority);

	var task = this.findMatchingTreeTask(root);
	task.description = inputElement.val();
	task.priority = selectPriorityElement.val();
	task.status = selectStatusElement.val();
};
/*
*	Select the element if the current is closed
*/
TaskDOMElement.prototype.selectNewOneIfItIsClosed = function(){
	if(this.tree.context == voidappstart.enumContext.read){
		if($(this.element).find(voidappstart.paths.taskStatus).val() ==  voidappstart.enumStatus.closed){
			 this.selectNewOne();
		}
	}
};
/*
*	It contains all tasks. 
*	It supports deleting, adding, inserting and so on.
*	By default it creates a root task element.
*	This element serves as a model - default settings like status 
*	and priority are taken from there.
*/
function Tree(description, priority, status, parentTask,index, context) {
	var task = new Task(description, priority, status, parentTask, index);
	this._root = task;
	this.currentParent = null;
	this.currentDOMElement = new TaskDOMElement(null, this);
	this.isFirstTask = true;
	this.priority = new Priority();
	this.status = new Status();
	this.index = new Index();
	this.countNodes = 0;
	this.context = context;
	this.isFocusOnInput = false;
	this.initContext();
	this.refreshDOMCounter();
	this.areClosedTaskHidden = true;
}
/*
*	_root element is a model of all tasks.
*	It contains all default settings.
*/
Tree.prototype.setDefaultStatus = function(status){
	this._root.status = priority;
};
/*
*	_root element is a model of all tasks.
*	It contains all default settings.
*/
Tree.prototype.setDefaultPriority = function(priority){
	this._root.priority = priority;
};
/*
*	This function is called when user clicks on 'hide/show closed tasks'
*	It checks previous state and based on it hide or show closed tasks.
*	And do it coditionally - context, exisitng elements.
*/
Tree.prototype.setVisabilityOfClosedTasks = function(){
	if(this.areClosedTaskHidden){
		this.areClosedTaskHidden = false;
		$(voidappstart.paths.focusElement).removeClass(voidappstart.paths.cssClassActive);
		$(voidappstart.paths.focusElement).show();
		this.currentDOMElement.color();
	} else{
		this.areClosedTaskHidden = true;
		var elements = $(voidappstart.paths.focusElement).find(voidappstart.paths.taskStatus);
		for(var i=0;i< elements.length;i++){
			if($(elements[i]).val() == voidappstart.enumStatus.closed){
				$(elements[i]).closest(voidappstart.paths.focusElement).hide();
			}
		}
		this.currentDOMElement.selectNewOneIfItIsClosed();
	}
}
/*
*	Hide task if user closes it .
*/
Tree.prototype.hideIfClosed = function(element){
	var status = $(element).find(voidappstart.paths.taskStatus).val();
	if(status == voidappstart.enumStatus.closed){
		$(element).hide();
		return true;
	}
	return false;
};
/*
*	Initialize the context of the tree.
*/
Tree.prototype.initContext = function(){
	if(this._root.hasChildren(this) == true){
		this.context = voidappstart.enumContext.read;
	}else{
		this.context = voidappstart.enumContext.empty;
	}
	this.setDOMContext();
};
/*
*	Set context and do all related stuff like display refreshing.
*/
Tree.prototype.setContext = function(context){
	this.context = context;
	this.setDOMContext();
	this.changeElementsBasedOnContext();
};
/*
*	Refresh the display based on the contex
*/
Tree.prototype.setDOMContext = function(){
	$("#context").html(this.context);
};
/*
*	Swich context between read and write.
*	If there are no tasks = empty context
*/
Tree.prototype.switchContext = function(){
	if(this.context == voidappstart.enumContext.write){
		this.setContext(voidappstart.enumContext.read);
	}else if(this.context == voidappstart.enumContext.read){
		this.setContext(voidappstart.enumContext.write);
	}

	if(this._root.children.length == 0){
		this.setContext(voidappstart.enumContext.empty);
	}
};
/*
*	Context getter
*/
Tree.prototype.getContext =  function(){
	return this.context;
};
/*
*	Context checker
*/
Tree.prototype.isContext = function(context){
	if(context == this.context){
		return true;
	}
	return false;
};
/*
*	Change heading to red/blue/yellow/grey of task elements
*	based on the context and also disable them if it is 'read' context
*	Select new task if current is closed and so on.
*/
Tree.prototype.changeElementsBasedOnContext = function(){

	var firstDOMItem = $("#FutureTasks "+voidappstart.paths.focusElement).first();
	while(firstDOMItem.length > 0){
		
		if(this.context == voidappstart.enumContext.read){
			this.enableInputsOnTaskDOMElement(firstDOMItem, true);
			this.colorDOMElementBasedOnPriority(firstDOMItem);
			this.hideIfClosed(firstDOMItem);
			if((this.currentDOMElement.getElement())[0] == (firstDOMItem)[0]){
				firstDOMItem.addClass(voidappstart.paths.cssClassActive);
			}

		}else if(this.context == voidappstart.enumContext.write){
			this.enableInputsOnTaskDOMElement(firstDOMItem, false);
			firstDOMItem.show();
			firstDOMItem.removeClass();
			if((this.currentDOMElement.getElement())[0] == (firstDOMItem)[0]){
				firstDOMItem.addClass(voidappstart.paths.cssActiveTask);
			}else{
				firstDOMItem.addClass(voidappstart.paths.cssInActiveTask);
			}
		}
		firstDOMItem = firstDOMItem.next();
	}
	this.currentDOMElement.selectNewOneIfItIsClosed();
};
/*
*	Change the heading to red/yellow/blue based on priority
*/
Tree.prototype.colorDOMElementBasedOnPriority = function(element){
	var priority = $(element).find(voidappstart.paths.taskPriority).val();
	$(element).removeClass();
	if(priority == voidappstart.enumPriority.low){
		$(element).addClass(voidappstart.paths.cssLowPriorityTask);
	} else if(priority == voidappstart.enumPriority.middle){
		$(element).addClass(voidappstart.paths.cssMiddlePriorityTask);
	}else if(priority == voidappstart.enumPriority.high){
		$(element).addClass(voidappstart.paths.cssHighPriorityTask);
	}
};
/*
*	Enables or disables the input based on the given parameter
*/
Tree.prototype.enableInputsOnTaskDOMElement = function(element, isEnabled){
	$(element).find(voidappstart.paths.taskDescription).prop("disabled", isEnabled);
	$(element).find(voidappstart.paths.taskPriority).prop("disabled", isEnabled);
};
/*
*	Delete task and its children if has user permission.
*/
Tree.prototype.deleteTask = function(){
	if(this._root.hasChildren(this) == false){
		this.context = voidappstart.enumContext.empty;
		return;
	} else{
		var currentTask = this.currentDOMElement.findMatchingTreeTask(this._root);
		if(currentTask.isExist()){
			if(currentTask.hasChildren()){
				var result = confirm('Deleting this task will delete its sub task too. Are you sure?');
				if(result == false){
					return;
				}
			}
			var position = currentTask.findTaskPositionInParentChildren();
			currentTask.parent.children.splice(position,1);
			
			this.currentDOMElement.removeChildren();
			this.currentDOMElement.removeCurrentElementAndSelectNewOne();
			this.refreshTaskIndexes();
		}

	}
	if(this._root.hasChildren() == false){
		this.context = voidappstart.enumContext.empty;
	}
};
/*
*	Refreshes displayed element that contains the count of elements
*/
Tree.prototype.refreshDOMCounter = function(){
	$('#counter').html(this.countNodes);
};
/*
*	Create a new task by ready template.
*	No easy change if you want to put your own template.
*/
Tree.prototype.createNewTask = function (){
	var currentTask = this.currentDOMElement.findMatchingTreeTask(this._root);
	var newTaskPosition = null;
	if(currentTask == null){
		currentTask = this._root;
		this.currentParent = undefined;
		newTaskPosition = this._root.children.length;
	}else{
		this.currentParent = currentTask.parent;
		if(this.currentParent.children.length === currentTask.index){
			newTaskPosition = this._root.children.length;

		}else{
			newTaskPosition = currentTask.index - 1;
		}
	}

	if(this.currentParent == null){
		this.currentParent = currentTask;
	}

	currentNode = new Task(this._root.description,
							this._root.priority,
							this._root.status,
							this.currentParent,
							newTaskPosition+1);
	this.currentParent.children.insert(newTaskPosition, currentNode);
	this.currentParent = currentNode.parent;

	this.currentDOMElement.addElement(currentNode);
	this.refreshTaskIndexes();
	this.setContext(voidappstart.enumContext.write);
	
};
/*
*	Create sub task
*/
Tree.prototype.createSubTask = function (){
	if(this._root.hasChildren() == false){
		this.context = voidappstart.enumContext.empty;
		return;
	} else{
		var currentTask = this.currentDOMElement.findMatchingTreeTask(this._root);
		if(currentTask == null){
			currentTask = this._root;
		}
		currentNode = new Task(this._root.description,
								this._root.priority,
								this._root.status,
								currentTask,
								currentTask.children.length+1);
		currentTask.children.push(currentNode);

		this.currentParent = currentTask.parent;
		this.currentDOMElement.addElement(currentNode);
		this.refreshTaskIndexes();
	}
};
/*
*	On every creation or when a task is deleted, the 
*	indexes are refreshed.
*/
Tree.prototype.refreshTaskIndexes = function(startElement){
		this.countNodes = 0;

		this.currentDOMElement.pointerOfDOMElementWhileChangingIndexes = null;
		this.currentDOMElement.isFirstTaskDOMElement = true;

		if(typeof(startElement) === 'undefined'){
			startElement = this._root;
		}
		this.refreshIndexes(startElement);
		this.refreshDOMCounter();
};
/*
*	On every creation or when a task is deleted, the 
*	indexes are refreshed.
*/
Tree.prototype.refreshIndexes = function(element){
	if(element.index != undefined){
		var task = this.currentDOMElement.stepThroughNextElement();
		element.setTaskIndexByPositionInParrentArray();
		task.find(voidappstart.paths.taskindex).html(element.getTaskIndex());
		this.countNodes++;
	}
	for(var i=0;i<element.children.length;i++){
			this.refreshIndexes(element.children[i]);
	}
};
/*
*	The tree object is converted to JSON in order to be 
*	send to the user.
*/
Tree.prototype.convertToText = function(){
	var seen = [];
	var jsonString = JSON.stringify(this._root, function(key, val) {
   		if (val != null && typeof val == "object") {
        	if (seen.indexOf(val) >= 0) {
            	return;
        	}
        	seen.push(val);
    	}
    	return val;
	});
	return jsonString;
};
/*
*	The json string of tree object is downloaded from here.
*/
Tree.prototype.downloadAsTxtFile = function(){
	var link = document.createElement("a");
    link.setAttribute("target","_blank");
    if(Blob !== undefined) {
        var blob = new Blob([this.convertToText()], {type: "text/plain"});
        link.setAttribute("href", URL.createObjectURL(blob));
    } else {
        link.setAttribute("href","data:text/plain," + encodeURIComponent(text));
    }
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var fileName = day + "-" + month + "-" + date.getFullYear();
    link.setAttribute("download","stdl_" +fileName);
    document.body.appendChild(link);
    link.click();
};
/*
*	Read the uploaded from the user text file that contains json string
*/
Tree.prototype.restoreFromTextFile = function(event){
	var input = event.target;
	var reader = new FileReader();
	reader.onload = function(){
      voidappstart.tree.clear();				
	  var jsonObj = JSON.parse(reader.result);
	  var newRootTask = new Task("", voidappstart.enumPriority.low, voidappstart.enumStatus.active,undefined,undefined);
	  voidappstart.tree.restoreFromJsonObject(jsonObj, newRootTask,newRootTask);
	  voidappstart.tree._root = newRootTask;
	  voidappstart.tree.createDOMTree(newRootTask);
	  voidappstart.tree.context = voidappstart.enumContext.write;
	  voidappstart.tree.countNodes--;
	  voidappstart.tree.refreshDOMCounter();
	  voidappstart.treeManager.setHowToUseKeysInstructions(voidappstart.tree.context, "false");
	};
	reader.readAsText(input.files[0]);
 
};
/*
*	Restores the tree object by downloaded json string.
*/
Tree.prototype.restoreFromJsonObject = function(element, buildingNewTreeElement, parent){

	if(typeof(element) !== 'undefined'){
		this.countNodes++;
		for(var i=0;i<element.children.length;i++){
				var childTask = new Task(element.children[i].description,
										element.children[i].priority,
										element.children[i].status,
										parent,
										element.children[i].index);
				buildingNewTreeElement.children.push(childTask);
				this.restoreFromJsonObject(element.children[i], childTask, childTask);
		}
	}
};
/*
*	It clears all the elements created by user.
*/
Tree.prototype.clear = function(omitCheck){

	if(this._root.hasChildren(this) == false){
		this.context = voidappstart.enumContext.empty;
		return;
	}
	if(omitCheck == false){
		var result = confirm('You are about to clear all content. Are you sure?');
		if(result == false){
			return;
		}
	}
	$("#FutureTasks").empty();
	this.currentDOMElement.setElement(null);
	this.currentParent = undefined;
	this.setContext(voidappstart.enumContext.empty);
	this._root.children = [];
	this.countNodes = 0;
	this.refreshDOMCounter();

};
/*
*	When json string is uploaded by the user.
*	The DOM tree is created.
*/
Tree.prototype.createDOMTree = function(element){
	
	for(var i=0;i<element.children.length;i++){
			this.currentDOMElement.addElement(element.children[i]);
			this.createDOMTree(element.children[i]);
	}
};
/*
*	Custom functions added to array object
*	in order for easier manipulations on task's 
*	children and registering keys for events.
*/

/*
*	Used for removing one of the children 
*	of the parent task.
*/
Array.prototype.insert = function (index, item) {
	this.splice(index, 0, item);
};
/*
*	Used for key registering in the tree event keys
*/
Array.prototype.registerKeys = function(keys){
	for(var i=0;i< keys.length;i++){
		this.push(keys[i]);
	}
};
/*
*	Checks whether the array contains the item
*/
Array.prototype.contains = function(item){
	for(var i=0;i< this.length;i++){
		if(item == this[i]){
			return true;
		}
	}
	return false;
};
/*
*	Checks whether the html element exists
*/
function isDOMElementExist(element){
	if($(element).length >0){
		return true;
	}
	return false;
};
/*
*   Paths for finding html elements.
*   Used for better maintenance. 
*   If you want to change some element,
*   for example you want input instead of textarea,
*   change it here and in the html file, and
*   it will work. 
*/
function PathSettings(){
    this.headerElement = "div[name=headerFocus]";
    this.focusElement="div[name=newTasks]";
    this.activeElement="div[name=activeElement]";
    this.taskindex="span[name=index]" ;
    this.taskDescription="input[name=description]";
    this.taskStatus="select[name=taskStatus]";
    this.taskPriority="select[name=taskPriority]";
    this.newTasks="div[name=newTasks]";
    this.cssActiveTask = "panel panel-default new-task-active";
    this.cssInActiveTask = "panel panel-default";
    this.cssHighPriorityTask = "panel panel-danger";
    this.cssLowPriorityTask = "panel panel-info";
    this.cssMiddlePriorityTask = "panel panel-warning";
    this.cssClassActive = "new-task-active";
}
// application namespace
var voidappstart = {};

$(voidappstart).ready(function() {

	// declare enumerations in main namespace
	voidappstart.enumStatus = new EnumStatus();
	voidappstart.enumPriority = new EnumPriority();
	voidappstart.enumContext = new EnumContext();
	
	// paths settings already contains used paths for finding html elements 
	voidappstart.paths = new PathSettings();

	voidappstart.tree = new Tree("", 
								voidappstart.enumPriority.low, 
								voidappstart.enumStatus.active,
								undefined,
								undefined);

	// the commented lines shows you the available options 
	// for manipulating the global tree settings

	// voidappstart.tree.priority.setPriority(voidappstart.enumPriority.low);
	// voidappstart.tree.status.setStatus(voidappstart.enumStatus.active);
	//voidappstart.tree.status.setVisability(true);
	//voidappstart.tree.priority.setVisability(true);
	// voidappstart.tree.index.setVisability(true);
	
	voidappstart.treeManager = new TreeManager();

	// create and initilize the events 
	voidappstart.createNewTaskEvent();
	voidappstart.createDeleteEvent();
	voidappstart.createSubTaskEvent();
	voidappstart.createSetFocusEvent();
	voidappstart.createClearEvent();
	voidappstart.createUpMovementEvent();
	voidappstart.createDownMovementEvent();
	voidappstart.createSwitchContextEvent();
	voidappstart.createClosedTaskEvent();
	voidappstart.createStoreListEvent();
	voidappstart.createRestoreListEvent();
	voidappstart.createTabEvent();
	
	document.onkeydown = voidappstart.treeManager.recognizeEvent;
	voidappstart.setActiveTaskByActiveInput = voidappstart.treeManager.setActiveElement;
	voidappstart.setVisability = voidappstart.treeManager.setVisabilityOfTask;
	voidappstart.treeManager.setHowToUseKeysInstructions(voidappstart.tree.context, "false");

	voidappstart.displayMessageIfItIsNotChrome(); 
});

/*
*	Creation of events managed by tree manager
*	The functions below will show you an example 
*	how to create your own tree event. More info you 
*	can view in the definitions of treevent, command 
*	and howtouse classes.
*/
var voidappstart = {
	/*
	*	It only works in Chrome. Deal with it.
	*/
	displayMessageIfItIsNotChrome : function(){
		var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
		var isChrome = !!window.chrome && !isOpera;
		if(isChrome){	
			$("#infoMessageForBrowserSupport").hide();
		}else{
			$("#infoMessageForBrowserSupport").show();
		}
	},
 	createTabEvent: function(){
		var tabEvent = new TreeEvent();
		//var command = new Command(true, [voidappstart.enumContext.empty,voidappstart.enumContext.read,voidappstart.enumContext.write], voidappstart.tree.restoreFromJsonObject, voidappstart.tree );

		var howToUseTabKeys =[];
		howToUseTabKeys.push(new HowToUse([voidappstart.enumContext.write], "true", "Press 'TAB' to select next input element"));
		howToUseTabKeys.push(new HowToUse([voidappstart.enumContext.write], "true", "Press 'TAB' + 'SHIFT' to select previous input element"));

		var tabKeyCodes = [9];

		tabEvent.registerKeys(tabKeyCodes, howToUseTabKeys);
		//tabEvent.pushCommand(command);

		voidappstart.treeManager.addEvent(tabEvent);
	},

 	createRestoreListEvent : function(){
		var templateForUploadButtonName  = "#UploadButtonTemplate";
		var restoreEvent = new TreeEvent(templateForUploadButtonName);
		
		var command = new Command(false, [voidappstart.enumContext.empty,voidappstart.enumContext.read,voidappstart.enumContext.write], voidappstart.treeManager.showOpenFileDialog, voidappstart.treeManager );

		var howToUseRestoreListKeys =[];
		howToUseRestoreListKeys.push(new HowToUse([voidappstart.enumContext.empty,voidappstart.enumContext.read,voidappstart.enumContext.write], "false", "Press 'R' or 'r'' to restore list from the local drive.", "(R)estore"));
		var restoreListCodes = new Array(82,114);

		restoreEvent.registerKeys(restoreListCodes, howToUseRestoreListKeys);
		restoreEvent.pushCommand(command);

		voidappstart.treeManager.addEvent(restoreEvent);
	},
	createStoreListEvent : function(){
		var storeEvent = new TreeEvent();
		var command = new Command(false, [voidappstart.enumContext.read,voidappstart.enumContext.write], voidappstart.tree.downloadAsTxtFile, voidappstart.tree );

		var howToUseStoreListKeys =[];
		howToUseStoreListKeys.push(new HowToUse([voidappstart.enumContext.read,voidappstart.enumContext.write], "false", "Press 'B' or 'b' to store list on the local drive.", "(B)ackup"));
		var storeListCodes = new Array(66,98);

		storeEvent.registerKeys(storeListCodes, howToUseStoreListKeys);
		storeEvent.pushCommand(command);

		voidappstart.treeManager.addEvent(storeEvent);
	},

	createClosedTaskEvent : function(){
		var closedEvent = new TreeEvent();
		var command = new Command(false, [voidappstart.enumContext.read], voidappstart.tree.setVisabilityOfClosedTasks, voidappstart.tree );

		var howToUseClosedTaskKeys = [];
		howToUseClosedTaskKeys.push(new HowToUse([voidappstart.enumContext.read], "false", "Press 'H' or 'h' to show/hide closed task .", "S(h)ow/Hide the closed tasks"));
		var closedTaskCodes = [72,104];

		closedEvent.registerKeys(closedTaskCodes, howToUseClosedTaskKeys);
		closedEvent.pushCommand(command);

		voidappstart.treeManager.addEvent(closedEvent);
	},
	createSwitchContextEvent: function (){
		var switchEvent = new TreeEvent();
		var command = new Command(false, [voidappstart.enumContext.write,voidappstart.enumContext.read], voidappstart.tree.switchContext, voidappstart.tree );

		var howToUseSwitchKeys = [];
		howToUseSwitchKeys.push(new HowToUse([voidappstart.enumContext.write], "false", "Press 'W' or 'w' to switch context to 'read'.", "S(w)itch to 'read'"));
		howToUseSwitchKeys.push(new HowToUse([voidappstart.enumContext.read], "false", "Press 'W' or 'W' to switch context to 'write'.", "S(w)itch to 'write'"));

		var switchKeyCodes = new Array(87,129);
		switchEvent.registerKeys(switchKeyCodes, howToUseSwitchKeys);
		switchEvent.pushCommand(command);

		voidappstart.treeManager.addEvent(switchEvent);
	},
	createDownMovementEvent : function(){
		var downEvent = new TreeEvent();
		var command = new Command(false, [voidappstart.enumContext.write,voidappstart.enumContext.read], voidappstart.tree.currentDOMElement.selectNextElement, voidappstart.tree.currentDOMElement, "down");

		var howToUseDownKeys = [];
		howToUseDownKeys.push(new HowToUse([voidappstart.enumContext.write, voidappstart.enumContext.read], "false", "Press the arrow Down to move forwards.", "Select the next task (arrow down)"));

		var downKeyCodes = [40];
		downEvent.registerKeys(downKeyCodes, howToUseDownKeys);
		downEvent.pushCommand(command);

		voidappstart.treeManager.addEvent(downEvent);
	},
	createUpMovementEvent :function (){
		var upEvent = new TreeEvent();

		var command = new Command(false, [voidappstart.enumContext.write,voidappstart.enumContext.read], voidappstart.tree.currentDOMElement.selectNextElement, voidappstart.tree.currentDOMElement, "up");

		var howToUseUpKeys = [];
		howToUseUpKeys.push(new HowToUse([voidappstart.enumContext.write, voidappstart.enumContext.read], "false", "Press the arrow Up to move backwards.", "Select the previous task (arrow up)"));

		var upKeyCodes = [38];
		upEvent.registerKeys(upKeyCodes, howToUseUpKeys);
		upEvent.pushCommand(command);

		voidappstart.treeManager.addEvent(upEvent);
	},
	createClearEvent :function (){
		var clearEvent = new TreeEvent();

		var command = new Command(false, [voidappstart.enumContext.write,voidappstart.enumContext.read], voidappstart.tree.clear, voidappstart.tree, false);

		var howToUseClearKeys = [];
		howToUseClearKeys.push(new HowToUse([voidappstart.enumContext.write, voidappstart.enumContext.read], "false", "Press 'C' or 'c' to clear all created tasks.", "(C)lear the list"));
		var clearCodes = [67,99];

		clearEvent.registerKeys(clearCodes, howToUseClearKeys);
		clearEvent.pushCommand(command);

		voidappstart.treeManager.addEvent(clearEvent);
	},

	createSetFocusEvent : function(){
		var setFocusEvent = new TreeEvent();

		var commandSetActivInput = new Command(false, [voidappstart.enumContext.write], voidappstart.tree.currentDOMElement.setActivInput, voidappstart.tree.currentDOMElement);
		var commandRemoveActivInput = new Command(true, [voidappstart.enumContext.write, voidappstart.enumContext.empty], voidappstart.tree.currentDOMElement.removeFocusFromInput, voidappstart.tree.currentDOMElement);

		var howToUseEnterKeys = [];
		howToUseEnterKeys.push(new HowToUse([voidappstart.enumContext.write], "true", "Press Ctrl to lost focus from input."));
		howToUseEnterKeys.push(new HowToUse([voidappstart.enumContext.write], "false", "Press Ctrl to set focus on input.", " Set focus (Cntrl)"));

		var enterKeysCodes = [17];
		setFocusEvent.registerKeys(enterKeysCodes, howToUseEnterKeys);	
		setFocusEvent.pushCommand(commandSetActivInput);
		setFocusEvent.pushCommand(commandRemoveActivInput);


		voidappstart.treeManager.addEvent(setFocusEvent);
	},

	createNewTaskEvent : function (){
		var newTaskEvent = new TreeEvent();

		var command = new Command(false, [voidappstart.enumContext.write, voidappstart.enumContext.empty], voidappstart.tree.createNewTask, voidappstart.tree);

		var howToUseNewTaskKeys = [];
		howToUseNewTaskKeys.push(new HowToUse([voidappstart.enumContext.write,voidappstart.enumContext.empty], "false", "Press 'n' or 'N' to create a new task", "(N)ew task"));
		var newTaskKeyCodes = new Array(78,110);

		newTaskEvent.registerKeys(newTaskKeyCodes, howToUseNewTaskKeys);
		newTaskEvent.pushCommand(command);

		voidappstart.treeManager.addEvent(newTaskEvent);
	},

	createDeleteEvent :function(){
		var deleteEvent = new TreeEvent();

		var command = new Command(false, [voidappstart.enumContext.write], voidappstart.tree.deleteTask, voidappstart.tree);

		var howToUseDeleteKeys =[];
		howToUseDeleteKeys.push(new HowToUse([voidappstart.enumContext.write], "false", "Press 'D' or 'd' to delete a task.", "(D)elete current"));
		var deleteKeyCodes = new Array(68,100);

		deleteEvent.registerKeys(deleteKeyCodes, howToUseDeleteKeys);
		deleteEvent.pushCommand(command);

		voidappstart.treeManager.addEvent(deleteEvent);
	},

	createSubTaskEvent: function(){
		var subTaskEvent = new TreeEvent();
		var command = new Command(false, [voidappstart.enumContext.write], voidappstart.tree.createSubTask, voidappstart.tree);

		var howToUseSubTaskKeys = [];
		howToUseSubTaskKeys.push(new HowToUse([voidappstart.enumContext.write], "false", "Press 's' or 'S' to create a sub task.", "(S)ub task"))

		var subTaskKeyCodes = new Array(83,115);
		subTaskEvent.registerKeys(subTaskKeyCodes, howToUseSubTaskKeys);
		subTaskEvent.pushCommand(command);

		voidappstart.treeManager.addEvent(subTaskEvent);
	}
};
/*
*   It there are created tasks, it will automatically download 
* 	the tree on the local drive. It's a little annoying, but..
*/
$(window).bind('beforeunload',function(){
   voidappstart.treeManager.saveBeforeUnloadThePage();
   return 'We saved the list for you. Now you can restore it.';

});