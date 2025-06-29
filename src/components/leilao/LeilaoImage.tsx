import { useState } from "react";

interface LeilaoImageProps {
    src?: string;
    alt: string;
    className: string;
    showIcon?: boolean;
}

export const LeilaoImage = ({ src, alt, className, showIcon = true }: LeilaoImageProps) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    if (imageError || !src) {
        return (
            <div className={`${className} bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center`}>
                {showIcon && (
                    <div className="text-center">
                        <svg 
                            className="w-16 h-16 mx-auto text-orange-400 mb-2" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" 
                            />
                        </svg>
                        <p className="text-xs text-orange-600 font-medium">Leilão</p>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative">
            {imageLoading && (
                <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>
                    <div className="text-gray-400">
                        <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>
            )}
            <img
                src={src}
                alt={alt}
                className={`${className} ${imageLoading ? 'hidden' : ''}`}
                onError={handleImageError}
                onLoad={handleImageLoad}
            />
        </div>
    );
}; 