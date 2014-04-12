Template.read.helpers({
	listPosts: function () {
		return Posts.find({eventId: this._id}, { sort: { time: -1 }});
	},

	isLive: function () {
		return this.eventIsLive ? "Live" : "Ended";
	}


});

Template.read.events({

	'click #submitComment' : function (event) {
		event.preventDefault();

		var commentText = document.getElementById('commentText').value;


		if (commentText !== '' && commentText !== null) {

			var user = Meteor.user();

			var doc = {
				commentText: commentText,
				commentator: "commentator",
				eventId: Session.get("currentEvent"),
				time: Date.now(),
			}

			if (user !== null && user.avatarUrl) { doc["avatarUrl"] = user.avatarUrl; };
			if (user !== null && user.username) { doc["commentator"] = user.username; };

	        Comments.insert(doc);

	        console.log("%O", doc);

	        document.getElementById('commentText').value = '';
	        commentText.value = '';
      	}
	}, 
	//ensures that links open in new window, for some reason we have to override the default event to do that
	'click a[target=_blank]': function (event) {
		event.preventDefault();
		window.open(event.target.href, '_blank');
	}
});



Template.read.rendered = function () {
	//autoresize the new post and edit post textarea
	$(".animated").autosize({append: "\n"});
	$(".animated").trigger('autosize.resize');


};