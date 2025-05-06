import React, { useEffect, useState } from 'react'
import LoggedinLayout from '../../components/LoggedinLayout'
import { useParams } from 'react-router-dom';
import { confirmResponse, fetchFormResponse, fetchFormResponseImage } from '../../services/dashboard.api';
import ProductLinkGenerator from './components/ProductLinkGenerator';
import ImageModal from './components/ImageModal';

const FormResponse = () => {
    const { id } = useParams()
    const [formResponse, setFormResponse] = useState({});
    const [formImage, setFormImage] = useState('');
    const [isImageFetching, setIsImageFetching] = useState(true);
    const [isConfirmLoading, setIsConfirmLoading] = useState(false);
    const [isRefreshRecords, setIsRefreshRecords] = useState(false);

    function bufferToBlobUrl(buffer, contentType) {
        // 1. Create a Blob from the Buffer
        const blob = new Blob([buffer], { type: contentType });

        // 2. Create a URL for the Blob
        const url = URL.createObjectURL(blob);

        return url;
    }

    useEffect(() => {
        const getFormResponse = async () => {
            if (!id) return;
            const response = await fetchFormResponse(id);
            setFormResponse(response);

            const imageResponse = await fetchFormResponseImage(response?.fileUrl)
            if (imageResponse) { // Check if imageResponse is valid (not null)
                setFormImage(imageResponse); // Store the image base64 in state
            }
            setIsImageFetching(false)
        }

        getFormResponse();
    }, [isRefreshRecords])

    const handleConfirmClick = async (responseId) => {
        try {
            setIsConfirmLoading(true);
            const response = await confirmResponse(responseId);
            if (response) {
                setIsRefreshRecords(!isRefreshRecords);
            }
        } catch (error) {
            console.error("Error fetching responses:", error);
        } finally {
            setIsConfirmLoading(false);
        }
    }

    return (
        <LoggedinLayout>
            {formResponse && (
                <div className="w-full max-w-3xl mx-auto mt-6 bg-white shadow-lg rounded-lg overflow-hidden">
                    <h2 className="text-xl font-semibold text-gray-800 bg-gray-100 py-3 px-5 border-b">
                        Form Response Details
                    </h2>

                    <table className="w-full border-collapse">
                        <tbody>
                            <tr className="border-b border-gray-300">
                                <td className="px-5 py-3 font-medium text-gray-700 bg-gray-50">Form ID</td>
                                <td className="px-5 py-3 text-gray-900">{formResponse.formId}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="px-5 py-3 font-medium text-gray-700 bg-gray-50">Pet Name</td>
                                <td className="px-5 py-3 text-gray-900">{formResponse.petName}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="px-5 py-3 font-medium text-gray-700 bg-gray-50">Name</td>
                                <td className="px-5 py-3 text-gray-900">{formResponse.name || "N/A"}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="px-5 py-3 font-medium text-gray-700 bg-gray-50">Phone</td>
                                <td className="px-5 py-3 text-gray-900">{formResponse.phone || "N/A"}</td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="px-5 py-3 font-medium text-gray-700 bg-gray-50">Status</td>
                                <td className="px-5 py-3">
                                    {/* <span className={`px-3 py-1 text-sm font-semibold rounded-full 
                                     ${formResponse.status === "Approved" ? "bg-green-200 text-green-800" :
                                            formResponse.status === "Pending" ? "bg-yellow-200 text-yellow-800" :
                                                "bg-red-200 text-red-800"}
                                        `}>
                                    </span> */}
                                    {formResponse.status || "--"}
                                </td>
                            </tr>
                            <tr className="border-b border-gray-300">
                                <td className="px-5 py-3 font-medium text-gray-700 bg-gray-50">Created</td>
                                <td className="px-5 py-3 text-gray-900">
                                    {new Date(formResponse.created).toLocaleString()}
                                </td>
                            </tr>
                            {formResponse?.fileUrl && (
                                <tr className="">
                                    <td className="px-5 py-3 font-medium text-gray-700 bg-gray-50">File</td>
                                    <td className="px-5 py-3">
                                        {/* <p className="text-blue-600 hover:underline" onClick={() => setOpenImageModal(true)}
                                        href={formResponse.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        >
                                            View File
                                        </p> */}

                                        {isImageFetching ? (
                                            <p className='text-gray-600'>Fetching Image...</p>
                                        ) : (
                                            <ImageModal formResponse={formResponse} image={formImage} altText='Form Image' />
                                        )}
                                    </td>
                                </tr>
                            )}
                            {formResponse?.status === "new-lead" && (
                                <tr className="border-t border-gray-300">
                                    <td className="px-5 py-3 font-medium text-gray-700 bg-gray-50">Confirmation</td>
                                    <td className="px-5 py-3">
                                        <button onClick={() => handleConfirmClick(formResponse?.responseId)}
                                            className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed text-white px-4 py-1 rounded-md transition-all duration-300 text-sm font-semibold"
                                            disabled={formResponse?.status?.toLowerCase() !== 'new-lead'}>
                                            {isConfirmLoading ? "Confirming..." : "Confirm"}</button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* {openImageModal && ( */}
            {/* <ImageModal image={formImage} altText='Form Image' /> */}
            {/* )} */}
            {/* <img src={formImage} alt="" /> */}

            <ProductLinkGenerator
                image={formImage}
                title={formResponse?.petName}
                responseId={formResponse?.responseId}
                mostRecentProductLink={formResponse?.productLink}
            />

        </LoggedinLayout>
    )
}

export default FormResponse