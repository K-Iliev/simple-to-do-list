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
	if(priority == stdl.enumPriority.middle){
		this.middle = "selected";
		this.high = "";
		this.low = "";
	} else if(priority == stdl.enumPriority.high){
		this.high = "selected";
		this.low = "";
		this.middle = "";
	}else if(priority == stdl.enumPriority.low){
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
