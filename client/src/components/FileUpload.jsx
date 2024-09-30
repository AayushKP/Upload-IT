import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("Choose File");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [manipulatedImage, setManipulatedImage] = useState(null); // State for manipulated image
  const [uploadError, setUploadError] = useState("");
  const [previewUrl, setPreviewUrl] = useState(null); // State for file preview

  const onChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile.name);

    // Preview the file if it's an image or a PDF
    if (selectedFile) {
      if (selectedFile.type.startsWith("image/")) {
        const fileReader = new FileReader();
        fileReader.onload = () => {
          setPreviewUrl(fileReader.result); // Set the preview URL for images
        };
        fileReader.readAsDataURL(selectedFile);
      } else if (selectedFile.type === "application/pdf") {
        setPreviewUrl(URL.createObjectURL(selectedFile)); // Create a URL for PDF preview
      } else {
        setPreviewUrl(null); // Reset preview for unsupported file types
      }
    } else {
      setPreviewUrl(null); // Reset if no file is selected
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:3000/api/file/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token in headers
          },
        }
      );

      const { filePath } = res.data;
      setUploadedFile(filePath);
      setFileName("Choose File");
      setFile(null);
      setPreviewUrl(null);
      setUploadError("");

      const manipulateRes = await axios.post(
        "http://localhost:3000/api/file/manipulate",
        { imagePath: filePath },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token in headers
          },
        }
      );

      const { manipulatedImage } = manipulateRes.data; // Get the manipulated image path
      setManipulatedImage(manipulatedImage); // Set manipulated image state
    } catch (err) {
      console.error("File upload error:", err);
      setUploadError("File isn't an image, can't be processed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-500">
      <div className="bg-white p-8 rounded-lg shadow-md w-1/3">
        <h2 className="text-3xl font-bold text-center mb-4">File Upload</h2>
        <form onSubmit={onSubmit}>
          {uploadError && (
            <p className="text-red-500 text-xs italic mb-4">{uploadError}</p>
          )}
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="file"
            >
              {fileName}
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="file"
              type="file"
              onChange={onChange}
              required
            />
          </div>

          {/* Preview Section */}
          {previewUrl && (
            <div className="mb-4">
              {file && file.type.startsWith("image/") ? (
                <img
                  src={previewUrl}
                  alt="File Preview"
                  className="w-full h-auto rounded-lg border border-gray-300"
                />
              ) : file && file.type === "application/pdf" ? (
                <iframe
                  src={previewUrl}
                  title="PDF Preview"
                  className="w-full h-60 border border-gray-300"
                />
              ) : (
                <p className="text-gray-700">File selected: {fileName}</p>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <button
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded w-full"
              type="submit"
            >
              Upload
            </button>
          </div>
          {uploadedFile && (
            <p className="mt-4 text-green-600">File uploaded: {uploadedFile}</p>
          )}
        </form>

        {/* Display Manipulated Image */}
        {manipulatedImage && (
          <div className="mt-4">
            <h3 className="text-lg font-bold">Manipulated Image:</h3>
            <img
              src={`http://localhost:3000/${manipulatedImage}`} // Assuming your server serves images from this base URL
              alt="Manipulated Preview"
              className="w-full h-auto rounded-lg border border-gray-300"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
