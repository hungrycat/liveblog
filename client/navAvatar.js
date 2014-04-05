Template.navAvatar.events({

	'change input[type=file]': function (e) {
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

				var img = document.createElement("img");

				reader.onload = function (e) {
					//CANVAS
					img.src = e.target.result;
					var canvas = document.createElement('canvas');
					var ctx = canvas.getContext("2d");





					ctx.drawImage(img, 0, 0);

					var MAX_WIDTH = 100;
					var MAX_HEIGHT = 100;
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
					var binaryImg = atob(dataUrl.slice(dataUrl.indexOf('base64')+7,dataUrl.length));
					var length = binaryImg.length;
					var ab = new ArrayBuffer(length);
					var ua = new Uint8Array(ab);
					for (var i = 0; i < length; i++){
						ua[i] = binaryImg.charCodeAt(i);
					}

					//fileData.data = new Uint8Array(reader.result);
					fileData.data = ua;


					Meteor.call("S3upload", fileData, imageData, callback, function(err, url){
						console.log("uploading complete! url is: " + url);
						Session.set('S3url', url);
						Session.set('uploading', false);

						var user = Meteor.user();
						////add the image to the user account

						Users.insert({
				        //   imageURL: url,
				        //   author: user.username,
				        //   eventId: Session.get("currentEvent"),
				        //   time: Date.now()
				        });

					});
				};

				reader.readAsDataURL(file);
			}
		});
	}
});









