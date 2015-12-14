/*
*   enumerations for to-do list context
*   the context is used for enabling/disabling
*   the operations on tasks. 
*   (for example, when it is read context,
*   you cannot add new task and so on ..) 
*/
function EnumContext(){
    this.read = "read";
    this.write = "write";
    this.empty = "empty";
}