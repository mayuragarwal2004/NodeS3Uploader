# NodeS3Uploader - Image/Files Upload to Amazon S3 Server

This project provides an Express.js server for uploading images to Amazon S3 storage. It includes features like image compression and file size limits before uploading.

## Prerequisites

Before running the server, you need to have the following:

- Node.js installed on your machine
- An AWS account with an S3 bucket created
- Access key ID and secret access key for your AWS account

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mayuragarwal2004/NodeS3Uploader.git
   ```

2. Navigate to the project directory:

   ```bash
   cd NodeS3Uploader
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file based on the `.env.example` provided and fill in your AWS credentials and other configuration options.

## Usage

To start the server, run:

```bash
npm start
```

By default, the server will run on port 5000. You can change this by modifying the `PORT` variable in the `.env` file.

## API Endpoints

### `POST /upload/single`

This endpoint accepts a single image file upload. It expects a `file` parameter containing the image file. Optionally, you can provide a `folderName` parameter to specify a folder in your S3 bucket where the image will be stored.

#### Example Usage:

```bash
curl -X POST -F "file=@path/to/image.jpg" -F "folderName=myFolder" http://localhost:5000/upload/single
```

### Response:

- `200 OK` on success, along with the URL of the uploaded image in the response body.
- `400 Bad Request` if no file is uploaded or if the file size exceeds the limit after compression.
- `500 Internal Server Error` if there's an issue with the server or the S3 upload process.

#### Accessing the Image URL

Upon successful upload, the server will respond with a JSON object containing the URL of the uploaded image. You can access this URL from the `imageUrl` field in the response body.

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

This project is licensed under the [MIT License](LICENSE).