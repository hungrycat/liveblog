Router.configure({
  waitOn: function () {
   return Meteor.subscribe('events');
  }, 
  loadingTemplate: 'loading'
});


Router.map( function () {
	this.route('main', {
		path: '/'
	});
	this.route('eventsList', {
		// path: '/eventsList',
		// template: 'eventsList',
		onBeforeAction: function() {
			if (Meteor.loggingIn()) {
                // this.render(this.loadingTemplate);
            } else if (!Roles.userIsInRole(Meteor.user(), ['admin'])) {
				Log('Redirecting');
				this.redirect('/');
			}
		},
		waitOn: function () {
			return Meteor.subscribe('yourAvatar', Meteor.userId());
		},
		data: function () { return Events.find({}) }
	});
	this.route('eventLive', {
		path: '/event/:event_id', 
		onBeforeAction: function () {
			Session.set("currentEvent", this.params.event_id);
			if (Meteor.loggingIn()) {
                // this.render(this.loadingTemplate);
            } else if(!Roles.userIsInRole(Meteor.user(), ['admin'])) {
				Log('Redirecting');
				this.redirect('/');
			}
		},
		template: 'eventLive',
		waitOn: function () { 
			return [ Meteor.subscribe('posts', this.params.event_id), 
					Meteor.subscribe('comments', this.params.event_id), 
					Meteor.subscribe('yourAvatar', Meteor.userId()
						)];
		},
		data: function() { 
			return Events.findOne(this.params.event_id); }
	});

	this.route('read', {
		path: '/read/:event_id', 
		onBeforeAction: function () {
			Session.set("currentEvent", this.params.event_id);
		},
		template: 'read',
		waitOn: function () { 
			return Meteor.subscribe('posts', this.params.event_id);
		},
		data: function() { 
			return Events.findOne(this.params.event_id); 
		}
	});
});
