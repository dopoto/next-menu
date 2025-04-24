'use client';

import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

export const SuccessAnimation = () => {
    const { width, height } = useWindowSize();
    return <Confetti width={width} height={height} numberOfPieces={180} recycle={false} />;
};
