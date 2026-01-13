import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppSelector } from '../../app/hooks';
import { selectAssetById, useGetAssetsQuery } from './assetsSlice';
import { selectUserById } from '../users/usersSlice';
import type { RootState } from '../../app/store';

export default function AssetDetail() {
    const { isLoading } = useGetAssetsQuery();
    const { assetId } = useParams();
    const navigate = useNavigate();
    
    const asset = useAppSelector((state: RootState) => selectAssetById(state, Number(assetId)));
    const user = useAppSelector((state: RootState) => 
        asset?.user_id ? selectUserById(state, asset.user_id) : null
    );

    if (isLoading) return <div className="p-10 text-gray-500">Loading asset...</div>;
    if (!asset) return <div className="p-10 text-red-500 font-bold">Asset not found.</div>;

    return (
        // Contenedor principal con el padding de 1400px que solicitaste en tu configuración
        <div className="max-w-[1400px] mx-auto p-6 text-gray-800">
            
            {/* Breadcrumb / Back button */}
            <button 
                onClick={() => navigate(-1)}
                className="mb-4 text-sm text-blue-600 hover:underline flex items-center gap-1"
            >
                ← Back to Inventory
            </button>

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{asset.name}</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-0.5 rounded">ID: {asset.id}</span>
                        <span className="text-gray-300">•</span>
                        <p className="text-sm text-gray-500">Added on {new Date(asset.purchase_date).toLocaleDateString()}</p>
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <button className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all shadow-sm">
                        Edit Asset
                    </button>
                    <button className="px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all shadow-md shadow-red-200">
                        Delete
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Izquierda: Visual y Specs */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Imagen con estilo de Dashboard */}
                    <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                        <div className="p-2 bg-gray-50 border-b border-gray-100 flex justify-center">
                             <img 
                                src={asset.image_url || '/placeholder-asset.png'} 
                                alt={asset.name}
                                className="max-h-[450px] w-auto object-contain rounded-lg"
                            />
                        </div>
                    </div>
                    
                    {/* Detalles Técnicos */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                        <h2 className="text-lg font-bold mb-6 text-gray-900 flex items-center gap-2">
                            Technical Specifications
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-8 gap-x-12">
                            <DetailItem label="Serial Number" value={asset.serial_number} isMono />
                            <DetailItem label="Value" value={`$${Number(asset.value).toLocaleString()}`} isBold />
                            <DetailItem label="Status" value={asset.status.replace('-', ' ')} isCaps />
                            <DetailItem label="Category ID" value={asset.category_id} />
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Estado y Asignación */}
                <div className="space-y-6">
                    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Current Ownership</h2>
                        
                        {user ? (
                            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                                <img src={user.avatar} className="w-12 h-12 rounded-full border-2 border-white shadow-sm object-cover" />
                                <div>
                                    <p className="text-xs text-blue-600 font-bold uppercase">Assigned To</p>
                                    <p className="text-gray-900 font-bold">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.role}</p>
                                </div>
                            </div>
                        ) : (
                            <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                                <p className="text-green-700 font-bold text-center">Available for Assignment</p>
                            </div>
                        )}

                        <div className="mt-8 pt-6 border-t border-gray-100">
                             <p className="text-xs text-gray-400 mb-2 font-semibold italic">"Ensure all assets are checked out correctly before deployment."</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Pequeño helper para no repetir clases de Tailwind
function DetailItem({ label, value, isMono, isBold, isCaps }: any) {
    return (
        <div className="flex flex-col gap-1">
            <span className="text-[11px] uppercase font-bold text-gray-400 tracking-wider">{label}</span>
            <span className={`text-base ${isMono ? 'font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded w-fit' : 'text-gray-700'} ${isBold ? 'font-bold text-gray-900' : ''} ${isCaps ? 'capitalize' : ''}`}>
                {value || 'N/A'}
            </span>
        </div>
    );
}