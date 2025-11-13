import { useState } from "react";
import Image from "next/image";

const DaoImage: React.FC<{ src: string; alt: string }> = ({ src, alt }) => {
    const [imageSrc, setImageSrc] = useState(src);

    const handleImageError = () => {
        setImageSrc("/dao-1.png");
    };

    return (
        <Image
            src={imageSrc}
            width={48}
            height={48}
            alt={alt}
            className="w-12 h-12 rounded-full object-cover"
            unoptimized={true}
            onError={handleImageError}
        />
    );
};

export default DaoImage