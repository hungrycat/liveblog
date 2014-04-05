Template.read.helpers({
	listPosts: function () {
		return Posts.find({eventId: this._id}, { sort: { time: -1 }});
	}, 
	isLive: function () {
		return this.eventIsLive ? "Live" : "Ended";
	},

	postTimeString: function () {
			// function to figure out how long ago something was posted
		var calcTimeAgo = function (t) {		
			var str = "";
			var diff = ( Date.now() - t )/1000;
			var days = diff / ( 60*60*24) ;
			if (days > 1 ) { return parseInt(days) + " days";}
			else if (days === 1 ) {return "1 day";} 
			var hours = diff / (60*60);
			if (hours > 1 ) { return parseInt(hours) + " hours";}
			else if (hours === 1 ) {return "1 hour";} 
			var mins = diff / (60);
			if (mins > 1 ) { return parseInt(mins) + " minutes";}
			else if (mins === 1 ) {return "1 minute";} 
			else { return "moments"; }

		};
		return calcTimeAgo(this.time);
	}
});

Template.read.events({

	'click #submitComment' : function (event) {
		event.preventDefault();

		var commentText = document.getElementById('commentText').value;
		var user = Meteor.user();
		
		if (commentText !== '' && commentText !== null) {
	        Comments.insert({
	          commentText: commentText,
	          commentator: "commentator",
	          eventId: this._id,
	          time: Date.now()
	        });

	        document.getElementById('commentText').value = '';
	        commentText.value = '';
      	}
	}
});



Template.read.rendered = function () {
	//autoresize the new post and edit post textarea
	$(".animated").autosize({append: "\n"});
	$(".animated").trigger('autosize.resize');


};