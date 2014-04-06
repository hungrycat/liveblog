Template.navAvatar.helpers({
	userHasAvatar: function () {
		if (Meteor.user()) {
			var u = Meteor.user();
			if (u.avatarUrl !== '' && u.avatarUrl !== null && u.avatarUrl !== undefined ) { return true; }
		};
		return false;
	},
	getAvatarUrl: function () {
		return Meteor.user().avatarUrl;
	}


});