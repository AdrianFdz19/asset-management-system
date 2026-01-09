import { useLogoutMutation } from '../features/api/apiSlice'

export default function Header() {

    const [logout] = useLogoutMutation();

    const handleLogout = async () => {
        await logout();
    };

    return (
        <header>
            <h2>Assets Manager</h2>

            <button onClick={handleLogout} >Logout</button>
        </header>
    )
}
