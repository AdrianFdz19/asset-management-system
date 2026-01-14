import React, { useEffect, useState, useMemo } from 'react';
import { useAppSelector } from '../../app/hooks';
import { assetsAdapter, useGetAssetsQuery, type Asset } from './assetsSlice';
import { selectAllCategories, useGetCategoriesQuery } from '../categories/categoriesSlice';
import AddAssetForm from './AddAssetForm';
import AssetExcerpt from './AssetExcerpt';
import { Search, RotateCcw, Loader2, Filter } from 'lucide-react';

export default function AssetsList() {
    // 1. CARGA DE CATEGORÍAS (Para el Select)
    const { isLoading: isCatsLoading } = useGetCategoriesQuery();
    const categories = useAppSelector(selectAllCategories);
    const [page, setPage] = useState(1);
    const [limit] = useState(10); // 10 items por página

    // 2. ESTADOS LOCALES (Controlan los inputs de forma instantánea)
    const [searchTerm, setSearchTerm] = useState('');
    const [catId, setCatId] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    // 3. ESTADO DE FILTROS "DEBOUNCED" (Lo que dispara la petición al servidor)
    const [debouncedParams, setDebouncedParams] = useState({
        search: '',
        categoryId: '',
        status: 'all',
        page: 1,
        limit: 10
    });

    // 4. PETICIÓN RTK QUERY
    // Al pasar 'debouncedParams', RTK Query crea una cache key única para esta combinación
    const {
        data: assetsData,
        isLoading,
        isFetching,
        isError,
        error
    } = useGetAssetsQuery(debouncedParams);

    const totalItems = assetsData?.totalCount || 0;
    const totalPages = Math.ceil(totalItems / limit);

    // 5. TRANSFORMACIÓN DE DATOS
    // Convertimos las entidades del adaptador en un array para el renderizado
    const assets = useMemo(() => {
        if (!assetsData) return [];
        // selectAll devuelve el array siguiendo el orden del sortComparer
        return assetsAdapter.getSelectors().selectAll(assetsData);
    }, [assetsData]);

    // 1. Efecto para el DEBOUNCE (Sincroniza los inputs con la petición)
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedParams({
                search: searchTerm,
                categoryId: catId,
                status: statusFilter,
                page, // Aquí viaja la página actual
                limit
            });
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm, catId, statusFilter, page, limit]); // Añade limit aquí por seguridad

    // 2. Efecto para RESETEAR página (Solo cuando cambian los filtros de texto/categoría)
    // IMPORTANTE: NO incluyas 'page' en las dependencias de este efecto
    useEffect(() => {
        setPage(1);
    }, [searchTerm, catId, statusFilter]);

    // 7. HANDLERS
    const resetFilters = () => {
        setSearchTerm('');
        setCatId('');
        setStatusFilter('all');
    };

    // MANEJO DE ESTADOS DE CARGA Y ERROR
    if (isLoading && !isFetching) return (
        <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
        </div>
    );

    if (isError) {
        const errMsg = 'status' in error ? ('error' in error ? JSON.stringify(error.data) : 'Error fetching data.') : error.message;
        return (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg max-w-[1400px] mx-auto mt-10">
                <p className="font-bold">Error loading assets:</p>
                <p className="text-sm">{errMsg as string}</p>
            </div>
        );
    }

    return (
        <main className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

            <header className="mb-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Inventory Assets</h1>
                        <p className="text-gray-500 mt-1">Manage and track company resources with real-time filtering.</p>
                    </div>
                </div>

                {/* --- BARRA DE BÚSQUEDA Y FILTROS --- */}
                <div className="bg-white p-4 mb-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by name or serial..."
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                        />
                    </div>

                    <select
                        value={catId}
                        onChange={(e) => setCatId(e.target.value)}
                        className="w-full md:w-48 bg-gray-50 border-none rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full md:w-48 bg-gray-50 border-none rounded-xl py-2 px-4 outline-none focus:ring-2 focus:ring-blue-500/20"
                    >
                        <option value="all">All Status</option>
                        <option value="available">Available</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="inuse">In Use</option>
                        <option value="retired">Retired</option>
                    </select>

                    <button
                        onClick={resetFilters}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Reset Filters"
                    >
                        <RotateCcw size={20} />
                    </button>
                </div>

                {/* <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 mb-12 shadow-inner">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Add New Asset</h2>
                    <AddAssetForm />
                </div> */}
            </header>

            <section>
                <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
                    <h2 className="text-sm font-black uppercase tracking-widest text-gray-400">
                        Results ({assets.length}) {isFetching && <span className="ml-2 lowercase font-normal animate-pulse">updating...</span>}
                    </h2>
                </div>

                {assets.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {assets.map((asset: Asset) => (
                            <AssetExcerpt key={asset.id} asset={asset} /> // Pasamos asset en lugar de assetId
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white border-2 border-dashed border-gray-200 rounded-3xl">
                        <p className="text-gray-400 font-medium text-lg">No assets found matching your criteria.</p>
                    </div>
                )}
                <div className="flex items-center justify-between mt-10 px-4 py-4 bg-white border border-gray-100 rounded-3xl shadow-sm">
                    <button
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                        className="px-4 py-2 text-sm font-bold text-gray-600 disabled:opacity-30 hover:text-blue-600 transition-colors"
                    >
                        ← Previous
                    </button>

                    <span className="text-sm font-medium text-gray-500">
                        Page <span className="text-gray-900 font-bold">{page}</span>
                    </span>

                    <button
                        disabled={page >= totalPages || isFetching} // Desactivar si es la última página o si está cargando
                        onClick={() => setPage(p => p + 1)}
                        className="..."
                    >
                        Next →
                    </button>
                </div>
            </section>
        </main>
    );
}