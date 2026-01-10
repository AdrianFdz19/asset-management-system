import React, { useState } from 'react';
import { useAddAssetMutation, useUploadImageMutation } from './assetsSlice';
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
    const [file, setFile] = useState<File | null>(null);

    const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
    const [addAsset, { isLoading }] = useAddAssetMutation();

    // Función para manejar el cambio del input file
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) setFile(e.target.files[0]);
    };

    // Traer la información de las categorias
    const {
        isSuccess
    } = useGetCategoriesQuery();

    const categories = useAppSelector(selectAllCategories);

    // Validación simple para el botón
    const canSave = [name, serialNumber, value, categoryId].every(Boolean);

    const isPending = isLoading;
    const canSubmit = canSave && !isPending;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!canSubmit) return;

        setErrorMsg('');
        let image_url = null;
        let image_public_id = null;

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
                // PASO 1: Si hay un archivo, subirlo primero
                if (file) {
                    const formData = new FormData();
                    formData.append('image', file); // 'image' debe coincidir con upload.single('image')

                    const uploadResult = await uploadImage(formData).unwrap();
                    image_url = uploadResult.url;
                    image_public_id = uploadResult.public_id;
                }

                // PASO 2: Crear el asset con la URL recibida
                const newAsset = {
                    name,
                    serial_number: serialNumber,
                    status,
                    value,
                    purchase_date: purchaseDate,
                    category_id: Number(categoryId),
                    user_id: userId ? Number(userId) : null,
                    image_url,        // Enviamos la URL a Postgres
                    image_public_id   // Enviamos el ID a Postgres
                };

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
                setErrorMsg(err.data?.message || 'Error processing request');
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

                <div style={styles.formGroup}>
                    <label style={styles.label}>Asset Photo</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        style={styles.input}
                    />
                    {file && <p style={{ fontSize: '12px', color: '#347d39' }}>Selected: {file.name}</p>}
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