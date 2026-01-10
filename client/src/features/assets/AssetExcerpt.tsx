import { useAppSelector } from '../../app/hooks'
import { selectAssetById } from './assetsSlice'

interface AssetExcerptType {
    assetId: number;
}

export default function AssetExcerpt({ assetId }: AssetExcerptType) {
    const asset = useAppSelector((state) => selectAssetById(state, assetId));

    if (!asset) return null;

    return (
        <div className="flex flex-col bg-[#22272e] border border-[#444c56] rounded-xl overflow-hidden hover:border-[#539bf5] transition-colors shadow-lg">
            {/* Contenedor de la Imagen */}
            <div className="relative h-40 w-full bg-[#1c2128] flex items-center justify-center border-b border-[#444c56]">
                {asset.image_url ? (
                    <img 
                        src={asset.image_url} 
                        alt={asset.name} 
                        className="object-cover w-full h-full"
                    />
                ) : (
                    <div className="flex flex-col items-center text-gray-500">
                        {/* Icono de placeholder si no hay imagen */}
                        <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs uppercase tracking-wider">No Photo</span>
                    </div>
                )}
                
                {/* Badge de Precio sobre la imagen */}
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded-md">
                    ${Number(asset.value).toLocaleString()}
                </div>
            </div>

            {/* Contenido de texto */}
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-[#adbac7] truncate flex-1" title={asset.name}>
                        {asset.name}
                    </h3>
                    <StatusBadge status={asset.status} />
                </div>
                
                <div className="space-y-1">
                    <p className="text-xs text-gray-500 flex justify-between">
                        <span>S/N:</span>
                        <span className="font-mono text-[#768390]">{asset.serial_number || 'N/A'}</span>
                    </p>
                    <p className="text-xs text-gray-500 flex justify-between">
                        <span>Purchased:</span>
                        <span className="text-[#768390]">{new Date(asset.purchase_date).toLocaleDateString()}</span>
                    </p>
                </div>
            </div>
        </div>
    )
}

// Sub-componente para limpiar el código principal
function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
        available: 'bg-green-500/10 text-green-500 border-green-500/20',
        'in-use': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
        maintenance: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
        retired: 'bg-red-500/10 text-red-500 border-red-500/20',
    };

    return (
        <span className={`text-[10px] uppercase tracking-tighter font-bold px-2 py-0.5 rounded border ${colors[status] || 'bg-gray-500/10 text-gray-500 border-gray-500/20'}`}>
            {status.replace('-', ' ')}
        </span>
    );
}