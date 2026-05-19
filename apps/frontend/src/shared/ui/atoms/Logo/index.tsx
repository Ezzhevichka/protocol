import Image from 'next/image';

type LogoProps = {
    className?: string;
    alt?: string;
    width?: number;
    height?: number;
    priority?: boolean;
};

export const Logo = ({
    className = '',
    alt = 'PROTOCOL logo',
    width = 200,
    height = 28,
    priority = false,
}: LogoProps) => {
    const croppedImageHeight = Math.ceil(height * 7);
    const croppedImageOffsetTop = Math.round(height * 3.1);

    return (
        <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
            <Image
                src="/general/protocol-logo-image.png"
                alt={alt}
                width={width}
                height={croppedImageHeight}
                priority={priority}
                className="absolute left-0 max-w-none"
                style={{
                    top: -croppedImageOffsetTop,
                    width,
                    height: croppedImageHeight,
                }}
            />
        </div>
    );
};
