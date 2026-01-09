import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock } from 'lucide-react'; // Usando lucide-react para los iconos
import { useSignInMutation } from '../api/apiSlice';
import { useNavigate } from 'react-router-dom';

const SignInForm = () => {
    const navigate = useNavigate();
    // 1. Un solo estado para todo el formulario
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });

    // 2. Estado para la visibilidad de la contraseña
    const [showPassword, setShowPassword] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    // 3. Manejador de cambios genérico
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const [signIn, { isLoading }] = useSignInMutation();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Enviando a la API:', formData);
        // Aquí llamarás a tu mutation de Redux o fetch
        try {
            await signIn(formData).unwrap();

            navigate('/assets');
        } catch (err: any) {
            // RTK Query pone el error del servidor en err.data.message
            setServerError(err.data?.message || 'Ocurrió un error inesperado');
        }
    };

    return (
        <div className="form-container" style={{ maxWidth: '400px', margin: '2rem auto' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

                {/* Campo Nombre */}
                <div className="input-group">
                    <label htmlFor="name">Nombre o Email</label>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={iconStyle} />
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Ej. juanperez@mail.com"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>
                </div>

                {/* Campo Password */}
                <div className="input-group">
                    <label htmlFor="password">Contraseña</label>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={iconStyle} />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                        {/* Botón para mostrar/ocultar contraseña */}
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => setShowPassword(!showPassword)}
                            style={eyeButtonStyle}
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>
                {serverError && <p style={{ color: 'red', fontSize: '0.9rem' }}>{serverError}</p>}
                <button type="submit" className="submit-btn">
                    Iniciar sesión
                </button>
            </form>
        </div>
    );
};

// Estilos rápidos en línea (puedes pasarlos a CSS)
const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 10px 10px 40px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    boxSizing: 'border-box'
};

const iconStyle: React.CSSProperties = {
    position: 'absolute',
    left: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#666'
};

const eyeButtonStyle: React.CSSProperties = {
    position: 'absolute',
    right: '10px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#666',
    display: 'flex',
    alignItems: 'center'
};

export default SignInForm;