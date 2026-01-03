import { useEffect } from 'react';
import { assetsError, assetsStatus, fetchAssets, selectAllAssets, type Asset } from './assetsSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import AddAssetForm from './AddAssetForm';

export default function AssetsList() {
    // 1. Obtenemos el dispatch al inicio del componente
    const dispatch = useAppDispatch();

    // 2. Obtenemos los selectores
    // Nota: 'assets' debería ser Asset[] (un array), no un solo Asset
    const assets = useAppSelector(selectAllAssets);
    const status = useAppSelector(assetsStatus);
    const error = useAppSelector(assetsError);

    useEffect(() => {
        // 3. Solo disparamos si el estado es 'idle'
        if (status === 'idle') {
            dispatch(fetchAssets());
        }
    }, [status, dispatch]); // Dependencias correctas

    // 4. Lógica de renderizado según el estado
    if (status === 'loading') return <div>Cargando activos...</div>;
    if (status === 'error') return <div>Error: {error}</div>;

    return (
        <section className="p-4">
            <AddAssetForm />
            <h1 className="text-2xl font-bold mb-4">Assets List</h1>
            <div className="grid gap-4">
                {assets.map((asset: Asset) => (
                    <div key={asset.id} className="border p-3 rounded shadow-sm">
                        <p className="font-semibold">{asset.name}</p>
                        <p className="text-sm text-gray-600">S/N: {asset.serial_number}</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                            asset.status === 'disponible' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                            {asset.status}
                        </span>
                    </div>
                ))}
            </div>
        </section>
    );
}