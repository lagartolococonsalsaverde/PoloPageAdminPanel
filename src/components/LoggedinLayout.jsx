import React from 'react'
import Navbar from './Navbar'

const LoggedinLayout = ({ children  }) => {
    return (
        <>
            <Navbar />
            {children}
        </>
    )
}

export default LoggedinLayout