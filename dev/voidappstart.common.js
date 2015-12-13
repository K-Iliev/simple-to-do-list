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