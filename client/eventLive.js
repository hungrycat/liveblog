//--------------------------------------------
//-------      event Live       --------------
//--------------------------------------------


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


Template.eventLive.helpers({
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
			if (days === 1 ) {return "1 day";}
			else if (days >=1 ) { return parseInt(days) + " days";}
			var hours = diff / (60*60);
			if (hours === 1 ) {return "1 hour";}
			else if (hours >=1 ) { return parseInt(hours) + " hours";}
			var mins = diff / (60);
			if (mins === 1 ) {return "1 minute";}
			else if (mins >=1 ) { return parseInt(mins) + " minutes";}
			else { return "moments"; }

		};
		return calcTimeAgo(this.time);
	}, 
	editing: function () {
		return Session.equals('editing_postname', this._id);
	}


});

Template.eventLive.events({
	'click #submitPost' : function (event) {
		event.preventDefault();

		var postText = document.getElementById('postText').value;
		var user = Meteor.user();
		
		if (postText !== '' && postText !== null) {
	        Posts.insert({
	          postText: postText,
	          author: user.username,
	          eventId: this._id,
	          time: Date.now()
	        });

	        document.getElementById('postText').value = '';
	        postText.value = '';
      	}
	}, 

	'click .deletePost' : function () {
		Meteor.call("deletePost", this._id);

	   },

	 'click #liveDead' : function () {
		Meteor.call("liveDead", this._id);

	   }, 


////////////events for live editing////////////

	  'click .post': function (evt) {
	    // prevent clicks on <a> from refreshing the page.
	    evt.preventDefault();
	  },
	  'dblclick .post': function (evt, tmpl) { // start editing list name
	    Session.set('editing_postname', this._id);

	    Deps.flush(); // force DOM redraw, so we can focus the edit field
	    activateInput(tmpl.find("#editPostText"));
	    $(".animated").autosize({append: "\n"});
		$(".animated").trigger('autosize.resize');
	  }
});

Template.eventLive.events(okCancelEvents(
	'#editPostText',
	{
	ok: function (postText) {
	  Posts.update(this._id, {$set: {postText: postText}});
	  Session.set('editing_postname', null);
	},
	cancel: function () {
	  Session.set('editing_postname', null);
	}
}));


Template.eventLive.rendered = function () {
	//autoresize the new post and edit post textarea
	$(".animated").autosize({append: "\n"});
	$(".animated").trigger('autosize.resize');


};

