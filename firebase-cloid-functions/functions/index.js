const functions = require('firebase-functions');
const os = require('os');
const path = require('path');
var cors = require('cors')({ origin: true });
const BusBoy = require('busboy');
const fs = require('fs');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

const { Storage } = require('@google-cloud/storage');

const gcs = new Storage({
    projectId: 'handy-record-185005',
	keyFilename: 'handy-record-185005-firebase-adminsdk-ap6i0-675cd36937.json'
})

exports.uploadFile = functions.https.onRequest((req, res) => {
	cors(req, res, () => {
		if (req.method !== 'POST') {
			return res.status(500).json({
				message: 'Not allowed'
			});
		}
		const busboy = new BusBoy({ headers: req.headers });
		let uploadData = null;

		busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
			const filepath = path.join(os.tmpdir(), filename);
			uploadData = { file: filepath, type: mimetype };
			file.pipe(fs.createWriteStream(filepath));
		});
		busboy.on('finish', () => {
			const bucket = gcs.bucket('handy-record-185005.appspot.com');
			return bucket
				.upload(uploadData.file, {
					uploadType: 'media',
					metaData: {
						metaData: {
							contentType: uploadData.type
						}
					}
				})
				.then(() => {
					return res.status(200).json({
						message: 'It worked!'
					});
				})
				.catch((err) => {
					res.status(500).json({
						error: err
					});
				});
		});
		busboy.end(req.rawBody);
	});
});
