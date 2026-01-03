import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const FacebookPixel = () => {
    const location = useLocation();

    useEffect(() => {
        // @ts-ignore
        if (typeof window.fbq === 'function') {
            // @ts-ignore
            window.fbq('track', 'PageView');
        }
    }, [location]);

    return null;
};

export default FacebookPixel;
