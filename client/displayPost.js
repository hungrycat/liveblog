Template.displayPost.helpers({


	//this doesn't update when a new post comes in. Somehow this code should be put in Deps.autorun(function(){ })
	postTimeString: function () {
			// function to figure out how long ago something was posted
		var calcTimeAgo = function (t) {		
			var str = "";
			var diff = ( Date.now() - t )/1000; //difference in seconds
			var days = diff / ( 60*60*24) ;
			if (days >= 2 ) { return parseInt(days) + " days";}
			else if (days >= 1 ) {return "1 day";} 
			var hours = diff / (60*60);
			if (hours >= 2 ) { return parseInt(hours) + " hours";}
			else if (hours >= 1 ) {return "1 hour";} 
			var mins = diff / (60);
			if (mins >= 2 ) { return parseInt(mins) + " minutes";}
			else if (mins >= 1 ) {return "1 minute";} 
			if (diff >= 2 ) {return parseInt(diff) + " seconds"; }
			else { return "moments"; }

		};
		return calcTimeAgo(this.time);
	}
});