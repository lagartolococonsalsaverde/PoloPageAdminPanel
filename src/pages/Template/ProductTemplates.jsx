import React, { useEffect, useState, useRef, useCallback } from "react";
import ReactModal from "react-modal";
import { CheckCircle } from "lucide-react";
import { fetchProductTemplates, updateDefaultProductTemplate } from "../../services/templates.api";
import LoggedinLayout from "../../components/LoggedinLayout";
import { toast } from "react-toastify";

ReactModal.setAppElement("#root");
const ProductTemplates = () => {
    const [productTemplates, setProductTemplates] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loading, setLoading] = useState(false);
    const [defaultLoading, setDefaultLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const isFirstFetch = useRef(true);
    const observer = useRef(); // Store observer instance

    const lastElementRef = useCallback((node) => {
        if (loading || !hasMore) return;

        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                setPage((prev) => prev + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {

        // if (isFirstFetch.current) {
        //     console.log("INSIDE PRODUCT TEMPLATES: useeffect: isFirstFetch")
        //     isFirstFetch.current = false; // Prevent duplicate calls in Strict Mode
        //     return;
        // }

        const getProductTemplates = async () => {
            setLoading(true);
            try {
                const response = await fetchProductTemplates(page);
                if (!response?.response?.length) {
                    setHasMore(false);
                } else {
                    setProductTemplates((prev) => [...prev, ...response.response]);
                }
            } catch (e) {
                console.error("Failed to fetch product templates:", e);
            } finally {
                setLoading(false);
            }
        };

        getProductTemplates();
    }, [page]);

    const handleMakingDefaultProduct = async () => {
        try {
            setDefaultLoading(true);
            await updateDefaultProductTemplate(selectedProduct.id);
            toast.success("Default Product Template Updated.");
        } catch (e) {
            console.error(e);
        } finally {
            setDefaultLoading(false);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
                {productTemplates.map((product, index) => (
                    <div
                        key={product.id}
                        ref={index === productTemplates.length - 1 ? lastElementRef : null}
                        className="relative bg-white rounded-lg shadow-md cursor-pointer overflow-hidden hover:shadow-lg transition-all group"
                        onClick={() => setSelectedProduct(product)}
                    >
                        <img
                            src={product.images[0]?.src || "https://via.placeholder.com/150"}
                            alt={product.title}
                            className="w-full h-40 object-cover group-hover:scale-105 transition-all"
                        />
                        <div className="p-3 bg-white">
                            <h3 className="text-sm font-semibold truncate">{product.title}</h3>
                            <p className="text-xs text-gray-500 truncate">{product.handle}</p>
                        </div>
                        {product.is_default && (
                            <CheckCircle className="absolute top-2 right-2 text-green-500" size={20} />
                        )}
                    </div>
                ))}
            </div>

            {/* Loader for pagination */}
            {loading && <p className="w-full py-6 text-white text-center">Loading more templates...</p>}

            {/* Modal for product details */}
            <ReactModal
                isOpen={!!selectedProduct}
                onRequestClose={() => setSelectedProduct(null)}
                className="fixed inset-0 flex items-center justify-center bg-[#00000022] bg-opacity-50 backdrop-blur-sm p-4"
                overlayClassName="fixed inset-0 bg-[#00000022] bg-opacity-50 backdrop-blur-sm"
            >
                {selectedProduct && (
                    <div className="relative bg-white py-4 px-5 rounded-xl shadow-lg w-full max-w-md">
                        <button
                            className="absolute top-2 right-3 font-semibold text-gray-500 hover:text-gray-700"
                            onClick={() => setSelectedProduct(null)}
                        >
                            ✕
                        </button>
                        <img
                            src={selectedProduct.images[0]?.src || "https://via.placeholder.com/300"}
                            alt={selectedProduct.title}
                            className="w-full h-72 object-contain rounded-lg"
                        />
                        <h2 className="text-lg font-bold mt-2 px-2">{selectedProduct.title}</h2>
                        <p className="text-sm text-gray-500 px-2">Handle: {selectedProduct.handle}</p>
                        <button
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white transition-all rounded-md font-medium mx-auto block mt-4"
                            onClick={handleMakingDefaultProduct}
                            disabled={defaultLoading}
                        >
                            {defaultLoading ? "Saving..." : "Make it Default"}
                        </button>
                    </div>
                )}
            </ReactModal>
        </>
    );
};

export default ProductTemplates;
