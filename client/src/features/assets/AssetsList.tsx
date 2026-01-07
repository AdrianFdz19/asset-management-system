import {
    selectAllAssets,
    useGetAssetsQuery,
    type Asset
} from './assetsSlice';
import AddAssetForm from './AddAssetForm';
import { useAppSelector } from '../../app/hooks';
import AssetExcerpt from './AssetExcerpt';

export default function AssetsList() {

    const assets = useAppSelector(selectAllAssets);

    const {
        isLoading,
        isError,
        error
    } = useGetAssetsQuery();

    // 4. Lógica de renderizado según el estado
    if (isLoading) return <div>Cargando activos...</div>;
    if (isError) {
        // Verificamos si es un error de Fetch (como un 404 o 500)
        if ('status' in error) {
            // El error viene del servidor
            const errMsg = 'error' in error ? error.error : JSON.stringify(error.data);
            return <div>Error del servidor: {errMsg}</div>;
        } else {
            // Es un error serializado (como un error de JS)
            return <div>Error: {error.message}</div>;
        }
    }

    return (
        <section className="p-4">
            <AddAssetForm />
            <h1 className="text-2xl font-bold mb-4">Assets List</h1>
            <div className="grid gap-4">
                {assets.map((asset: Asset) => (
                    <AssetExcerpt key={asset.id} assetId={asset.id} />
                ))}
            </div>
        </section>
    );
}