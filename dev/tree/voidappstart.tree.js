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