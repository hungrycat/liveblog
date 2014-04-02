Router.configure({
  waitOn: function () {
    return Meteor.subscribe('events');
  }
});


Router.map( function () {
	this.route('main', {
		path: '/'
	});
	this.route('eventsList', {
		// path: '/eventsList',
		// template: 'eventsList',
		data: function () { return Events.find({}) }
	});
	this.route('eventLive', {
		path: '/event/:event_id', 
		template: 'eventLive',
		waitOn: function () { 
			return Meteor.subscribe('posts', this.params.event_id);
		},
		data: function() { 
			return Events.findOne(this.params.event_id); }
	});
});