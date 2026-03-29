import { useEffect, useState } from 'react';

export interface PwaDetectionResult {
  isPwa: boolean;
  isMobilePwa: boolean;
}

const isStandalone = () => {
  // iOS
  if ((window.navigator as any).standalone) return true;
  // Android and others
  if (window.matchMedia('(display-mode: standalone)').matches) return true;
  return false;
};

const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

export const usePwaDetection = (): PwaDetectionResult => {
  const [isPwa, setIsPwa] = useState(false);
  const [isMobilePwa, setIsMobilePwa] = useState(false);

  useEffect(() => {
    const pwa = isStandalone();
    setIsPwa(pwa);
    setIsMobilePwa(pwa && isMobile());
  }, []);

  return { isPwa, isMobilePwa };
}; 