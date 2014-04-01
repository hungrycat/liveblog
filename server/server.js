Meteor.methods({

	deleteEvent: function(eventId) {
		Events.remove(eventId);
	}
});