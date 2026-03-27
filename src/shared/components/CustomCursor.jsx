import React, { useState, useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorRef = useRef(null);
  const trailingRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isTextHover, setIsTextHover] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const isIframeHoveredRef = useRef(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = 0;
    let mouseY = 0;
    let trailingX = 0;
    let trailingY = 0;
    let isInitialized = false;

    const onMouseMove = (e) => {
      if (isIframeHoveredRef.current) return;
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isInitialized) {
        trailingX = mouseX;
        trailingY = mouseY;
        isInitialized = true;
        setIsVisible(true);
      } else if (!isVisible) {
        setIsVisible(true);
      }

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
    };

    const onMouseOver = (e) => {
      const target = e.target;
      const tagName = target.tagName ? target.tagName.toLowerCase() : '';
      
      const isTextInput = tagName === 'textarea' ||
        (tagName === 'input' && !['button', 'submit', 'checkbox', 'radio', 'color', 'file'].includes(target.type)) ||
        target.classList.contains('cursor-text') ||
        target.closest('.cursor-text');

      if (isTextInput) {
        setIsTextHover(true);
        setIsHovering(false);
      } else {
        setIsTextHover(false);
        const isClickable = tagName === 'button' ||
          tagName === 'a' ||
          target.closest('button') !== null ||
          target.closest('a') !== null ||
          target.classList.contains('cursor-pointer') ||
          target.closest('.cursor-pointer');
        setIsHovering(isClickable);
      }
    };

    const loop = () => {
      if (isInitialized && !isIframeHoveredRef.current) {
        trailingX += (mouseX - trailingX) * 0.2;
        trailingY += (mouseY - trailingY) * 0.2;
        if (trailingRef.current) {
          trailingRef.current.style.transform = `translate3d(${trailingX}px, ${trailingY}px, 0)`;
        }
      }
      requestAnimationFrame(loop);
    };

    const handleHide = () => { isIframeHoveredRef.current = true; setIsVisible(false); };
    const handleShow = () => { isIframeHoveredRef.current = false; setIsVisible(true); };
    const handleDocLeave = () => { setIsVisible(false); };
    const handleDocEnter = () => { if (!isIframeHoveredRef.current) setIsVisible(true); };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);
    window.addEventListener('hide-custom-cursor', handleHide);
    window.addEventListener('show-custom-cursor', handleShow);
    document.addEventListener('mouseleave', handleDocLeave);
    document.addEventListener('mouseenter', handleDocEnter);

    const raf = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
      window.removeEventListener('hide-custom-cursor', handleHide);
      window.removeEventListener('show-custom-cursor', handleShow);
      document.removeEventListener('mouseleave', handleDocLeave);
      document.removeEventListener('mouseenter', handleDocEnter);
      cancelAnimationFrame(raf);
    };
  }, [isVisible]);

  if (typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches) return null;

  return (
    <div className={`pointer-events-none fixed inset-0 z-[99999] transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <div ref={cursorRef} className="absolute top-0 left-0" style={{ willChange: 'transform' }}>
        <div className={`bg-blue-500 transition-all duration-150 ease-out flex items-center justify-center shadow-md ${
          isTextHover ? 'w-[2px] h-5 rounded-none -ml-[1px] -mt-[10px] scale-100 opacity-100 shadow-blue-500/80' : 
          isHovering ? 'w-2 h-2 rounded-full -ml-[4px] -mt-[4px] scale-50 opacity-50 shadow-blue-500/50' : 
          'w-2 h-2 rounded-full -ml-[4px] -mt-[4px] scale-100 opacity-100 shadow-blue-500/50'
        }`} />
      </div>
      <div ref={trailingRef} className="absolute top-0 left-0" style={{ willChange: 'transform' }}>
        <div className={`w-8 h-8 border-[1.5px] border-blue-400 rounded-full transition-all duration-300 ease-out -ml-4 -mt-4 ${
          isTextHover ? 'scale-0 opacity-0' : 
          isHovering ? 'scale-[1.8] bg-blue-500 bg-opacity-20 border-transparent shadow-[0_0_15px_rgba(59,130,246,0.6)] opacity-100' : 
          'scale-100 bg-transparent shadow-none opacity-80'
        }`} />
      </div>
    </div>
  );
}