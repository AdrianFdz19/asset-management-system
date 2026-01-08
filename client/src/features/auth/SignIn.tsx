import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../auth/authSlice'; // Tu slice de estado
import { useNavigate } from 'react-router-dom';
import { useLoginWithGoogleMutation } from '../api/apiSlice';

export default function SignIn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // 1. Hook de la mutación
    const [loginWithGoogle, { isLoading }] = useLoginWithGoogleMutation();

    return (
        <section style={{ textAlign: 'center', padding: '2rem' }}>
            <h2>Sign In</h2>
            
            {/* 2. Feedback visual mientras el backend valida */}
            {isLoading ? (
                <p>Authenticating with our server...</p>
            ) : (
                <GoogleLogin
                    onSuccess={async (credentialResponse) => {
                        try {
                            // Enviar el ID Token de Google a tu backend
                            const result = await loginWithGoogle({ 
                                token: credentialResponse.credential 
                            }).unwrap();

                            // Guardar usuario y JWT propio en Redux
                            dispatch(setCredentials(result.data));

                            // Redirigir al inventario tras el éxito
                            navigate('/assets'); 
                        } catch (err) {
                            console.error("Backend login failed:", err);
                        }
                    }}
                    onError={() => console.log('Google Login Failed')}
                    // Opcional: Personalización para que combine con tu dark mode
                    theme="filled_black"
                    shape="pill"
                />
            )}
        </section>
    );
}