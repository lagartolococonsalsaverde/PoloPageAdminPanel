import React, { useState, useRef } from 'react';

const ButtonWithTooltip = ({ children, onClick, tooltipText, ...rest }) => {
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const buttonRef = useRef(null);

    return (
        <div style={{ position: 'relative', display: 'inline-block' }}>
            <button
                ref={buttonRef}
                onClick={onClick}
                onMouseEnter={() => setIsTooltipVisible(true)}
                onMouseLeave={() => setIsTooltipVisible(false)}
                {...rest} // Spread any additional props
            >
                {children}
            </button>

            {isTooltipVisible && tooltipText && (
                <div
                    style={{
                        position: 'absolute',
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '5px',
                        top: '120%', // Adjust as needed
                        left: '50%',
                        transform: 'translateX(-50%)',
                        whiteSpace: 'nowrap',
                        zIndex: 10,
                        fontSize: 14,
                    }}
                >
                    {tooltipText}
                </div>
            )}
        </div>
    );
};

export default ButtonWithTooltip;