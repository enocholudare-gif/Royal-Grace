import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
    rating: number;
    maxRating?: number;
    interactive?: boolean;
    onRatingChange?: (rating: number) => void;
    size?: number;
    className?: string;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
    rating,
    maxRating = 5,
    interactive = false,
    onRatingChange,
    size = 20,
    className = '',
}) => {
    const [hoveredRating, setHoveredRating] = React.useState<number | null>(null);

    const displayRating = hoveredRating !== null ? hoveredRating : rating;

    const handleMouseEnter = (index: number) => {
        if (interactive) setHoveredRating(index);
    };

    const handleMouseLeave = () => {
        if (interactive) setHoveredRating(null);
    };

    const handleClick = (index: number) => {
        if (interactive && onRatingChange) onRatingChange(index);
    };

    return (
        <div className={`flex items-center space-x-1 ${className}`} onMouseLeave={handleMouseLeave}>
            {[...Array(maxRating)].map((_, i) => {
                const starValue = i + 1;
                const isFilled = starValue <= displayRating;

                return (
                    <button
                        key={i}
                        type="button"
                        disabled={!interactive}
                        onMouseEnter={() => handleMouseEnter(starValue)}
                        onClick={() => handleClick(starValue)}
                        className={`transition-colors duration-200 focus:outline-none ${
                            interactive ? 'cursor-pointer hover:scale-110' : 'cursor-default'
                        }`}
                    >
                        <Star
                            size={size}
                            className={`${
                                isFilled
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'fill-transparent text-gray-300 dark:text-gray-600'
                            }`}
                        />
                    </button>
                );
            })}
        </div>
    );
};
