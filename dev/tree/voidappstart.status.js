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
