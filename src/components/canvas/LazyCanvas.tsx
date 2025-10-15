import { ReactNode, useEffect, useRef, useState } from 'react';

interface LazyCanvasProps {
  children: ReactNode;
  className?: string;
}

const LazyCanvas = ({ children, className = '' }: LazyCanvasProps) => {
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      {
        rootMargin: '100px', // Start loading slightly before entering viewport
        threshold: 0.1,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {isInView ? children : <div className="w-full h-full" />}
    </div>
  );
};

export default LazyCanvas;
