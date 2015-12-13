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