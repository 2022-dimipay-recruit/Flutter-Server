import {DateTime} from 'luxon';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    cb(
      null,
      DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss') + '-' + file.originalname,
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 20,
  },
});

export default upload;
