Accounts.ui.config({ passwordSignupFields: 'USERNAME_ONLY' });

// autopublish package is not installed!


//when editing a post, set id of the post
Session.setDefault('editing_postname', null);


Template.main.helpers({
	EventsListPageRedirect: function () {
		Router.go('/eventsList');
	}


});

