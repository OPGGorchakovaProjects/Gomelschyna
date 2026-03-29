import { useState, useEffect, useCallback, useRef } from 'react';
import styles from './style.module.scss';
import { CarouselSlide } from './CarouselSlide';
import { CarouselHeader } from './CarouselHeader';
import { CarouselIndicators } from './CarouselIndicators';
import { CarouselNavigation } from './CarouselNavigation';
import { CarouselTouchHandler } from './CarouselTouchHandler';
import { CarouselAutoPlay } from './CarouselAutoPlay';
import { ObjectData } from '@types';

interface ObjectsCarouselProps {
  objects: ObjectData[];
  autoPlayInterval?: number;
}

export const ObjectsCarousel = ({
  objects,
  autoPlayInterval = 5000,
}: ObjectsCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [randomObjects, setRandomObjects] = useState<ObjectData[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const shuffled = [...objects].sort(() => 0.5 - Math.random());
    setRandomObjects(shuffled.slice(0, 5));
  }, [objects]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? randomObjects.length - 1 : prev - 1));
  }, [randomObjects.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev === randomObjects.length - 1 ? 0 : prev + 1));
  }, [randomObjects.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        if (!isVisible) return;
      }

      if (e.key === 'ArrowLeft') {
        handlePrev();
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), autoPlayInterval);
      } else if (e.key === 'ArrowRight') {
        handleNext();
        setIsPaused(true);
        setTimeout(() => setIsPaused(false), autoPlayInterval);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, autoPlayInterval]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  if (randomObjects.length === 0) return null;

  const getVisibleSlides = () => {
    const slides = [];
    const total = randomObjects.length;

    const prevIndex = currentIndex === 0 ? total - 1 : currentIndex - 1;
    slides.push({
      ...randomObjects[prevIndex],
      isActive: false,
    });

    slides.push({
      ...randomObjects[currentIndex],
      isActive: true,
    });

    const nextIndex = currentIndex === total - 1 ? 0 : currentIndex + 1;
    slides.push({
      ...randomObjects[nextIndex],
      isActive: false,
    });

    return slides;
  };

  const handleIndicatorSelect = (index: number) => {
    setCurrentIndex(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), autoPlayInterval);
  };

  const visibleSlides = getVisibleSlides();

  return (
    <section
      ref={sectionRef}
      className={styles.carouselSection}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <CarouselHeader title="Популярные места" />

      <CarouselTouchHandler
        onSwipeLeft={handleNext}
        onSwipeRight={handlePrev}
        isPaused={isPaused}
        setIsPaused={setIsPaused}
        autoPlayInterval={autoPlayInterval}
      >
        <CarouselNavigation
          onPrev={handlePrev}
          onNext={handleNext}
          isPaused={isPaused}
          setIsPaused={setIsPaused}
          autoPlayInterval={autoPlayInterval}
        />

        {visibleSlides.map((object, index) => (
          <CarouselSlide
            key={object.name + index}
            object={object}
            index={index}
          />
        ))}
      </CarouselTouchHandler>

      <CarouselIndicators
        count={randomObjects.length}
        currentIndex={currentIndex}
        onSelect={handleIndicatorSelect}
        autoPlayInterval={autoPlayInterval}
      />

      <CarouselAutoPlay
        onNext={handleNext}
        isPaused={isPaused}
        interval={autoPlayInterval}
      />
    </section>
  );
};
