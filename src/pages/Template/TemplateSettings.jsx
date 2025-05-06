import React from 'react'
import { Link } from 'react-router-dom'
import LoggedinLayout from '../../components/LoggedinLayout'

const TemplateSettings = () => {
    return (
        <LoggedinLayout>

            <div className='flex items-center justify-center'>
                <div className='w-40 p-1 rounded-lg bg-white mx-auto'>
                    <p className='bg-blue-500 rounded-lg p-2 font-medium mb-2'>SMS Template</p>
                    <Link to={'/sms-templates'} className='w-full p-2 hover:bg-blue-100 transition-all'>List SMS</Link>
                </div>
                <div className='w-40 p-1 rounded-lg bg-white mx-auto'>
                    <p className='bg-blue-500 rounded-lg p-2 font-medium mb-2'>Product Template</p>
                    <Link to={'/product-templates'} className='w-full p-2 hover:bg-blue-100 transition-all'>Product List</Link>
                </div>
            </div>
        </LoggedinLayout>
    )
}

export default TemplateSettings