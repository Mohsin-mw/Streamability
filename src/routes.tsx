import AppWrapper from './AppWrapper';
import {
    FeaturedSearchScreen,
    SearchResultsScreen,
    PageNotFoundScreen,
    DashboardScreen,
    AuthLayout,
    LoginScreen,
    SignUpScreen,
    ShowDetailsScreen,
    DiscoverScreen,
    DashboardGalleryScreen,
    DashboardLayout,
    ActorDetailScreen,
} from './screens';
import { loader as searchLoader } from './screens/search_results/SearchResultsScreen';
import { loader as dashGalleryLoader } from './screens/dashboard/DashboardGalleryScreen';
import { RouteObject } from 'react-router-dom';

/**
 * Create the 'root' route and serve the entire app to it.
 * All screens will be children of the root.
 */
export const routes: RouteObject[] = [
    {
        path: '/',
        element: <AppWrapper />,
        errorElement: <PageNotFoundScreen />,
        children: [
            {
                path: '/',
                element: <FeaturedSearchScreen />,
            },
            {
                element: <AuthLayout />,
                children: [
                    {
                        path: 'login',
                        element: <LoginScreen />,
                    },
                    {
                        path: 'signup',
                        element: <SignUpScreen />,
                    },
                ],
            },
            {
                path: 'dashboard',
                element: <DashboardLayout />,
                children: [
                    {
                        path: '',
                        element: <DashboardScreen />,
                    },
                    {
                        path: 'queue',
                        element: <DashboardGalleryScreen />,
                        loader: dashGalleryLoader,
                    },
                    {
                        path: 'favorites',
                        element: <DashboardGalleryScreen />,
                        loader: dashGalleryLoader,
                    },
                    {
                        path: 'watched',
                        element: <DashboardGalleryScreen />,
                        loader: dashGalleryLoader,
                    },
                ],
            },
            {
                path: 'search',
                element: <SearchResultsScreen />,
                loader: searchLoader,
            },
            {
                path: 'details/movie/:id',
                element: <ShowDetailsScreen />,
            },
            {
                path: 'details/tv/:id',
                element: <ShowDetailsScreen />,
            },
            {
                path: 'details/actor/:id',
                element: <ActorDetailScreen />,
            },
            {
                path: 'discover',
                element: <DiscoverScreen />,
            },
        ],
    },
];
