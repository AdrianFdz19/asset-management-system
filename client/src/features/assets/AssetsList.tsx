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
    const { isLoading, isError, error } = useGetAssetsQuery();

    if (isLoading) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (isError) {
        const errMsg = 'status' in error ? ('error' in error ? error.error : JSON.stringify(error.data)) : error.message;
        return (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg max-w-[1400px] mx-auto mt-10">
                <p className="font-bold">Error loading assets:</p>
                <p className="text-sm">{errMsg}</p>
            </div>
        );
    }

    return (
        /* Contenedor principal respetando tus reglas de 1400px y padding consistente */
        <main className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Header de la sección y Formulario */}
            <header className="mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Inventory Assets</h1>
                        <p className="text-gray-500 mt-1">Manage and track your company resources in real-time.</p>
                    </div>
                    {/* Aquí podrías poner un botón de "Export" o "Filters" en el futuro */}
                </div>
                
                {/* Sección del formulario con estilo de Dashboard (opcionalmente colapsable) */}
                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-12 shadow-inner">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Add New Asset</h2>
                    <AddAssetForm />
                </div>
            </header>

            {/* Grid de Assets: 1 columna en móvil, 2 en tablets, 3 en laptops, 4 en pantallas grandes */}
            <section>
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">
                        Recent Items ({assets.length})
                    </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {assets.map((asset: Asset) => (
                        <AssetExcerpt key={asset.id} assetId={asset.id} />
                    ))}
                </div>

                {/* Empty State en caso de que no haya assets */}
                {assets.length === 0 && (
                    <div className="text-center py-20 bg-white border-2 border-dashed border-gray-200 rounded-3xl">
                        <p className="text-gray-400 font-medium text-lg">No assets found. Start by adding one above!</p>
                    </div>
                )}
            </section>
        </main>
    );
}