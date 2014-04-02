//--------------------------------------------
//-------      list of events   --------------
//--------------------------------------------

Template.eventsList.helpers({
	listEvents: function () {
		return Events.find({}, { sort: { time: -1 }});
	}, 
	isLive: function () {
		return this.eventIsLive ? "Live" : "Ended";
	}


});

Template.eventsList.events = {
	'click #addEvent' : function (event) {
		event.preventDefault();

		var eventTitle = document.getElementById('eventT').value;
		var user = Meteor.user();
		if (eventTitle !== '' && eventTitle !== null) {
	        Events.insert({
	          eventTitle: eventTitle,
	          createdBy: user.username,
	          eventIsLive: false,
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