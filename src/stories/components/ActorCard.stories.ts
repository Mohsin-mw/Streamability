import type { Meta, StoryObj } from '@storybook/react';
import { ActorCard } from '../../components';
import { ACTOR, MOVIE_DATA } from '../constants';
import { withRouter, reactRouterParameters } from 'storybook-addon-react-router-v6';

const meta = {
    title: 'Components/Actor Card',
    component: ActorCard,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
        reactRouter: reactRouterParameters({
            location: {
                path: '/details/movie/:id',
                pathParams: { id: MOVIE_DATA.id },
            },
            routing: {
                path: '/details/movie/:id',
                handle: 'details',
            },
        }),
    },
    decorators: [withRouter],
} satisfies Meta<typeof ActorCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
    args: {
        details: ACTOR,
    },
};
