/*
*	It contains all tasks. 
*	It supports deleting, adding, inserting and so on.
*	By default it creates a root task element.
*	This element serves as a model - default settings like status 
*	and priority are taken from there.
*/
function Tree(description, priority, status, parentTask,index, context, filter) {
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
	this.filter = filter;
}
Tree.prototype.setCharactersticsBasedOnFilter = function(){
	
	if(this.filter == stdl.enumFilter.closed){
		this.status.setStatus(stdl.enumStatus.closed);
	}
	if(this.filter == stdl.enumFilter.active){
		this.status.setStatus(stdl.enumStatus.active);
	}
	if(this.filter == stdl.enumFilter.high){
		this.priority.setPriority(stdl.enumPriority.high);
	}
	if(this.filter == stdl.enumFilter.middle){
		this.priority.setPriority(stdl.enumPriority.middle);
	}
	if(this.filter == stdl.enumFilter.low){
		this.priority.setPriority(stdl.enumPriority.low);
	}
}
Tree.prototype.getFilter = function(){
	return this.filter;
}
Tree.prototype.setFilter = function(filter){
	this.filter = filter;
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
		$(stdl.paths.focusElement).removeClass(stdl.paths.cssClassActive);
		$(stdl.paths.focusElement).show();
		this.currentDOMElement.setCurrent();
	} else{
		this.areClosedTaskHidden = true;
		var elements = $(stdl.paths.focusElement).find(stdl.paths.taskStatus);
		for(var i=0;i< elements.length;i++){
			if($(elements[i]).val() == stdl.enumStatus.closed){
				$(elements[i]).closest(stdl.paths.focusElement).hide();
			}
		}
		this.currentDOMElement.selectNewOneIfItIsClosed();
	}
}
/*
*	Hide task if user closes it .
*/
Tree.prototype.hideIfClosed = function(element){
	var status = $(element).find(stdl.paths.taskStatus).val();
	if(status == stdl.enumStatus.closed){
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
		this.context = stdl.enumContext.read;
	}else{
		this.context = stdl.enumContext.empty;
	}
	this.setDOMContext();
};
/*
*	Set context and do all related stuff like display refreshing.
*/
Tree.prototype.setContext = function(context){
	this.context = context;
	this.setDOMContext();
	//this.changeElementsBasedOnContext();
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
	if(this.context == stdl.enumContext.write){
		this.setContext(stdl.enumContext.read);
	}else if(this.context == stdl.enumContext.read){
		this.setContext(stdl.enumContext.write);
	}

	if(this._root.children.length == 0){
		this.setContext(stdl.enumContext.empty);
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

	var firstDOMItem = $("#FutureTasks "+stdl.paths.focusElement).first();
	while(firstDOMItem.length > 0){
		
		if(this.context == stdl.enumContext.read){
			this.enableInputsOnTaskDOMElement(firstDOMItem, true);
			this.colorDOMElementBasedOnPriority(firstDOMItem);
			this.hideIfClosed(firstDOMItem);
			if((this.currentDOMElement.getElement())[0] == (firstDOMItem)[0]){
				firstDOMItem.addClass(stdl.paths.cssClassActive);
			}

		}else if(this.context == stdl.enumContext.write){
			this.enableInputsOnTaskDOMElement(firstDOMItem, false);
			firstDOMItem.show();
			firstDOMItem.removeClass();
			if((this.currentDOMElement.getElement())[0] == (firstDOMItem)[0]){
				firstDOMItem.addClass(stdl.paths.cssActiveTask);
			}else{
				firstDOMItem.addClass(stdl.paths.cssInActiveTask);
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
	var priority = $(element).find(stdl.paths.taskPriority).val();
	$(element).removeClass();
	if(priority == stdl.enumPriority.low){
		$(element).addClass(stdl.paths.cssLowPriorityTask);
	} else if(priority == stdl.enumPriority.middle){
		$(element).addClass(stdl.paths.cssMiddlePriorityTask);
	}else if(priority == stdl.enumPriority.high){
		$(element).addClass(stdl.paths.cssHighPriorityTask);
	}
};
/*
*	Enables or disables the input based on the given parameter
*/
Tree.prototype.enableInputsOnTaskDOMElement = function(element, isEnabled){
	$(element).find(stdl.paths.taskDescription).prop("disabled", isEnabled);
	$(element).find(stdl.paths.taskPriority).prop("disabled", isEnabled);
};

/*
*	Delete task and its children if has user permission.
*/
Tree.prototype.deleteTask = function(){
	if(this._root.hasChildren(this) == false){
		this.context = stdl.enumContext.empty;
		return;
	} else{
		// deleting an invisible task is not permitted
		var elements = $(stdl.paths.focusVisibleElement);
		if(elements.length == 0){
			return;
		}

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
		this.context = stdl.enumContext.empty;
	}
};
/*
*	Refreshes displayed element that contains the count of elements
*/
Tree.prototype.refreshDOMCounter = function(){

	$('#count_all').html(this.countNodes);
	var count_active = 0;
	var count_closed = 0;
	var statusElements = $(stdl.paths.focusElement).find(stdl.paths.taskStatus);
	for(var i=0;i<statusElements.length;i++){
		if($(statusElements[i]).val() == stdl.enumStatus.closed){
			count_closed++;
		}else{
			count_active++;
		}
	}
	$('#count_active').html(count_active);
	$('#count_closed').html(count_closed);

	var count_high = 0;
	var count_low = 0;
	var count_middle = 0;

	var priorityElements = $(stdl.paths.focusElement).find(stdl.paths.taskPriority);
	for(var i=0;i<priorityElements.length;i++){
		var value = $(priorityElements[i]).val();
		if(value == stdl.enumPriority.high){
			count_high++;
		}else if(value == stdl.enumPriority.middle){
			count_middle++;
		}else if(value == stdl.enumPriority.low){
			count_low++;
		}
	}
	$('#count_high').html(count_high);
	$('#count_middle').html(count_middle);
	$('#count_low').html(count_low);

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
	this.setContext(stdl.enumContext.write);
	
};
/*
*	Create sub task
*/
Tree.prototype.createSubTask = function (){
	if(this._root.hasChildren() == false){
		this.context = stdl.enumContext.empty;
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
		task.find(stdl.paths.taskindex).html(element.getTaskIndex());
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
      stdl.tree.clear();				
	  var jsonObj = JSON.parse(reader.result);
	  var newRootTask = new Task("", stdl.enumPriority.low, stdl.enumStatus.active,undefined,undefined);
	  stdl.tree.restoreFromJsonObject(jsonObj, newRootTask,newRootTask);
	  stdl.tree._root = newRootTask;
	  stdl.tree.createDOMTree(newRootTask);
	  stdl.tree.context = stdl.enumContext.write;
	  stdl.tree.countNodes--;
	  stdl.tree.setFilter(stdl.enumFilter.all);
	  stdl.tree.refreshDOMCounter();
	  stdl.treeManager.setHowToUseKeysInstructions(stdl.tree.context, "false");
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
		this.context = stdl.enumContext.empty;
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
	this.setContext(stdl.enumContext.empty);
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
Tree.prototype.showAll = function(){
	var elements = $(stdl.paths.focusElement);
	elements.show();
	this.refreshDOMCounter();
};
Tree.prototype.showTasksBasedOnCharacteristic = function(path, characteristic){
	$(stdl.paths.focusElement).hide();
	var elements = $(stdl.paths.focusElement).find(path);
	var count = 0;
	var firstElement = null;
	for(var i=0;i< elements.length;i++){
		if($(elements[i]).val() == characteristic){
			count++;
			var headElement = $(elements[i]).closest(stdl.paths.focusElement);
			if(count == 1){
				this.currentDOMElement.setNewElement(headElement);
			}
			$(headElement).show();
		}
	}
	
	if(count == 0){
		var elements = $(stdl.paths.focusElement);
		if(elements.length > 0){
			this.currentDOMElement.setNewElement(elements.last());
		}
	}
	this.refreshDOMCounter();

};