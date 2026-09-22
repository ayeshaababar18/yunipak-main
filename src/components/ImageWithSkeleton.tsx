import React, { useState } from 'react';

interface ImageWithSkeletonProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  skeletonClassName?: string;
  wrapperClassName?: string;
}

const ImageWithSkeleton: React.FC<ImageWithSkeletonProps> = ({ 
  className = '', 
  skeletonClassName = '', 
  wrapperClassName = '',
  alt = '',
  ...props 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`image-skeleton-wrapper ${wrapperClassName}`} style={{ position: 'relative', display: 'flex', width: props.width || '100%', height: props.height || '100%' }}>
      {/* The Skeleton Loader */}
      {!isLoaded && (
        <div 
          className={`skeleton-pulse ${skeletonClassName}`} 
          style={{ 
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'var(--bg-tertiary, #e2e8f0)',
            borderRadius: props.style?.borderRadius || 'inherit'
          }}
        />
      )}
      
      {/* The Actual Image */}
      <img
        {...props}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        style={{
          ...props.style,
          transition: 'opacity 0.4s ease-in-out',
          opacity: isLoaded ? 1 : 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
        onLoad={(e) => {
          setIsLoaded(true);
          if (props.onLoad) props.onLoad(e);
        }}
      />
    </div>
  );
};

export default ImageWithSkeleton;
