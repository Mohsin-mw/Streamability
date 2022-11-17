import { Outlet } from 'react-router-dom';
import { useSessionContext, useUserContext } from '../hooks';

/**
 * Wrapper for all authentication components
 * 
 * @returns {JSX.Element}
 */
export default function AuthScreen(): JSX.Element {
	const { session } = useSessionContext();
	const { user, setUser } = useUserContext();

	return (
		<>
			<h1>Auth Screen</h1>
			<Outlet context={{session, user, setUser}} />
		</>
	);
}