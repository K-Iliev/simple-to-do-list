// application namespace
var stdl = {};

$(stdl).ready(function() {

	// declare enumerations in main namespace
	stdl.enumStatus = new EnumStatus();
	stdl.enumPriority = new EnumPriority();
	stdl.enumContext = new EnumContext();
	stdl.enumFilter = new EnumFilter();

	
	// paths settings already contains used paths for finding html elements 
	stdl.paths = new PathSettings();

	stdl.tree = new Tree("", 
								stdl.enumPriority.low, 
								stdl.enumStatus.active,
								undefined,
								undefined,
								stdl.enumFilter.all);

	// the commented lines shows you the available options 
	// for manipulating the global tree settings

	// stdl.tree.priority.setPriority(stdl.enumPriority.low);
	// stdl.tree.status.setStatus(stdl.enumStatus.active);
	//stdl.tree.status.setVisability(true);
	//stdl.tree.priority.setVisability(true);
	// stdl.tree.index.setVisability(true);
	
	stdl.treeManager = new TreeManager();

	// create and initilize the events 
	stdl.createNewTaskEvent();
	stdl.createDeleteEvent();
	stdl.createSubTaskEvent();
	stdl.createSetFocusEvent();
	stdl.createClearEvent();
	stdl.createUpMovementEvent();
	stdl.createDownMovementEvent();
	// obsolete - remving 'read' context
	// stdl.createSwitchContextEvent();
	stdl.createClosedTaskEvent();
	stdl.createStoreListEvent();
	stdl.createRestoreListEvent();
	stdl.createTabEvent();
	
	document.onkeydown = stdl.treeManager.recognizeEvent;
	stdl.treeManager.setHowToUseKeysInstructions(stdl.tree.context, "false");
	
	stdl.displayMessageIfItIsNotChrome(); 
});

