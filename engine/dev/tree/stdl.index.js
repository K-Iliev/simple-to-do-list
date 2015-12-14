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