import { useProfileContext } from '../hooks';
import {
    addToProfileWatchQueue,
    getProfileWatchQueue,
    removeFromProfileWatchQueue,
} from '../supabase/profiles';
import { MovieDetailsData } from '../types/tmdb';
import { Link } from 'react-router-dom';
import { formatReleaseDate, DateSize } from '../helpers/dateFormatUtils';
import { useEffect, useState } from 'react';
import { Button, CardActions, CardContent, CardMedia, Typography } from '@mui/material';
import { Box } from '@mui/system';

interface MovieCardProps {
    details: MovieDetailsData;
}

/**
 * Show cards are rendered all over the application in different situations
 * Be sure changes made to this component are either conditionally applied
 * or intended to be on every single show card
 *
 * @param props | returns details object passed from SearchResultScreen.tsx
 * @returns {JSX.Element} | Single show card
 */
export default function ShowCard(props: MovieCardProps): JSX.Element {
    const { profile, setProfile } = useProfileContext();
    const [isInWatchQueue, setIsInWatchQueue] = useState<boolean>(false);

    const ratingHandler = (arr: MovieDetailsData): string => {
        for (let i = 0; i < arr.release_dates.results.length; i++) {
            if (
                arr.release_dates.results[i].iso_3166_1 === 'US' &&
                arr.release_dates.results[i].release_dates[0].certification
            ) {
                return arr.release_dates.results[i].release_dates[0].certification;
            }
        }
        return 'No rating available';
    };

    /**
     * On component render, get the current users watch queue from Supabase
     * Check if it contains the current shows ID and set the boolean accordingly
     */
    useEffect(() => {
        const handler = async () => {
            const currentWatchQueue = profile ? await getProfileWatchQueue(profile.id) : null;
            if (currentWatchQueue && currentWatchQueue.includes(props.details.id)) {
                setIsInWatchQueue(true);
            }
        };
        handler();
    }, []);

    /**
     * Handle card being added to or removed from
     * a users watch queue
     *
     * @param isPush | true if adding, false if removing
     * @param show_id | movie db id being updated
     */
    const queueHandler = async (isPush: boolean, show_id: number | undefined) => {
        if (show_id) {
            if (isPush && profile) {
                const data = await addToProfileWatchQueue(profile.id, show_id);
                setProfile(data);
                setIsInWatchQueue(true);
            } else if (profile) {
                const data = await removeFromProfileWatchQueue(profile.id, show_id);
                setProfile(data);
                setIsInWatchQueue(false);
            }
        }
    };

    return (
        <div data-testid='show-card-component' className='m-1 flex w-96 bg-foreground'>
            <Link to={`/details/${props.details.id}`} state={props} data-testid='show-details-link'>
                {/* TODO: #193 Add placeholder poster if null */}
                {props.details.poster_path && (
                    <CardMedia
                        component='img'
                        className='w-full cursor-pointer'
                        sx={{ width: 180, minWidth: 180, height: 270, minHeight: 270 }}
                        image={`https://image.tmdb.org/t/p/w500${props.details.poster_path}`}
                        alt={`${props.details.original_title} poster`}
                    />
                )}
            </Link>
            <Box sx={{ display: 'flex', flexDirection: 'column', margin: 'auto' }}>
                <CardContent>
                    <Typography variant='h5'>{props.details.original_title}</Typography>
                    {props.details.release_date.length === 10 && (
                        <Typography>
                            {formatReleaseDate(props.details.release_date, DateSize.MEDIUM)}
                        </Typography>
                    )}
                    <Typography variant='body2'>{props.details.runtime} minutes</Typography>
                    {/* TODO: #152 Include number of stars with styling, response returns rating out of 10  */}
                    <Typography variant='body2'>{props.details.vote_average} stars</Typography>
                    <Typography variant='body2'>{props.details.vote_count} ratings</Typography>
                    <Typography variant='body2'>{ratingHandler(props.details)}</Typography>
                </CardContent>
                {profile && (
                    <CardActions sx={{ margin: 'auto', display: 'flex', flexDirection: 'column' }}>
                        {isInWatchQueue ? (
                            <Button
                                sx={{ m: 1 }}
                                variant='outlined'
                                size='small'
                                color='secondary'
                                onClick={() => queueHandler(true, props.details?.id)}
                            >
                                Add to queue
                            </Button>
                        ) : (
                            <Button
                                sx={{ m: 1 }}
                                variant='outlined'
                                size='small'
                                color='secondary'
                                onClick={() => queueHandler(false, props.details?.id)}
                            >
                                Remove from queue
                            </Button>
                        )}
                    </CardActions>
                )}
            </Box>
        </div>
    );
}
