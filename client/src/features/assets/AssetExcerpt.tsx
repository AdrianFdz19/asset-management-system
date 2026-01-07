import { useAppSelector } from '../../app/hooks'
import { selectAssetById } from './assetsSlice'

interface AssetExcerptType {
    assetId: number;
}

export default function AssetExcerpt({assetId}: AssetExcerptType) {

    const asset = useAppSelector((state) => selectAssetById(state, assetId));

    return (
        <div className="border p-3 rounded shadow-sm">
            <p className="font-semibold">{asset.name}</p>
            <p className="text-sm text-gray-600">S/N: {asset.serial_number}</p>
            <span className={`text-xs px-2 py-1 rounded ${asset.status === 'disponible' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                }`}>
                {asset.status}
            </span>
        </div>
    )
}
