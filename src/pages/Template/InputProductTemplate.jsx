import React, { useState } from 'react'
import { updateDefaultProductTemplate } from '../../services/templates.api';
import { toast } from 'react-toastify';

const InputProductTemplate = () => {
    const [productId, setProductId] = useState("")

    const [defaultLoading, setDefaultLoading] = useState(false);

    const handleMakingDefaultProduct = async () => {
        if (!productId) {
            return toast.info("Please enter a Product Template ID.")
        }

        try {
            setDefaultLoading(true);
            const response = await updateDefaultProductTemplate(productId);
            if (response) {
                toast.success("Default Product Template Updated.");
            }
        } catch (e) {
            console.error(e);
        } finally {
            setDefaultLoading(false);
        }
    };

    return (
        <div className='max-w-lg w-full bg-white rounded-lg p-6 mx-auto mt-10'>
            <p className='text-2xl font-semibold text-center'>Input Product Template ID</p>
            <div className='flex flex-col'>
                <input type="text"
                    placeholder='Enter Product Template ID'
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className='px-3 py-2 rounded-lg bg-gray-100 my-6' />

                <button className='w-fit px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 mx-auto text-white'
                    onClick={handleMakingDefaultProduct}
                    disabled={defaultLoading}>
                    {defaultLoading ? "Making Default..." : "Make it Default"}
                </button>
            </div>
        </div>
    )
}

export default InputProductTemplate