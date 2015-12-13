// application namespace
var voidappstart = {};

$(voidappstart).ready(function() {

	// declare enumerations in main namespace
	voidappstart.enumStatus = new EnumStatus();
	voidappstart.enumPriority = new EnumPriority();
	voidappstart.enumContext = new EnumContext();
	
	// paths settings already contains used paths for finding html elements 
	voidappstart.paths = new PathSettings();

	voidappstart.tree = new Tree("", 
								voidappstart.enumPriority.low, 
								voidappstart.enumStatus.active,
								undefined,
								undefined);

	// the commented lines shows you the available options 
	// for manipulating the global tree settings

	// voidappstart.tree.priority.setPriority(voidappstart.enumPriority.low);
	// voidappstart.tree.status.setStatus(voidappstart.enumStatus.active);
	//voidappstart.tree.status.setVisability(true);
	//voidappstart.tree.priority.setVisability(true);
	// voidappstart.tree.index.setVisability(true);
	
	voidappstart.treeManager = new TreeManager();

	// create and initilize the events 
	voidappstart.createNewTaskEvent();
	voidappstart.createDeleteEvent();
	voidappstart.createSubTaskEvent();
	voidappstart.createSetFocusEvent();
	voidappstart.createClearEvent();
	voidappstart.createUpMovementEvent();
	voidappstart.createDownMovementEvent();
	voidappstart.createSwitchContextEvent();
	voidappstart.createClosedTaskEvent();
	voidappstart.createStoreListEvent();
	voidappstart.createRestoreListEvent();
	voidappstart.createTabEvent();
	
	document.onkeydown = voidappstart.treeManager.recognizeEvent;
	voidappstart.setActiveTaskByActiveInput = voidappstart.treeManager.setActiveElement;
	voidappstart.setVisability = voidappstart.treeManager.setVisabilityOfTask;
	voidappstart.treeManager.setHowToUseKeysInstructions(voidappstart.tree.context, "false");

	voidappstart.displayMessageIfItIsNotChrome(); 
});

