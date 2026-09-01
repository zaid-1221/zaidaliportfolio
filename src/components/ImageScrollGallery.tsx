import { useState } from "react";
import { MdChevronLeft, MdChevronRight } from "react-icons/md";
import "./styles/ImageScrollGallery.css";

interface Props {
  images: string[];
  alt: string;
  className?: string;
}

const ImageScrollGallery = ({ images, alt, className }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const hasMultiple = images.length > 1;

  const goPrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((index) => (index === 0 ? images.length - 1 : index - 1));
  };

  const goNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((index) => (index === images.length - 1 ? 0 : index + 1));
  };

  return (
    <div className={`image-gallery${className ? ` ${className}` : ""}`}>
      <img
        src={images[currentIndex]}
        alt={`${alt} screenshot ${currentIndex + 1}`}
        loading="lazy"
        decoding="async"
      />
      {hasMultiple && (
        <>
          <button
            type="button"
            className="image-gallery-arrow image-gallery-arrow--left"
            onClick={goPrev}
            aria-label="Previous image"
            data-cursor="disable"
          >
            <MdChevronLeft />
          </button>
          <button
            type="button"
            className="image-gallery-arrow image-gallery-arrow--right"
            onClick={goNext}
            aria-label="Next image"
            data-cursor="disable"
          >
            <MdChevronRight />
          </button>
        </>
      )}
    </div>
  );
};

export default ImageScrollGallery;
