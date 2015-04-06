Template.read.helpers({
  listPosts: function () {
    return this.eventIsLive ?  Posts.find({eventId: this._id}, { sort: { time: -1 }}) :  Posts.find({eventId: this._id}, { sort: { time: 1 }});
  },

  isLive: function () {
    return this.eventIsLive ? "Live" : "Ended";
  }


});


var postComment = function (event) {
  event.preventDefault();

  var commentText = document.getElementById('commentText').value;
  console.log(commentText);

  if (commentText === '' || commentText === null) {
    return;
  }

  var user = Meteor.user();

  var doc = {
    commentText: commentText,
    eventId: Session.get("currentEvent"),
    time: Date.now(),
  };

  //username & avatar url
  if (user.services && user.services.facebook && user.services.facebook.id) {
    doc.avatarUrl = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
    doc.commentator = user.services.facebook.first_name + " " + user.services.facebook.last_name;
  } else {
    doc.avatarUrl = user.avatarUrl;
    doc.commentator = user.username;
  }


  Comments.insert(doc);

  document.getElementById('commentText').value = '';
  commentText.value = '';



};

Template.read.events({

  'click #submitComment' : function (event) {
    postComment(event);

  },

  'click #submitCommentModal' : function (event) {
    postComment(event);
  },


  //ensures that links open in new window, for some reason we have to override the default event to do that
  'click a[target=_blank]': function (event) {
    event.preventDefault();
    window.open(event.target.href, '_blank');
  }
});



Template.read.rendered = function () {
  //autoresize the new post and edit post textarea
  $(".animated").autosize({append: "\n"});
  $(".animated").trigger('autosize.resize');


};
