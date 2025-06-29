import { useState } from "react";

interface ProfileImageProps {
    src?: string;
    alt: string;
    className: string;
    size?: "sm" | "md" | "lg";
    onClick?: () => void;
}

export const ProfileImage = ({ src, alt, className, size = "md", onClick }: ProfileImageProps) => {
    const [imageError, setImageError] = useState(false);
    const [imageLoading, setImageLoading] = useState(true);

    const handleImageError = () => {
        setImageError(true);
        setImageLoading(false);
    };

    const handleImageLoad = () => {
        setImageLoading(false);
    };

    // Se não há src ou houve erro, mostrar ícone de usuário
    if (imageError || !src) {
        const sizeClasses = {
            sm: "w-8 h-8",
            md: "w-12 h-12", 
            lg: "w-16 h-16"
        };

        return (
            <div 
                className={`${className} ${sizeClasses[size]} bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center ${onClick ? 'cursor-pointer' : ''}`}
                onClick={onClick}
            >
                <svg 
                    className={`${size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-8 h-8"} text-orange-600`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" 
                    />
                </svg>
            </div>
        );
    }

    return (
        <div className="relative">
            {imageLoading && (
                <div className={`${className} bg-gray-200 animate-pulse rounded-full flex items-center justify-center ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
                    <div className="text-gray-400">
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    </div>
                </div>
            )}
            <img
                src={src}
                alt={alt}
                className={`${className} ${imageLoading ? 'hidden' : ''} ${onClick ? 'cursor-pointer' : ''}`}
                onError={handleImageError}
                onLoad={handleImageLoad}
                onClick={onClick}
            />
        </div>
    );
}; 