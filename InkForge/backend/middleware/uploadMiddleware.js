
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// ===============================
// Upload directory
// ===============================

const uploadDirectory = path.join(
  __dirname,
  "../uploads"
);

// Create directory if it does not exist
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true
  });
}

// ===============================
// Storage
// ===============================

const storage =
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDirectory);
    },

    filename: (req, file, cb) => {
      const extension =
        path.extname(file.originalname);

      const uniqueName =
        `${Date.now()}-${Math.round(
          Math.random() * 1e9
        )}${extension}`;

      cb(null, uniqueName);
    }
  });

// ===============================
// File validation
// ===============================

const fileFilter = (
  req,
  file,
  cb
) => {
  // ===============================
  // Images
  // ===============================

  if (
    file.fieldname === "image"
  ) {
    const allowedImages = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif"
    ];

    if (
      allowedImages.includes(
        file.mimetype
      )
    ) {
      return cb(null, true);
    }

    return cb(
      new Error(
        "Only JPG, PNG, WEBP, and GIF images are allowed."
      )
    );
  }

  // ===============================
  // Videos
  // ===============================

  if (
    file.fieldname === "video"
  ) {
    const allowedVideos = [
      "video/mp4",
      "video/webm",
      "video/quicktime"
    ];

    if (
      allowedVideos.includes(
        file.mimetype
      )
    ) {
      return cb(null, true);
    }

    return cb(
      new Error(
        "Only MP4, WEBM, and MOV videos are allowed."
      )
    );
  }

  cb(
    new Error(
      "Unsupported media field."
    )
  );
};

// ===============================
// Multer configuration
// ===============================

const upload = multer({
  storage,
  fileFilter,

  limits: {
    fileSize: 100 * 1024 * 1024
  }
});

// ===============================
// Post media
// ===============================

const uploadPostMedia =
  upload.fields([
    {
      name: "image",
      maxCount: 1
    },
    {
      name: "video",
      maxCount: 1
    }
  ]);

module.exports =
  uploadPostMedia;