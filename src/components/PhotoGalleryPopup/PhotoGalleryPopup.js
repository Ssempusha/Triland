import React, { useEffect, useRef, useState } from "react";
import "./PhotoGalleryPopup.css";

function PhotoGalleryPopup({ photo, onClose, photoItems }) {
  // Состояние для отслеживания текущего индекса отображаемой фотографии
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(null);
  // Состояние для отслеживания, находится ли попап в начале или конце фотогалереи
  const [isEndOfPhotos, setIsEndOfPhotos] = useState(false);
  const [isStartOfPhotos, setIsStartOfPhotos] = useState(false);

  useEffect(() => {
    // Установка текущего индекса фотографии и состояний начала/конца
    setCurrentPhotoIndex(photoItems.indexOf(photo));
    setIsEndOfPhotos(false);
    setIsStartOfPhotos(photoItems.indexOf(photo) === 0);
  }, [photo, photoItems]);

  const imageRef = useRef(null);

  // Функция для закрытия попапа только при клике на overlay
  const handleOverlayClick = (e) => {
    if (e.target === imageRef.current) {
      onClose();
    }
  };

  // Функция для перехода к следующей фотографии
  const handleNextPhoto = () => {
    if (isEndOfPhotos) {
      return;
    }

    setCurrentPhotoIndex((prevIndex) => {
      const newIndex = prevIndex + 1;
      if (newIndex === photoItems.length - 1) {
        setIsEndOfPhotos(true);
        setIsStartOfPhotos(false);
      } else if (newIndex === photoItems.length) {
        return prevIndex;
      } else {
        setIsEndOfPhotos(false);
        setIsStartOfPhotos(false);
      }
      return newIndex;
    });
  };

  // Функция для перехода к предыдущей фотографии
  const handlePreviousPhoto = () => {
    if (isStartOfPhotos) {
      return;
    }

    setCurrentPhotoIndex((prevIndex) => {
      if (prevIndex === 0) {
        setIsStartOfPhotos(true);
        setIsEndOfPhotos(false);
        return photoItems.length - 1;
      } else {
        setIsEndOfPhotos(false);
        setIsStartOfPhotos(false);
        return prevIndex - 1;
      }
    });
  };

  // Обработчик нажатия клавиши 'Esc' для закрытия попапа
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.keyCode === 27) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  return (
    <div className="overlay" onClick={handleOverlayClick} ref={imageRef}>
      <section className="photo-popup">
        <button
          className="photo-popup__button-closed"
          onClick={onClose}
        ></button>
        <button
          className={`photo-popup__button ${
            isStartOfPhotos ? "button-left-disabled" : "button-left"
          }`}
          onClick={handlePreviousPhoto}
        ></button>
        <img
          className="photo-popup__image"
          src={photoItems[currentPhotoIndex]}
          alt={photoItems[currentPhotoIndex]}
        />
        <button
          className={`photo-popup__button ${
            isEndOfPhotos ? "button-right-disabled" : "button-right"
          }`}
          onClick={handleNextPhoto}
        ></button>
      </section>
    </div>
  );
}

export default PhotoGalleryPopup;