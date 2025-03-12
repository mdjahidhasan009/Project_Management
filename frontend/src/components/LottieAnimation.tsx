import {FC, useEffect, useRef} from "react";
import lottie, { AnimationItem, AnimationConfigWithData } from 'lottie-web';

type TAnimationDataType = {
    [key: string]: any;
}

// Define the props interface for the component
type TLottieAnimationProps = {
    animationData: TAnimationDataType;
    loop?: boolean;
    autoplay?: boolean;
    renderer?: 'svg' | 'canvas' | 'html';
    width?: number | string;
    height?: number | string;
}

const LottieAnimation: FC<TLottieAnimationProps> = ({ animationData }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const animation: AnimationItem = lottie.loadAnimation({
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
