Accounts.ui.config({ passwordSignupFields: 'USERNAME_ONLY' });

Router.map( function () {
	this.route('main', {
		path: '/'
	});
	this.route('eventsList', {
		path: '/eventsList'
	});
	this.route('eventLive', {
		path: '/event/:event_id', 
		data: function() { return Events.findOne(this.params.event_id); }
	});
});


Template.eventsList.helpers({
	listEvents: function () {
		return Events.find({}, { sort: { time: -1 }});
	}, 
	isLive: function () {
		return this.eventIsLive ? "Live" : "Ended";
	}


});

Template.eventsList.events = {
	'click #addEvent' : function () {
		var eventTitle = document.getElementById('eventT').value;
		var user = Meteor.user();
		console.log("event title: " + eventTitle);
		if (eventTitle.value != '') {
	        Events.insert({
	          eventTitle: eventTitle,
	          createdBy: user.username,
	          time: Date.now()
	        });

	        document.getElementById('eventT').value = '';
	        eventTitle.value = '';
      	}
	}, 
	'click .deleteEvent' : function () {
		Meteor.call("deleteEvent", this._id);

    }
};