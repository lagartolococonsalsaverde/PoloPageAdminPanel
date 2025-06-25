import React, { useState } from 'react'
import ProductTemplates from './ProductTemplates';
import InputProductTemplate from './InputProductTemplate';
import LoggedinLayout from '../../components/LoggedinLayout';

const ProductTemplatesTabs = () => {

    const [selectedProductTemplateTab, setSelectedProductTemplateTab] = useState('select');
    return (
        <LoggedinLayout>
        <div className='w-full p-2'>

            <div className='w-full p-1.5 bg-white rounded-lg flex justify-center items-center'>
                <div className={`w-full p-2.5 rounded-md cursor-pointer hover:bg-blue-200 transition-colors ${selectedProductTemplateTab === 'select' ? 'bg-blue-500 text-white font-medium' : ''}`}
                    onClick={() => setSelectedProductTemplateTab('select')}>Select Default Product</div>
                <div className={`w-full p-2.5 rounded-md cursor-pointer hover:bg-blue-200 transition-colors ${selectedProductTemplateTab === 'custom' ? 'bg-blue-500 text-white font-medium' : ''}`}
                    onClick={() => setSelectedProductTemplateTab('custom')}>Input Default Product</div>
            </div>

            {selectedProductTemplateTab === "select" && (
                <ProductTemplates />
            )}

            {selectedProductTemplateTab === "custom" && (
                <InputProductTemplate />
            )}


        </div>
        </LoggedinLayout>
    )
}

export default ProductTemplatesTabs