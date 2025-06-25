import React, { useEffect, useState } from "react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const SimpleImageModal = ({ imageUrl, altText = "Image", isOpen, setIsOpen }) => {
    const [modalIsOpen, setModalIsOpen] = useState(false);

    useEffect(() => {
        setModalIsOpen(isOpen);
    }, [isOpen])

    return (
        <div>
            {/* Open Modal Button */}
            {/* <button
                className="text-blue-600 hover:underline"
                onClick={() => setModalIsOpen(true)}
            >
                View Image
            </button> */}

            {/* Modal */}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => { setModalIsOpen(false); setIsOpen(false) }}
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <div className="relative bg-white p-4 rounded-lg shadow-lg max-w-lg w-full">
                    {/* Close Button */}
                    <button
                        className="absolute top-2 right-2 text-white hover:text-gray-100 text-xs font-semibold px-2 py-1.5 bg-red-600 hover:bg-red-700 rounded-full"
                        onClick={() => { setModalIsOpen(false); setIsOpen(false) }}
                    >
                        ✕
                    </button>

                    {/* Image */}
                    <img
                        src={imageUrl}
                        alt={altText}
                        className="max-w-full h-auto rounded-md"
                    />
                </div>
            </Modal>
        </div>
    );
};

export default SimpleImageModal;
