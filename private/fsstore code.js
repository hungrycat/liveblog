////server///


///s3

var imageStore = new FS.Store.S3("images", {
  region: "us-west-2", //required, or use endpoint option
  accessKeyId: "AKIAJODG7HGKEOAGMW7Q", //required if env vars not set
  secretAccessKey: "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", //same
  bucket: "liveblog", //required
});

var thumbStore = new FS.Store.S3("thumbs", {
  region: "us-west-2", //required, or use endpoint option
  accessKeyId: "AKIAJODG7HGKEOAGMW7Q", //required if env vars not set
  secretAccessKey: "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", //same
  bucket: "liveblog", //required
  transformWrite: function(fileObj, readStream, writeStream) {

          // Transform the image into a 10x10px thumbnail
          this.gm(readStream, fileObj.name).resize('40', '40').stream().pipe(writeStream);

          // To pass it through:
          //readStream.pipe(writeStream);
        }
});

Images = new FS.Collection("images", {
  stores: [imageStore, thumbStore], 
  filter: {
      allow: {
        contentTypes: ['image/*'] //allow only images in this FS.Collection
      }
    }
});


/// client


///s3

var imageStore = new FS.Store.S3("images", {
  region: "us-west-2", //required, or use endpoint option
  bucket: "liveblog", //required
});

var thumbStore = new FS.Store.S3("thumbs", {
  region: "us-west-2", //required, or use endpoint option
  bucket: "liveblog", //required
  transformWrite: function(fileObj, readStream, writeStream) {

          // Transform the image into a 10x10px thumbnail
          this.gm(readStream, fileObj.name).resize('40', '40').stream().pipe(writeStream);

          // To pass it through:
          //readStream.pipe(writeStream);
        }
});

Images = new FS.Collection("images", {
  stores: [imageStore, thumbStore], 
  filter: {
      allow: {
        contentTypes: ['image/*'] //allow only images in this FS.Collection
      }
    }
});