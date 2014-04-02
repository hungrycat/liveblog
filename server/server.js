Meteor.methods({

	deleteEvent: function(eventId) {
		Events.remove(eventId);
	}, 
	deletePost: function(postId) {
		Posts.remove(postId);
	}, 
	liveDead: function(eventId) {
		var doc = Events.findOne({_id: eventId});
		Events.update({_id: eventId}, {$set: {eventIsLive: !doc.eventIsLive}});
	}

});


Meteor.publish('posts', function(eventId) {
  return Posts.find({ eventId: eventId});
});

Meteor.publish('events', function() {
  return Events.find({});
});