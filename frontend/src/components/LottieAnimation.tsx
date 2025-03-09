import {useEffect, useRef} from "react";
import lottie from 'lottie-web';

const LottieAnimation = ({ animationData }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const animation = lottie.loadAnimation({
            container: containerRef.current,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            animationData: animationData, // Your JSON animation data
        });

        return () => {
            animation.destroy();
        };
    }, [animationData]);

    return <div ref={containerRef} />;
};

export default LottieAnimation;
