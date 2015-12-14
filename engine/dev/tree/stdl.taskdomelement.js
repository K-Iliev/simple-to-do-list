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
	var inputElement = $(this.element).find(stdl.paths.taskDescription);
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
TaskDOMElement.prototype.setCurrent = function(){
	if(this.element != null){
		$(this.element).addClass(stdl.paths.cssClassActive);
	}
};
/*
*	Uncolors all elements and then colors the 
*	new one.
*/
TaskDOMElement.prototype.setNewElement = function(element){
	this.unsetAll();
	this.setElement(element);
	this.setCurrent();
};
/*
*	Return the element background in white.
*/
TaskDOMElement.prototype.unsetAll = function(){
	$(stdl.paths.focusElement).removeClass(stdl.paths.cssClassActive);
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
			if(isTaskVisible){
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
			//varisShowMode = (this.tree.areClosedTaskHidden) && (stdl.enumContext.read == this.tree.context);
			var isTaskVisible = $(element).is(':visible');
			//var isTaskActive = ($(element).find(stdl.paths.taskStatus).val() == stdl.enumStatus.active);
			if(isTaskVisible){
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
	this.unsetAll();
	var isThereElement = false;
	if(direction == "up"){
		this.searchPrevActiveElement(direction);
	}
	if(direction == "down"){
		this.searchNextActiveElement(direction);
	}
	this.setCurrent();	
	

};
/*
*	Gets the task index which is contained in nested
* 	element of the task element
*/
TaskDOMElement.prototype.getIndex = function(){
	var taskIndex = $(this.element).find(stdl.paths.taskindex);
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
		this.setCurrent();	
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
		this.setCurrent();
	} else{
		prevElement = this.getPrevNeighbourElement();
		if(isDOMElementExist(prevElement)){
			this.removeElement();
			this.setElement(prevElement);
			this.setCurrent();
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
		this.pointerOfDOMElementWhileChangingIndexes =  $(stdl.paths.newTasks).first();
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

	// change tree task status or priorty according to what filter is applied
	this.tree.setCharactersticsBasedOnFilter();
	
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
	this.colorBasedOnPriority();
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
	
	var inputElement = $(this.element).find(stdl.paths.taskDescription);
	var selectStatusElement = $(this.element).find(stdl.paths.taskStatus);
	var selectPriorityElement = $(this.element).find(stdl.paths.taskPriority);

	var task = this.findMatchingTreeTask(root);
	task.description = inputElement.val();
	task.priority = selectPriorityElement.val();
	task.status = selectStatusElement.val();
};
/*
*	Select the element if the current is closed
*/
TaskDOMElement.prototype.selectNewOneIfItIsClosed = function(){
	if(this.tree.context == stdl.enumContext.read){
		if($(this.element).find(stdl.paths.taskStatus).val() ==  stdl.enumStatus.closed){
			 this.selectNewOne();
		}
	}
};
TaskDOMElement.prototype.colorBasedOnPriority = function(){
	var priority = $(this.element).find(stdl.paths.taskPriority).val();
	$(this.element).removeClass();
	if(priority == stdl.enumPriority.low){
		$(this.element).addClass(stdl.paths.cssLowPriorityTask);
	} else if(priority == stdl.enumPriority.middle){
		$(this.element).addClass(stdl.paths.cssMiddlePriorityTask);
	}else if(priority == stdl.enumPriority.high){
		$(this.element).addClass(stdl.paths.cssHighPriorityTask);
	}
	this.setCurrent();
};
TaskDOMElement.prototype.hideIfPriorityFilterDoNotMatch = function(){

 	var priority = $(this.element).find(stdl.paths.taskPriority).val();

	if(stdl.enumFilter.high == this.tree.filter){
 		if(priority != stdl.enumPriority.high){
			$(this.element).hide();
			this.selectNewOne();
 		}
	} else if(stdl.enumFilter.middle == this.tree.filter){
 		if(priority != stdl.enumPriority.middle){
			$(this.element).hide();
			this.selectNewOne();
 		}
	} else if(stdl.enumFilter.low == this.tree.filter){
 		if(priority != stdl.enumPriority.low){
			$(this.element).hide();
			this.selectNewOne();
 		}
	}
};
TaskDOMElement.prototype.hideIfClosedFilterDoNotMatch = function(){
	var status = $(this.element).find(stdl.paths.taskStatus).val();

	if(stdl.enumFilter.closed == this.tree.filter){
 		if(status != stdl.enumStatus.closed){
			$(this.element).hide();
			this.selectNewOne();
 		}
	} else if(stdl.enumFilter.active == this.tree.filter){
 		if(status != stdl.enumStatus.active){
			$(this.element).hide();
			this.selectNewOne();
 		}
	}
};
