const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

const uploadToS3 = async (filePath, fileBuffer) => {
  try {
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: filePath,
      Body: fileBuffer,
    };

    const uploadResult = await s3.upload(uploadParams).promise();
    if (process.env.NODE_ENV === "development")
      console.log("uploadResult", uploadResult);

    return { success: true, imageUrl: uploadResult.Location };
  } catch (error) {
    if (process.env.NODE_ENV === "development")
      console.error("Error uploading file to S3:", error);
    return { success: false, error: "Error uploading file to S3" };
  }
};

module.exports = { uploadToS3 };
