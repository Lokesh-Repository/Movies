import { useState, useEffect } from 'react';

interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isSmallMobile: boolean;
  width: number;
  height: number;
}

export function useResponsive(): ResponsiveState {
  const [windowSize, setWindowSize] = useState<ResponsiveState>(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    return {
      width,
      height,
      isSmallMobile: width < 480,
      isMobile: width < 768,
      isTablet: width >= 768 && width < 1024,
      isDesktop: width >= 1024,
    };
  });

  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setWindowSize({
        width,
        height,
        isSmallMobile: width < 480,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      });
    }

    window.addEventListener('resize', handleResize);
    
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}

export function useBreakpoint() {
  const { isMobile, isTablet, isDesktop, isSmallMobile } = useResponsive();
  
  return {
    isMobile,
    isTablet, 
    isDesktop,
    isSmallMobile,
    containerPadding: isMobile ? '16px' : '24px',
    modalPadding: isMobile ? '16px' : '24px',
    buttonHeight: isMobile ? '48px' : '44px',
    inputPadding: isMobile ? '14px 16px' : '12px 16px',
    fontSize: {
      sm: isMobile ? '13px' : '14px',
      base: '16px', 
      lg: isMobile ? '18px' : '20px',
      xl: isMobile ? '20px' : '24px',
      '2xl': isMobile ? '24px' : '30px',
      '3xl': isSmallMobile ? '20px' : isMobile ? '24px' : '30px',
    },
    gridCols: {
      form: isMobile ? '1fr' : '1fr 1fr',
      filters: isSmallMobile ? '1fr' : 'auto auto',
    }
  };
}