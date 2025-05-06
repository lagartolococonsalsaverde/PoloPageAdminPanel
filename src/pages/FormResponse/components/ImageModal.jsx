import { CrossIcon, DownloadIcon, FlagIcon, X } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import ButtonWithTooltip from '../../../components/ButtonWithTooltip';
import { markAsInappropriate } from '../../../services/dashboard.api';
import { useNavigate } from 'react-router-dom';

Modal.setAppElement('#root');

function ImageModal({ formResponse, image, altText = "Image", showViewButton = true, onMarkAppropriate }) {
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [scale, setScale] = useState(1);
    const [loading, setLoading] = useState(false);
    const imageRef = useRef(null);
    const containerRef = useRef(null);

    const navigate = useNavigate();

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    useEffect(() => {
        if (modalIsOpen) {
            setTimeout(handleFitToContainer, 100);
        }
    }, [modalIsOpen]);

    const handleZoomIn = () => setScale((prev) => prev + 0.2);

    const handleZoomOut = () => setScale((prev) => Math.max(0.5, prev - 0.2));

    const handleFitToContainer = () => {
        if (imageRef.current && containerRef.current) {
            const img = imageRef.current;
            const container = containerRef.current;
            const scaleToFit = Math.max(
                container.clientWidth / img.naturalWidth,
                container.clientHeight / img.naturalHeight
            );
            setScale(scaleToFit * 2);
        }
    };

    const handleMarkAsInappropriate = async () => {
        setLoading(true);
        try {
            const response = await markAsInappropriate(formResponse.responseId);
            if (response) {
                setModalIsOpen(false);
                navigate(`/form-responses-list/${formResponse.formId}/`);
                // onMarkAppropriate();
            } else {
                console.error("Mark as inappropriate operation completed without explicit success.");
            }
        } catch (error) {
            console.error("Error marking as inappropriate:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadImage = () => {
        fetch(image)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.blob();
            })
            .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = "image.jpg"; // Set the desired filename
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            })
            .catch((error) => {
                console.error('Error downloading image:', error);
            });
    };

    const modalStyles = {
        content: {
            width: '85vw',
            height: '85vh',
            borderRadius: 12,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
            backgroundColor: 'white',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
        },
        overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
        },
    };

    return (
        <div>
            {showViewButton && (
                <button className='text-blue-600 hover:underline' onClick={openModal}>View File</button>
            )}
            <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={modalStyles} contentLabel={altText}>
                {loading &&
                    <div className="w-full h-full flex justify-center items-center bg-[#00000099]
                     absolute z-30 top-0 right-0 font-medium text-white">
                        Loading...
                    </div>}

                <div className='flex absolute z-20 top-3 right-1'>
                    <ButtonWithTooltip tooltipText={"Mask as Inappropriate"} onClick={handleMarkAsInappropriate} className='px-3 py-1 text-red-400 hover:text-red-600 rounded-lg text-sm transition-all flex items-center gap-1 mr-1'><FlagIcon size={18} /> </ButtonWithTooltip>
                    <ButtonWithTooltip tooltipText={"Download"} onClick={handleDownloadImage} className='px-3 py-1 text-blue-400 hover:text-blue-500 rounded-lg text-sm transition-all flex items-center gap-1'><DownloadIcon size={18} /> </ButtonWithTooltip>
                    <button onClick={closeModal} className='px-3 py-1 text-gray-400 rounded-lg hover:text-gray-600 transition-all'> <X /> </button>
                </div>
                <div ref={containerRef} className='w-full h-full flex items-center justify-center'>
                    <img
                        src={image}
                        alt={altText}
                        ref={imageRef}
                        style={{
                            transform: `scale(${scale})`,
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            transition: 'transform 0.2s ease-in-out',
                        }}
                        onLoad={handleFitToContainer}
                    />
                </div>
                <div className='absolute bottom-6 left-0 right-0 flex justify-center gap-4'>
                    <button onClick={handleZoomOut} className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg'>-</button>
                    <button onClick={handleFitToContainer} className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg'>Fit</button>
                    <button onClick={handleZoomIn} className='px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg'>+</button>
                </div>
            </Modal>
        </div>
    );
}

export default ImageModal;
