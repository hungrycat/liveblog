Events = new Meteor.Collection('events');
	// eventTitle: eventTitle,
	// adminUsers: [ user.username, ]
	// eventIsLive: false,
	// time: Date.now()



Posts = new Meteor.Collection('posts');

	// postText: postText,
	// author: user.username,
	// eventId: this._id,
	// time: Date.now()
	// postIsComment: BOOL
	// avatarUrl: url
	// timeEU: timeEUString



Comments = new Meteor.Collection('comments');

	// commentText: commentText,
	// author: "commentator"
	// eventId: this._id,
	// time: Date.now()


//Users  
	// avatarUrl: s3

