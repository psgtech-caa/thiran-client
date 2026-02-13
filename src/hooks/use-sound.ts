import { useCallback } from 'react';

// Define sound types ensuring type safety
type SoundType = 'hover' | 'click' | 'success' | 'intro';

// Default sound paths - user should add these files to public/sounds/
const SOUND_PATHS: Record<SoundType, string> = {
    hover: '/sounds/hover.mp3',
    click: '/sounds/click.mp3',
    success: '/sounds/success.mp3',
    intro: '/sounds/intro.mp3',
};

export function useSound() {
    const playSound = useCallback((type: SoundType) => {
        try {
            const audio = new Audio(SOUND_PATHS[type]);
            audio.volume = 0.4; // Default volume

            // Play and catch any errors (e.g. if file doesn't exist or user hasn't interacted yet)
            const playPromise = audio.play();

            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    // Auto-play policy might block audio, or file missing
                    // Use console.log only for intense debugging, otherwise silent fail is better for UX
                    // console.warn('Audio play failed:', error);
                });
            }
        } catch (e) {
            // Ignore errors
        }
    }, []);

    return { playSound };
}
