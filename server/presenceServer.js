var connections = {};

var expire = function(id) {
  Presences.remove(id);
  delete connections[id];
};

var tick = function(id) {
  connections[id].lastSeen = Date.now();
};

Meteor.startup(function() {
  Presences.remove({});
});

Meteor.onConnection(function(connection) {
  // console.log('connectionId: ' + connection.id + ' userId: ' + this.userId);
  Presences.upsert(connection.id, { $set: {}});
  connections[connection.id] = {};
  tick(connection.id);

  connection.onClose(function() {
    // console.log('connection closed: ' + connection.id);
    expire(connection.id);
  });
});

Meteor.methods({
  updatePresence: function(state) {
    check(state, Match.Any);
    if (this.connection.id) {
      // console.log('updatePresence: ' + this.connection.id);
      var update = { $set: {} };
      update.$set.state = state;
      if (this.userId)
        update.$set.userId = this.userId;
      else
        update.$unset = { userId: '' };
      
      Presences.update(this.connection.id, update);
    }
  },
  presenceTick: function() {
    check(arguments, [Match.Any]);
    if (this.connection && connections[this.connection.id])
      tick(this.connection.id);
  }
});

Meteor.setInterval(function() {
  //expece online user to check in at least once every 4 min.
  _.each(connections, function(connection, id) {
    if (connection.lastSeen < (Date.now() - 240000))
      expire(id);
  });
}, 5000); // Update our user count every 5 seconds
