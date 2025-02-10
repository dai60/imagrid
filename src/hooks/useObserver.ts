import { RefObject, useLayoutEffect, useState } from "react";

const useObserver = (ref: RefObject<HTMLElement | null>): [width: number, height: number] => {
    const [size, setSize] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        if (!ref.current) {
            return;
        }

        const observer = new ResizeObserver(entries => {
            for (const { contentRect: { width, height } } of entries) {
                setSize({ width, height });
            }
        });
        observer.observe(ref.current);
        return () => observer.disconnect();
    }, [ref]);

    return [size.width, size.height];
}

export default useObserver;