/*
*	Creation of events managed by tree manager
*	The functions below will show you an example 
*	how to create your own tree event. More info you 
*	can view in the definitions of treevent, command 
*	and howtouse classes.
*/
var voidappstart = {
	/*
	*	It only works in Chrome. Deal with it.
	*/
	displayMessageIfItIsNotChrome : function(){
		var isOpera = !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
		var isChrome = !!window.chrome && !isOpera;
		if(isChrome){	
			$("#infoMessageForBrowserSupport").hide();
		}else{
			$("#infoMessageForBrowserSupport").show();
		}
	},
 	createTabEvent: function(){
		var tabEvent = new TreeEvent();
		//var command = new Command(true, [voidappstart.enumContext.empty,voidappstart.enumContext.read,voidappstart.enumContext.write], voidappstart.tree.restoreFromJsonObject, voidappstart.tree );

		var howToUseTabKeys =[];
		howToUseTabKeys.push(new HowToUse([voidappstart.enumContext.write], "true", "Press 'TAB' to select next input element"));
		howToUseTabKeys.push(new HowToUse([voidappstart.enumContext.write], "true", "Press 'TAB' + 'SHIFT' to select previous input element"));

		var tabKeyCodes = [9];

		tabEvent.registerKeys(tabKeyCodes, howToUseTabKeys);
		//tabEvent.pushCommand(command);

		voidappstart.treeManager.addEvent(tabEvent);
	},

 	createRestoreListEvent : function(){
		var templateForUploadButtonName  = "#UploadButtonTemplate";
		var restoreEvent = new TreeEvent(templateForUploadButtonName);
		
		var command = new Command(false, [voidappstart.enumContext.empty,voidappstart.enumContext.read,voidappstart.enumContext.write], voidappstart.treeManager.showOpenFileDialog, voidappstart.treeManager );

		var howToUseRestoreListKeys =[];
		howToUseRestoreListKeys.push(new HowToUse([voidappstart.enumContext.empty,voidappstart.enumContext.read,voidappstart.enumContext.write], "false", "Press 'R' or 'r'' to restore list from the local drive.", "(R)estore"));
		var restoreListCodes = new Array(82,114);

		restoreEvent.registerKeys(restoreListCodes, howToUseRestoreListKeys);
		restoreEvent.pushCommand(command);

		voidappstart.treeManager.addEvent(restoreEvent);
	},
	createStoreListEvent : function(){
		var storeEvent = new TreeEvent();
		var command = new Command(false, [voidappstart.enumContext.read,voidappstart.enumContext.write], voidappstart.tree.downloadAsTxtFile, voidappstart.tree );

		var howToUseStoreListKeys =[];
		howToUseStoreListKeys.push(new HowToUse([voidappstart.enumContext.read,voidappstart.enumContext.write], "false", "Press 'B' or 'b' to store list on the local drive.", "(B)ackup"));
		var storeListCodes = new Array(66,98);

		storeEvent.registerKeys(storeListCodes, howToUseStoreListKeys);
		storeEvent.pushCommand(command);

		voidappstart.treeManager.addEvent(storeEvent);
	},

	createClosedTaskEvent : function(){
		var closedEvent = new TreeEvent();
		var command = new Command(false, [voidappstart.enumContext.read], voidappstart.tree.setVisabilityOfClosedTasks, voidappstart.tree );

		var howToUseClosedTaskKeys = [];
		howToUseClosedTaskKeys.push(new HowToUse([voidappstart.enumContext.read], "false", "Press 'H' or 'h' to show/hide closed task .", "S(h)ow/Hide the closed tasks"));
		var closedTaskCodes = [72,104];

		closedEvent.registerKeys(closedTaskCodes, howToUseClosedTaskKeys);
		closedEvent.pushCommand(command);

		voidappstart.treeManager.addEvent(closedEvent);
	},
	createSwitchContextEvent: function (){
		var switchEvent = new TreeEvent();
		var command = new Command(false, [voidappstart.enumContext.write,voidappstart.enumContext.read], voidappstart.tree.switchContext, voidappstart.tree );

		var howToUseSwitchKeys = [];
		howToUseSwitchKeys.push(new HowToUse([voidappstart.enumContext.write], "false", "Press 'W' or 'w' to switch context to 'read'.", "S(w)itch to 'read'"));
		howToUseSwitchKeys.push(new HowToUse([voidappstart.enumContext.read], "false", "Press 'W' or 'W' to switch context to 'write'.", "S(w)itch to 'write'"));

		var switchKeyCodes = new Array(87,129);
		switchEvent.registerKeys(switchKeyCodes, howToUseSwitchKeys);
		switchEvent.pushCommand(command);

		voidappstart.treeManager.addEvent(switchEvent);
	},
	createDownMovementEvent : function(){
		var downEvent = new TreeEvent();
		var command = new Command(false, [voidappstart.enumContext.write,voidappstart.enumContext.read], voidappstart.tree.currentDOMElement.selectNextElement, voidappstart.tree.currentDOMElement, "down");

		var howToUseDownKeys = [];
		howToUseDownKeys.push(new HowToUse([voidappstart.enumContext.write, voidappstart.enumContext.read], "false", "Press the arrow Down to move forwards.", "Select the next task (arrow down)"));

		var downKeyCodes = [40];
		downEvent.registerKeys(downKeyCodes, howToUseDownKeys);
		downEvent.pushCommand(command);

		voidappstart.treeManager.addEvent(downEvent);
	},
	createUpMovementEvent :function (){
		var upEvent = new TreeEvent();

		var command = new Command(false, [voidappstart.enumContext.write,voidappstart.enumContext.read], voidappstart.tree.currentDOMElement.selectNextElement, voidappstart.tree.currentDOMElement, "up");

		var howToUseUpKeys = [];
		howToUseUpKeys.push(new HowToUse([voidappstart.enumContext.write, voidappstart.enumContext.read], "false", "Press the arrow Up to move backwards.", "Select the previous task (arrow up)"));

		var upKeyCodes = [38];
		upEvent.registerKeys(upKeyCodes, howToUseUpKeys);
		upEvent.pushCommand(command);

		voidappstart.treeManager.addEvent(upEvent);
	},
	createClearEvent :function (){
		var clearEvent = new TreeEvent();

		var command = new Command(false, [voidappstart.enumContext.write,voidappstart.enumContext.read], voidappstart.tree.clear, voidappstart.tree, false);

		var howToUseClearKeys = [];
		howToUseClearKeys.push(new HowToUse([voidappstart.enumContext.write, voidappstart.enumContext.read], "false", "Press 'C' or 'c' to clear all created tasks.", "(C)lear the list"));
		var clearCodes = [67,99];

		clearEvent.registerKeys(clearCodes, howToUseClearKeys);
		clearEvent.pushCommand(command);

		voidappstart.treeManager.addEvent(clearEvent);
	},

	createSetFocusEvent : function(){
		var setFocusEvent = new TreeEvent();

		var commandSetActivInput = new Command(false, [voidappstart.enumContext.write], voidappstart.tree.currentDOMElement.setActivInput, voidappstart.tree.currentDOMElement);
		var commandRemoveActivInput = new Command(true, [voidappstart.enumContext.write, voidappstart.enumContext.empty], voidappstart.tree.currentDOMElement.removeFocusFromInput, voidappstart.tree.currentDOMElement);

		var howToUseEnterKeys = [];
		howToUseEnterKeys.push(new HowToUse([voidappstart.enumContext.write], "true", "Press Ctrl to lost focus from input."));
		howToUseEnterKeys.push(new HowToUse([voidappstart.enumContext.write], "false", "Press Ctrl to set focus on input.", " Set focus (Cntrl)"));

		var enterKeysCodes = [17];
		setFocusEvent.registerKeys(enterKeysCodes, howToUseEnterKeys);	
		setFocusEvent.pushCommand(commandSetActivInput);
		setFocusEvent.pushCommand(commandRemoveActivInput);


		voidappstart.treeManager.addEvent(setFocusEvent);
	},

	createNewTaskEvent : function (){
		var newTaskEvent = new TreeEvent();

		var command = new Command(false, [voidappstart.enumContext.write, voidappstart.enumContext.empty], voidappstart.tree.createNewTask, voidappstart.tree);

		var howToUseNewTaskKeys = [];
		howToUseNewTaskKeys.push(new HowToUse([voidappstart.enumContext.write,voidappstart.enumContext.empty], "false", "Press 'n' or 'N' to create a new task", "(N)ew task"));
		var newTaskKeyCodes = new Array(78,110);

		newTaskEvent.registerKeys(newTaskKeyCodes, howToUseNewTaskKeys);
		newTaskEvent.pushCommand(command);

		voidappstart.treeManager.addEvent(newTaskEvent);
	},

	createDeleteEvent :function(){
		var deleteEvent = new TreeEvent();

		var command = new Command(false, [voidappstart.enumContext.write], voidappstart.tree.deleteTask, voidappstart.tree);

		var howToUseDeleteKeys =[];
		howToUseDeleteKeys.push(new HowToUse([voidappstart.enumContext.write], "false", "Press 'D' or 'd' to delete a task.", "(D)elete current"));
		var deleteKeyCodes = new Array(68,100);

		deleteEvent.registerKeys(deleteKeyCodes, howToUseDeleteKeys);
		deleteEvent.pushCommand(command);

		voidappstart.treeManager.addEvent(deleteEvent);
	},

	createSubTaskEvent: function(){
		var subTaskEvent = new TreeEvent();
		var command = new Command(false, [voidappstart.enumContext.write], voidappstart.tree.createSubTask, voidappstart.tree);

		var howToUseSubTaskKeys = [];
		howToUseSubTaskKeys.push(new HowToUse([voidappstart.enumContext.write], "false", "Press 's' or 'S' to create a sub task.", "(S)ub task"))

		var subTaskKeyCodes = new Array(83,115);
		subTaskEvent.registerKeys(subTaskKeyCodes, howToUseSubTaskKeys);
		subTaskEvent.pushCommand(command);

		voidappstart.treeManager.addEvent(subTaskEvent);
	}
};
/*
*   It there are created tasks, it will automatically download 
* 	the tree on the local drive. It's a little annoying, but..
*/
$(window).bind('beforeunload',function(){
   voidappstart.treeManager.saveBeforeUnloadThePage();
   return 'We saved the list for you. Now you can restore it.';

});