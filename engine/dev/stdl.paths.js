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
    this.focusVisibleElement="div[name=newTasks]:visible";
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