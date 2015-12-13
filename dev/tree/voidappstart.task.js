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