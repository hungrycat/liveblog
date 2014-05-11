Template.navAvatar.helpers({
  userHasAvatar: function () {
    if (Meteor.user()) {
      var u = Meteor.user();
      if (u.avatarUrl !== '' && u.avatarUrl !== null && u.avatarUrl !== undefined ) { return true; }
    };
    return false;
  },

  notFacebookUser: function () {
    if ('services' in Meteor.user()) {
      if ('facebook' in Meteor.user().services) {
         return false;
      } else {
        return true;
      }
    } else {
      return true;
    }


  },

  getAvatarUrl: function () {
    return Meteor.user().avatarUrl;
  }



});

Template.navAvatar.events({

  'change #avatar-upload-file': function (e) {
    var files = e.currentTarget.files;
    _.each(files,function(file){
      var reader = new FileReader;
      var fileData = {
        name:file.name,
        size:file.size,
        type:file.type
      };

      var imageData = 'No data';

      var callback = "postImage";

      //Setting uploading to true.

      Session.set('uploading', true);


      if (!file.type.match(/image.*/)) {
        Session.set('uploading', false);
      }
      else{
        //IMAGE CANVAS

        var img = new Image();

        reader.onload = function (e) {
          // CANVAS
          var off = document.getElementById('offscreen');
          off.appendChild(img);


          img.src = e.target.result;


          img.onload = function () {


            // if (img.width) {
            console.log(img.naturalHeight);
            // };

            var canvas = document.createElement('canvas');

            var MAX_WIDTH = 80;
            var MAX_HEIGHT = 80;
            var width = img.width;
            var height = img.height;






             
            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }
            canvas.width = width;
            canvas.height = height;



            var ctx = canvas.getContext("2d");     

            ctx.drawImage(img, 0, 0, width, height);


            var dataUrl = canvas.toDataURL(fileData.type);


            var binaryImg = atob(dataUrl.slice(dataUrl.indexOf('base64') + 7, dataUrl.length));
            var length = binaryImg.length;


            var ab = new ArrayBuffer(length);
            var ua = new Uint8Array(ab);
            for (var i = 0; i < length; i++){
              ua[i] = binaryImg.charCodeAt(i);
            }

            //fileData.data = new Uint8Array(reader.result);
            fileData.data = ua;


            Meteor.call("S3upload", fileData, imageData, callback, function(err, url){

              Session.set('uploading', false);

              if (err) {console.log(err)}
              else { 
                ////add the image to the user account
                Meteor.users.update(
                  { _id: Meteor.userId() }, 
                  { $set: { avatarUrl: url } }
                );
              }
            });
          } 
        };

        reader.readAsDataURL(file);
      }
    });
  }
});


