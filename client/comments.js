////////// Helpers for in-place editing //////////

// Returns an event map that handles the "escape" and "return" keys and
// "blur" events on a text input (given by selector) and interprets them
// as "ok" or "cancel".
var okCancelEvents = function (selector, callbacks) {
  var ok = callbacks.ok || function () {};
  var cancel = callbacks.cancel || function () {};

  var events = {};
  events['keyup '+selector+', keydown '+selector+', focusout '+selector] =
    function (evt) {
      if (evt.type === "keydown" && evt.which === 27) {
        // escape = cancel
        cancel.call(this, evt);
      } else if (
                 evt.type === "focusout") {
        // blur = ok/submit if non-empty - return does not submit!
        var value = String(evt.target.value || "");
        if (value)
          ok.call(this, value, evt);
        else
          cancel.call(this, evt);
      }
    };

  return events;
};

var activateInput = function (input) {
  input.focus();
  input.select();
};



Template.comments.helpers({

	listComments: function () {
		return Comments.find({eventId: this._id}, { sort: { time: -1 }});
	}, 
	editing: function () {
		return Session.equals('editing_comment_id', this._id);
	}, 
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

})


Template.comments.events({	  
	'click .comment': function (evt) {
		// prevent clicks on <a> from refreshing the page.
		evt.preventDefault();
	},
	'dblclick  .comment' : function (event) {
		event.preventDefault();

		var user = Meteor.user();

		var commentHtml = "<blockquote class=\"com-bq\">" + this.commentText + "</blockquote><strong>" + user.username + "</strong>: " ;

		document.getElementById('postText').value = commentHtml;

		Session.set("commentator", this.commentator);
		if (this.avatarUrl) { Session.set("commentatorAvatarUrl", this.avatarUrl) };


		Meteor.call("deleteComment", this._id);
	}



	// 'dblclick .comment': function (evt, tmpl) { // start editing list name
	// 	Session.set('editing_comment_id', this._id);

	// 	Deps.flush(); // force DOM redraw, so we can focus the edit field

	// 	activateInput(tmpl.find("#editCommentText"));
	// 	$(".animated").autosize({append: "\n"});
	// 	$(".animated").trigger('autosize.resize');
	// }
});

Template.comments.events(okCancelEvents(
	'#editCommentText',
	{
	ok: function (commentText) {
	  Comments.update(this._id, {$set: {commentText: commentText}});
	  Session.set("editing_comment_id", null);
	},
	cancel: function () {
	  Session.set('editing_comment_id', null);
	}
}));