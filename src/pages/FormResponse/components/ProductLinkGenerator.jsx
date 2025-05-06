import { useEffect, useState } from "react";
import {
  sendProductLink,
  uploadImageAndGenerateProductLink,
} from "../../../services/dashboard.api";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

const ProductLinkGenerator = ({ title, image, mostRecentProductLink, responseId }) => {
  const { id } = useParams();
  const [selectedFile, setSelectedFile] = useState(null);
  const [calendarImage, setCalendarImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [previewCalendar, setPreviewCalendar] = useState(null);
  const [productLink, setProductLink] = useState(mostRecentProductLink || null);
  const [loading, setLoading] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isImmediate, setIsImmediate] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    setSelectedFile(image);
  }, [image]);

  useEffect(() => {
    setProductLink(mostRecentProductLink);
  }, [mostRecentProductLink]);

  // Handle File Selection
  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      setProductLink(null);
      setCopySuccess(false);
    }
  };

  // Handle File Selection
  const handleCalendarFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setCalendarImage(file);
      setPreviewCalendar(URL.createObjectURL(file));
      setProductLink(null);
      setCopySuccess(false);
    }
  };

  const base64ToFile = (base64String, fileName) => {
    const arr = base64String.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, { type: mime });
  };

  const getFileFromSelectedImage = (selectedImage) => {
    if (!selectedImage) {
      console.error("No image selected.");
      return null;
    }

    // Check if it's a File object
    if (selectedImage instanceof File) {
      console.log("Selected image is already a File.");
      return selectedImage;
    }

    // Check if it's a Base64 string (usually starts with "data:image/")
    if (
      typeof selectedImage === "string" &&
      selectedImage.startsWith("data:image/")
    ) {
      console.log("Selected image is a Base64 string, converting to File...");
      return base64ToFile(selectedImage, "uploaded-image.jpg");
    }

    console.error(
      "Selected image is neither a File nor a valid Base64 string."
    );
    return null;
  };

  // API Call to Generate Product Link
  const handleGenerateProductLink = async () => {
    const imageFile = getFileFromSelectedImage(selectedFile);

    if (!imageFile) return;

    const calendarImageFile = getFileFromSelectedImage(calendarImage);

    if (!calendarImageFile) {
      toast.error("Calendar Image is Required.");
      return;
    }

    setLoading(true);

    try {
      const response = await uploadImageAndGenerateProductLink(
        responseId,
        title,
        imageFile,
        calendarImageFile
      );
      if (response.productUrl) {
        setProductLink(response.productUrl);
      }
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  // Copy URL to Clipboard
  const handleCopy = () => {
    if (productLink) {
      navigator.clipboard.writeText(productLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  // Send Link via API
  const handleSendLink = async () => {
    if (!productLink) return;

    try {
      const response = await sendProductLink(id, productLink, isImmediate, phoneNumber);
      if (response) {
        toast.success("Link Sent Successfully!");
      }
    } catch (error) {
      console.error("Error sending link:", error);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-10 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
        Generate Product Link
      </h2>

      {/* File Input */}
      <label
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        className="mb-3"
      >
        Add Cover Photo{" "}
        <span
          style={{
            fontSize: 12,
            color: "grey",
            marginLeft: 2,
          }}
        >
          (Optional)
        </span>
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="w-full border border-gray-300 text-center rounded-lg p-4 text-gray-700 mb-3 cursor-pointer"
      />
      {preview && (
        <div className="mb-5">
          <img
            src={preview}
            alt="Selected Image"
            width={200}
            height={200}
            className="rounded-lg mx-auto"
          />
        </div>
      )}

      <label
        style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
        className="mb-3"
      >
        Add Calendar Image
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleCalendarFileChange}
        className="w-full border border-gray-300 text-center rounded-lg p-4 text-gray-700 mb-5 cursor-pointer"
      />

      {/* Calendar Image Preview */}
      {previewCalendar && (
        <div className="mb-5">
          <img
            src={previewCalendar}
            alt="Selected Image"
            width={200}
            height={200}
            className="rounded-lg mx-auto"
          />
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerateProductLink}
        disabled={!selectedFile || loading}
        className={`w-full px-4 py-2 rounded-lg text-white font-medium transition-all disabled:bg-blue-400 disabled:!cursor-not-allowed ${loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
          }`}
      >
        {loading ? "Generating..." : "Generate Product Link"}
      </button>

      {/* Generated URL */}
      {productLink && (
        <div className="mt-5">
          <label className="text-gray-600 text-sm">Generated URL</label>
          <div className="relative mt-2 flex">
            <input
              type="text"
              value={productLink}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 text-gray-800"
            />
            <button
              onClick={handleCopy}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 bg-gray-200 rounded text-sm hover:bg-gray-300"
            >
              {copySuccess ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      )}

      {/* Phone Number Input */}
      {productLink && (
        <div className="mt-4">
          <label className="text-gray-600 text-sm">Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Enter phone number"
            className="w-full p-2 border border-gray-300 rounded-md mt-1"
          />
        </div>
      )}

      {/* Send Link Button */}
      {productLink && (
        <>
          <div className="flex items-center mb-5 mt-1.5">
            <input
              type="checkbox"
              id="immediate"
              checked={isImmediate}
              onChange={(e) => setIsImmediate(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="immediate" className="text-sm text-gray-600">
              Send immediately
            </label>
          </div>
          <button
            onClick={handleSendLink}
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
          >
            Send Link
          </button>
        </>
      )}
    </div>
  );
};

export default ProductLinkGenerator;
