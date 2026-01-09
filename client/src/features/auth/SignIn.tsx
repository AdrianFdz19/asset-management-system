import { GoogleLogin } from '@react-oauth/google';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../auth/authSlice'; // Tu slice de estado
import { useNavigate } from 'react-router-dom';
import { useLoginWithGoogleMutation } from '../api/apiSlice';
import SignUpForm from './SignUpForm';
import SignInForm from './SignInForm';
import { useState } from 'react';

export default function SignIn() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLogin, setIsLogin] = useState(true);

    // 1. Hook de la mutación
    const [loginWithGoogle, { isLoading }] = useLoginWithGoogleMutation();

    // Función genérica para manejar el éxito de Google
    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            const result = await loginWithGoogle({
                token: credentialResponse.credential
            }).unwrap();
            dispatch(setCredentials(result.data));
            navigate('/assets');
        } catch (err) {
            console.error("Backend login failed:", err);
        }
    };

    return (
        <section style={{ maxWidth: '450px', margin: '3rem auto', textAlign: 'center', padding: '2rem', border: '1px solid #ddd', borderRadius: '12px' }}>

            <h2>{isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}</h2>

            {/* Renderizado condicional del formulario */}
            {isLogin ? <SignInForm /> : <SignUpForm />}

            <div style={{ margin: '1.5rem 0', display: 'flex', alignItems: 'center' }}>
                <hr style={{ flex: 1 }} /> <span style={{ padding: '0 10px', color: '#888' }}>o</span> <hr style={{ flex: 1 }} />
            </div>

            {/* Google Login siempre visible o condicional */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                {isLoading ? (
                    <p>Autenticando...</p>
                ) : (
                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => console.log('Login Failed')}
                        theme="filled_black"
                        shape="pill"
                    />
                )}
            </div>

            {/* Switch para cambiar de formulario */}
            <p style={{ marginTop: '1rem' }}>
                {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes una cuenta? "}
                <button
                    onClick={() => setIsLogin(!isLogin)}
                    style={{ background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', fontWeight: 'bold', textDecoration: 'underline' }}
                >
                    {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
                </button>
            </p>
        </section>
    );
}