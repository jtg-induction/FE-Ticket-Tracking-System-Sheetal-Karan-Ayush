import { useEffect, useState } from 'react';

export const useIsOverflow = (ref: React.RefObject<HTMLElement>) => {
    const [isOverflow, setIsOverflow] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const checkOverflow = () => {
            setIsOverflow(
                element.scrollWidth > element.clientWidth ||
                    element.scrollHeight > element.clientHeight,
            );
        };

        checkOverflow();
        window.addEventListener('resize', checkOverflow);

        return () => window.removeEventListener('resize', checkOverflow);
    }, [ref]);

    return isOverflow;
};