/*
*	Creation of events managed by tree manager
*	The functions below will show you an example 
*	how to create your own tree event. More info you 
*	can view in the definitions of treevent, command 
*	and howtouse classes.
*/
var stdl = {
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
		//var command = new Command(true, [stdl.enumContext.empty,stdl.enumContext.read,stdl.enumContext.write], stdl.tree.restoreFromJsonObject, stdl.tree );

		var howToUseTabKeys =[];
		howToUseTabKeys.push(new HowToUse([stdl.enumContext.write], "true", "Press 'TAB' to select next input element"));
		howToUseTabKeys.push(new HowToUse([stdl.enumContext.write], "true", "Press 'TAB' + 'SHIFT' to select previous input element"));

		var tabKeyCodes = [9];

		tabEvent.registerKeys(tabKeyCodes, howToUseTabKeys);
		//tabEvent.pushCommand(command);

		stdl.treeManager.addEvent(tabEvent);
	},

 	createRestoreListEvent : function(){
		var templateForUploadButtonName  = "#UploadButtonTemplate";
		var restoreEvent = new TreeEvent(templateForUploadButtonName);
		
		var command = new Command(false, [stdl.enumContext.empty,stdl.enumContext.read,stdl.enumContext.write], stdl.treeManager.showOpenFileDialog, stdl.treeManager );

		var howToUseRestoreListKeys =[];
		howToUseRestoreListKeys.push(new HowToUse([stdl.enumContext.empty,stdl.enumContext.read,stdl.enumContext.write], "false", "Press 'R' or 'r'' to restore list from the local drive.", "(R)estore"));
		var restoreListCodes = new Array(82,114);

		restoreEvent.registerKeys(restoreListCodes, howToUseRestoreListKeys);
		restoreEvent.pushCommand(command);

		stdl.treeManager.addEvent(restoreEvent);
	},
	createStoreListEvent : function(){
		var storeEvent = new TreeEvent();
		var command = new Command(false, [stdl.enumContext.read,stdl.enumContext.write], stdl.tree.downloadAsTxtFile, stdl.tree );

		var howToUseStoreListKeys =[];
		howToUseStoreListKeys.push(new HowToUse([stdl.enumContext.read,stdl.enumContext.write], "false", "Press 'B' or 'b' to store list on the local drive.", "(B)ackup"));
		var storeListCodes = new Array(66,98);

		storeEvent.registerKeys(storeListCodes, howToUseStoreListKeys);
		storeEvent.pushCommand(command);

		stdl.treeManager.addEvent(storeEvent);
	},

	createClosedTaskEvent : function(){
		var closedEvent = new TreeEvent();
		var command = new Command(false, [stdl.enumContext.read], stdl.tree.setVisabilityOfClosedTasks, stdl.tree );

		var howToUseClosedTaskKeys = [];
		howToUseClosedTaskKeys.push(new HowToUse([stdl.enumContext.read], "false", "Press 'H' or 'h' to show/hide closed task .", "S(h)ow/Hide the closed tasks"));
		var closedTaskCodes = [72,104];

		closedEvent.registerKeys(closedTaskCodes, howToUseClosedTaskKeys);
		closedEvent.pushCommand(command);

		stdl.treeManager.addEvent(closedEvent);
	},
	createSwitchContextEvent: function (){
		var switchEvent = new TreeEvent();
		var command = new Command(false, [stdl.enumContext.write,stdl.enumContext.read], stdl.tree.switchContext, stdl.tree );

		var howToUseSwitchKeys = [];
		howToUseSwitchKeys.push(new HowToUse([stdl.enumContext.write], "false", "Press 'W' or 'w' to switch context to 'read'.", "S(w)itch to 'read'"));
		howToUseSwitchKeys.push(new HowToUse([stdl.enumContext.read], "false", "Press 'W' or 'W' to switch context to 'write'.", "S(w)itch to 'write'"));

		var switchKeyCodes = new Array(87,129);
		switchEvent.registerKeys(switchKeyCodes, howToUseSwitchKeys);
		switchEvent.pushCommand(command);

		stdl.treeManager.addEvent(switchEvent);
	},
	createDownMovementEvent : function(){
		var downEvent = new TreeEvent();
		var command = new Command(false, [stdl.enumContext.write,stdl.enumContext.read], stdl.tree.currentDOMElement.selectNextElement, stdl.tree.currentDOMElement, "down");

		var howToUseDownKeys = [];
		howToUseDownKeys.push(new HowToUse([stdl.enumContext.write, stdl.enumContext.read], "false", "Press the arrow Down to move forwards.", "Select the next task (arrow down)"));

		var downKeyCodes = [40];
		downEvent.registerKeys(downKeyCodes, howToUseDownKeys);
		downEvent.pushCommand(command);

		stdl.treeManager.addEvent(downEvent);
	},
	createUpMovementEvent :function (){
		var upEvent = new TreeEvent();

		var command = new Command(false, [stdl.enumContext.write,stdl.enumContext.read], stdl.tree.currentDOMElement.selectNextElement, stdl.tree.currentDOMElement, "up");

		var howToUseUpKeys = [];
		howToUseUpKeys.push(new HowToUse([stdl.enumContext.write, stdl.enumContext.read], "false", "Press the arrow Up to move backwards.", "Select the previous task (arrow up)"));

		var upKeyCodes = [38];
		upEvent.registerKeys(upKeyCodes, howToUseUpKeys);
		upEvent.pushCommand(command);

		stdl.treeManager.addEvent(upEvent);
	},
	createClearEvent :function (){
		var clearEvent = new TreeEvent();

		var command = new Command(false, [stdl.enumContext.write,stdl.enumContext.read], stdl.tree.clear, stdl.tree, false);

		var howToUseClearKeys = [];
		howToUseClearKeys.push(new HowToUse([stdl.enumContext.write, stdl.enumContext.read], "false", "Press 'C' or 'c' to clear all created tasks.", "(C)lear the list"));
		var clearCodes = [67,99];

		clearEvent.registerKeys(clearCodes, howToUseClearKeys);
		clearEvent.pushCommand(command);

		stdl.treeManager.addEvent(clearEvent);
	},

	createSetFocusEvent : function(){
		var setFocusEvent = new TreeEvent();

		var commandSetActivInput = new Command(false, [stdl.enumContext.write], stdl.tree.currentDOMElement.setActivInput, stdl.tree.currentDOMElement);
		var commandRemoveActivInput = new Command(true, [stdl.enumContext.write, stdl.enumContext.empty], stdl.tree.currentDOMElement.removeFocusFromInput, stdl.tree.currentDOMElement);

		var howToUseEnterKeys = [];
		howToUseEnterKeys.push(new HowToUse([stdl.enumContext.write], "true", "Press Ctrl to lost focus from input."));
		howToUseEnterKeys.push(new HowToUse([stdl.enumContext.write], "false", "Press Ctrl to set focus on input.", " Set focus (Enter)"));

		var enterKeysCodes = [13];
		setFocusEvent.registerKeys(enterKeysCodes, howToUseEnterKeys);	
		setFocusEvent.pushCommand(commandSetActivInput);
		setFocusEvent.pushCommand(commandRemoveActivInput);


		stdl.treeManager.addEvent(setFocusEvent);
	},

	createNewTaskEvent : function (){
		var newTaskEvent = new TreeEvent();

		var command = new Command(false, [stdl.enumContext.write, stdl.enumContext.empty], stdl.tree.createNewTask, stdl.tree);

		var howToUseNewTaskKeys = [];
		howToUseNewTaskKeys.push(new HowToUse([stdl.enumContext.write,stdl.enumContext.empty], "false", "Press 'n' or 'N' to create a new task", "(N)ew task"));
		var newTaskKeyCodes = new Array(78,110);

		newTaskEvent.registerKeys(newTaskKeyCodes, howToUseNewTaskKeys);
		newTaskEvent.pushCommand(command);

		stdl.treeManager.addEvent(newTaskEvent);
	},

	createDeleteEvent :function(){
		var deleteEvent = new TreeEvent();

		var command = new Command(false, [stdl.enumContext.write], stdl.tree.deleteTask, stdl.tree);

		var howToUseDeleteKeys =[];
		howToUseDeleteKeys.push(new HowToUse([stdl.enumContext.write], "false", "Press 'D' or 'd' to delete a task.", "(D)elete current"));
		var deleteKeyCodes = new Array(68,100);

		deleteEvent.registerKeys(deleteKeyCodes, howToUseDeleteKeys);
		deleteEvent.pushCommand(command);

		stdl.treeManager.addEvent(deleteEvent);
	},

	createSubTaskEvent: function(){
		var subTaskEvent = new TreeEvent();
		var command = new Command(false, [stdl.enumContext.write], stdl.tree.createSubTask, stdl.tree);

		var howToUseSubTaskKeys = [];
		howToUseSubTaskKeys.push(new HowToUse([stdl.enumContext.write], "false", "Press 's' or 'S' to create a sub task.", "(S)ub task"))

		var subTaskKeyCodes = new Array(83,115);
		subTaskEvent.registerKeys(subTaskKeyCodes, howToUseSubTaskKeys);
		subTaskEvent.pushCommand(command);

		stdl.treeManager.addEvent(subTaskEvent);
	}
};
/*
*   It there are created tasks, it will automatically download 
* 	the tree on the local drive. It's a little annoying, but..

$(window).bind('beforeunload',function(){
   stdl.treeManager.saveBeforeUnloadThePage();
   return 'We saved the list for you. Now you can restore it.';

});


*/