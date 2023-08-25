import Carousel from 'nuka-carousel';
import { ShowData } from '../types/tmdb';
import { useEffect, useState } from 'react';
import { useWindowSize } from '../hooks';
import useDebounce from '../hooks/useDebounceValue';
import ShowPoster, { SHOW_POSTER_WIDTH } from './ShowPoster';

interface ShowCarouselProps {
    /**
     * Array of data to populate show cards
     */
    data: ShowData[] | null;
    /**
     * Number of ShowCards to display in 1 step.
     * If `undefined` this number will be based on screen size
     */
    size?: number | undefined;
}

/**
 * Carousel component will utilize CarouselChildren to display nth ShowCards per carousel step.
 *
 * @returns {JSX.Element} | Collection of ShowCards
 */
function CarouselChildren({ data }: ShowCarouselProps): JSX.Element {
    return (
        <div className='flex justify-center'>
            {data?.map((item, i) => (
                <ShowPoster key={i} details={item} showType={item.media_type} />
            ))}
        </div>
    );
}

/**
 * Show carousels will be used throughout the site to display collections of shows
 * The scroll horizontally and contain any number of show cards
 *
 * @returns {JSX.Element} | Carousel of movie cards
 */
export default function ShowCarousel({ data, size }: ShowCarouselProps): JSX.Element {
    const windowSize = useWindowSize();
    const debouncedWindowSize = useDebounce(windowSize, 250);
    const [carouselSteps, setCarouselSteps] = useState<number>(size || 1);
    const [carouselWidth, setCarouselWidth] = useState<string>(
        (SHOW_POSTER_WIDTH * (size || 1) + 100).toString() + 'px'
    );

    useEffect(() => {
        if (size) {
            setCarouselSteps(size);
            setCarouselWidth((SHOW_POSTER_WIDTH * size + 100).toString() + 'px');
            return;
        }
        if (debouncedWindowSize.width && debouncedWindowSize.width > 1536) {
            setCarouselSteps(5);
            setCarouselWidth((SHOW_POSTER_WIDTH * 5 + 190).toString() + 'px');
        } else if (debouncedWindowSize.width && debouncedWindowSize.width > 1350) {
            setCarouselSteps(4);
            setCarouselWidth((SHOW_POSTER_WIDTH * 4 + 190).toString() + 'px');
        } else if (debouncedWindowSize.width && debouncedWindowSize.width > 1024) {
            setCarouselSteps(3);
            setCarouselWidth((SHOW_POSTER_WIDTH * 3 + 180).toString() + 'px');
        } else if (debouncedWindowSize.width && debouncedWindowSize.width > 768) {
            setCarouselSteps(2);
            setCarouselWidth((SHOW_POSTER_WIDTH * 2 + 180).toString() + 'px');
        } else {
            setCarouselSteps(1);
            setCarouselWidth((SHOW_POSTER_WIDTH * 1 + 100).toString() + 'px');
        }
    }, [debouncedWindowSize, size]);

    /**
     * Splits an array of shows into an array of CarouselChildren
     *
     * @todo remove shows that do not have a poster_path
     * @param data Show
     * @returns {JSX.Element[]}
     */
    const handleDataSlice = (data: ShowData[] | null): JSX.Element[] => {
        const arr: JSX.Element[] = [];
        if (data) {
            for (let i = 0; i < data.length; i += carouselSteps) {
                const chunk = data.slice(i, i + carouselSteps);
                arr.push(<CarouselChildren key={i} data={chunk} />);
            }
        }
        return arr;
    };

    return (
        <section className='pt-12'>
            <div className={`w-[${carouselWidth}]`}>
                <Carousel
                    wrapAround
                    className='bg-primary'
                    style={{
                        width: carouselWidth,
                        paddingTop: '10px',
                        paddingBottom: '10px',
                        borderRadius: '5px',
                    }}
                    defaultControlsConfig={{
                        pagingDotsClassName: 'hidden',
                        nextButtonClassName: 'mr-3 rounded-sm hidden md:block',
                        prevButtonClassName: 'ml-3 rounded-sm hidden md:block',
                    }}
                >
                    {handleDataSlice(data)}
                </Carousel>
            </div>
        </section>
    );
}
