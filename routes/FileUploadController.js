var fs = require('fs');
var crypto = require('crypto');
var path = require('path');

var FileUploadController = function() {};

FileUploadController.prototype.uploadFile = function(req, res) {
  /**
   * The following takes the blob uploaded to an arbitrary location with
   * a random file name and copies it to the specified file.path with the file.name.
   * Note that the file.name should come from your upload request on the client side
   * because when the file is selected it is paired with its name. The file.name is
   * not random nor is the file.path.
   */
  fs.readFile(req.files.file.path, function (err, data) {
    var file = req.files.file;

    // set the correct path for the file not the temporary one from the API:
    var tid = (new Date().getTime()).toString();
    var hash = crypto.createHash('md5').update(tid).digest('hex');
    file.path = path.join(__dirname, '../upload/pdf/' + hash + '.pdf');

    // copy the data from the req.files.file.path and paste it to file.path
    fs.writeFile(file.path, data, function (err) {
      if (err) {
        res.json({mod: false, data: err});
      }else {
        res.json({mod: true, data: hash});
      }

    });
  });

}

module.exports = new FileUploadController();
