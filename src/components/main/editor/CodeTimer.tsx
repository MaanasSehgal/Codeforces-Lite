import { CirclePause, CirclePlay, RotateCcw } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const Timer = ({ theme = 'light' }: { theme?: string }) => {
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);

    const timerRef = useRef(null);

    useEffect(() => {
        if (isActive) {
            timerRef.current = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000) as unknown as null;
        } else if (!isActive && time !== 0) {
            clearInterval(timerRef.current as unknown as NodeJS.Timeout);
        }
        return () => clearInterval(timerRef.current as unknown as NodeJS.Timeout);
    }, [isActive, time]);

    const handleStartPause = () => {
        setIsActive(!isActive);
    };

    const handleReset = () => {
        clearInterval(timerRef.current as unknown as NodeJS.Timeout);
        setIsActive(false);
        setTime(0);
    };

    const formatTime = (timeInSeconds: number) => {
        const hours = String(Math.floor(timeInSeconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((timeInSeconds % 3600) / 60)).padStart(2, '0');
        const seconds = String(timeInSeconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    };

    return (
        <div className='flex items-center justify-center gap-2 bg-zinc-200 dark:bg-zinc-800 text-sm px-2 py-1 rounded-lg'>
            <p className='text-[#777777] dark:text-zinc-100'>{formatTime(time)}</p>
            <div onClick={handleStartPause} className='cursor-pointer'>
                {isActive ? <CirclePause size={16} color={theme === 'light' ? '#666666' : '#ffffff'} /> : <CirclePlay size={16} color={theme === 'light' ? '#666666' : '#ffffff'} />}
            </div>
            <div onClick={handleReset} className='cursor-pointer'>
                <RotateCcw size={16} color={theme === 'light' ? '#666666' : '#ffffff'} />
            </div>
        </div >
    );
};

export default Timer;
