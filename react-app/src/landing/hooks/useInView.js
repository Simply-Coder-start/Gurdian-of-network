import { useState, useEffect, useRef } from 'react';

export function useInView(options = {}) {
  const ref = useRef(null);
  const [hasBeenVisible, setHasBeenVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasBeenVisible) {
          setHasBeenVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: options.threshold ?? 0.2, ...options }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [hasBeenVisible, options.threshold]);

  return [ref, hasBeenVisible];
}
