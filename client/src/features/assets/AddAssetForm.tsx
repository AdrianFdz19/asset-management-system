import React, { useState } from 'react';
import { useAddAssetMutation } from './assetsSlice';
import { useAppSelector } from '../../app/hooks';
import { selectAllCategories, useGetCategoriesQuery } from '../categories/categoriesSlice';

export default function AddAssetForm() {
    // 1. Estados iniciales (Mantenemos los tipos de tu objeto Asset)
    const [name, setName] = useState('');
    const [serialNumber, setSerialNumber] = useState('');
    const [status, setStatus] = useState('available'); // Valor por defecto
    const [value, setValue] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [userId, setUserId] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    // Traer la información de las categorias
    const {
        isSuccess
    } = useGetCategoriesQuery();

    const categories = useAppSelector(selectAllCategories);

    // Validación simple para el botón
    const canSave = [name, serialNumber, value, categoryId].every(Boolean);

    const [addAsset, { isLoading }] = useAddAssetMutation();

    const isPending = isLoading;
    const canSubmit = canSave && !isPending;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (canSubmit) {
            setErrorMsg('');
            const newAsset = {
                // id: Number(nanoid()), // Nota: Si usas Postgres, mejor deja que el DB genere el ID
                name,
                serial_number: serialNumber,
                status,
                value,
                purchase_date: purchaseDate,
                category_id: Number(categoryId),
                user_id: userId ? Number(userId) : null
            };

            try {
                // LLAMADA DIRECTA (Sin dispatch)
                await addAsset(newAsset).unwrap();

                // RESETEAR TODOS LOS VALORES
                setName('');
                setSerialNumber('');
                setStatus('available');
                setValue('');
                setPurchaseDate('');
                setCategoryId('');
                setUserId('');

                alert("Asset added successfully!");
            } catch (err: any) {
                const message = err.data?.message || 'Failed to save the asset';
                setErrorMsg(message);
            }
        }
    };

    // Estilos constantes
    const styles: { [key: string]: React.CSSProperties } = {
        container: {
            maxWidth: '600px',
            margin: '20px auto',
            padding: '25px',
            backgroundColor: '#2d333b', // Estilo dark mode profesional
            borderRadius: '12px',
            color: '#adbac7',
            fontFamily: 'sans-serif'
        },
        formGroup: {
            marginBottom: '15px',
            display: 'flex',
            flexDirection: 'column'
        },
        label: {
            marginBottom: '5px',
            fontSize: '14px',
            fontWeight: '600'
        },
        input: {
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #444c56',
            backgroundColor: '#22272e',
            color: '#adbac7',
            outline: 'none'
        },
        select: {
            padding: '10px',
            borderRadius: '6px',
            border: '1px solid #444c56',
            backgroundColor: '#22272e',
            color: '#adbac7',
            cursor: 'pointer'
        },
        button: {
            marginTop: '20px',
            padding: '12px',
            backgroundColor: canSave ? '#347d39' : '#2d333b',
            color: 'white',
            border: canSave ? 'none' : '1px solid #444c56',
            borderRadius: '6px',
            cursor: canSave ? 'pointer' : 'not-allowed',
            fontWeight: 'bold',
            fontSize: '16px'
        }
    };

    return (
        <section style={styles.container}>
            <h2 style={{ color: '#539bf5', textAlign: 'center', marginBottom: '20px' }}>Register New Asset</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Asset Name</label>
                    <input
                        style={styles.input}
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. MacBook Pro 14'"
                    />
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Serial Number</label>
                    <input
                        style={styles.input}
                        type="text"
                        value={serialNumber}
                        onChange={(e) => setSerialNumber(e.target.value)}
                        placeholder="SN-12345ABC"
                    />
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>Status</label>
                        <select
                            style={styles.select}
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="available">Available</option>
                            <option value="in-use">In Use</option>
                            <option value="maintenance">Maintenance</option>
                            <option value="retired">Retired</option>
                        </select>
                    </div>

                    <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>Value (USD)</label>
                        <input
                            style={styles.input}
                            type="number"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="1200.50"
                        />
                    </div>
                </div>

                <div style={styles.formGroup}>
                    <label style={styles.label}>Purchase Date</label>
                    <input
                        style={styles.input}
                        type="date"
                        value={purchaseDate}
                        onChange={(e) => setPurchaseDate(e.target.value)}
                    />
                </div>

                <div style={{ display: 'flex', gap: '15px' }}>
                    <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>Category</label>
                        <select
                            name="categories"
                            id="categories"
                            style={styles.select}
                            value={categoryId}  
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">Select a category</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ ...styles.formGroup, flex: 1 }}>
                        <label style={styles.label}>User ID (Optional)</label>
                        <input
                            style={styles.input}
                            type="number"
                            value={userId}
                            onChange={(e) => setUserId(e.target.value)}
                            placeholder="Employee ID"
                        />
                    </div>
                </div>

                {errorMsg && <p style={{ color: '#ff7b72', fontSize: '14px', marginTop: '10px' }}>{errorMsg}</p>}

                <button
                    type="submit"
                    disabled={!canSubmit}
                    style={styles.button}
                >
                    Save Asset to Inventory
                </button>
            </form>
        </section>
    );
}