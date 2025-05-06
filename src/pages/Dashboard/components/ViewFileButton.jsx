import { useState } from "react";
import { toast } from "react-toastify";
import { fetchFormResponseImage } from "../../../services/dashboard.api";
import SimpleImageModal from "../../../components/SimpleImageModal";

const ViewFileButton = ({ fileUrl }) => {
    const [fetchedFileUrl, setFetchedFileUrl] = useState("")
    const [loading, setLoading] = useState(false);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const handleFileClick = async (e) => {
        e.preventDefault(); // Prevent default behavior of the link

        if (fetchedFileUrl) {
            // window.open(fetchedFileUrl, "_blank"); // Open new URL in a new tab
            setIsImageModalOpen(true)
            return;
        }

        try {
            setLoading(true);
            const imageResponse = await fetchFormResponseImage(fileUrl)
            if (imageResponse) { // Check if imageResponse is valid (not null)
                setFetchedFileUrl(imageResponse); // Store the image base64 in state
            }
            if (imageResponse) {
                setIsImageModalOpen(true)
                // window.open(imageResponse, "_blank"); // Open new URL in a new tab
            } else {
                toast.error("Failed to fetch file URL"); // Handle failure
            }
        } catch (error) {
            console.error("Error fetching file URL:", error);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <button
                onClick={handleFileClick}
                disabled={loading}
                className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md transition-all duration-300 text-sm font-semibold"
            >
                {loading ? "Loading..." : "📂 View File"}
            </button>

            {isImageModalOpen && <SimpleImageModal imageUrl={fetchedFileUrl} isOpen={isImageModalOpen} setIsOpen={setIsImageModalOpen} />}
        </>
    );
};

export default ViewFileButton;
