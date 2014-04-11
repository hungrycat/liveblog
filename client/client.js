Accounts.ui.config({ passwordSignupFields: 'USERNAME_ONLY' });

// autopublish package is not installed!


//when editing a post, set id of the post
Session.setDefault('editing_post_id', null);


Session.setDefault('editing_comment_id', null);

Template.main.helpers({
	EventsListPageRedirect: function () {
		Router.go('/eventsList');
	}, 
	isAdminUser: function() {
		return Roles.userIsInRole(Meteor.user(), ['admin']);
	}


});


