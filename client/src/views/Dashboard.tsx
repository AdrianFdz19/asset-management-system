import StatusOverview from '../components/StatusOverview';
import { useGetDashboardStatsQuery } from '../features/api/apiSlice'
import CategoryChart from '../features/categories/CategoryChart';

export default function Dashboard() {
    const { data: stats, isSuccess, isLoading, isFetching, isError } = useGetDashboardStatsQuery();

    if (isLoading || isFetching) return <div className="p-8 text-gray-500">Loading dashboard stats...</div>;
    if (isError) return <div className="p-8 text-red-500">Error loading data.</div>;

    // 2. Ahora que sabemos que 'stats' existe, hacemos los cálculos
    const availableAssets = stats?.status_distribution?.find((s: any) => s.status === 'available')?.count || 0;

    // Usamos Number(stats.asset_count) para asegurar que el tipo sea numérico
    const total = Number(stats?.asset_count);
    const availabilityRate = total > 0
        ? ((Number(availableAssets) / total) * 100).toFixed(0)
        : 0;

    console.log(stats);

    return (
        <div className="p-6 lg:p-10 bg-[#f8fafc] min-h-screen">
            <header className="mb-10">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Global Overview</h1>
                <p className="text-slate-500 font-medium">Real-time statistics of your asset inventory.</p>
            </header>

            {/* Grid de Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <StatCard
                    title="Total Inventory Value"
                    value={`$${stats?.total_value.toLocaleString()}`}
                    icon="💰"
                    bgColor="bg-emerald-50"
                    textColor="text-emerald-600"
                />

                <StatCard
                    title="Total Assets"
                    value={stats?.asset_count}
                    icon="📦"
                    bgColor="bg-blue-50"
                    textColor="text-blue-600"
                />

                <StatCard
                    title="Categories"
                    value={stats?.category_count}
                    icon="🏷️"
                    bgColor="bg-purple-50"
                    textColor="text-purple-600"
                />

                <StatCard
                    title="Most Valuable Asset"
                    value={stats?.top_asset_name}
                    icon="🏆"
                    bgColor="bg-amber-50"
                    textColor="text-amber-600"
                    isSmallText={true}
                />

                <StatCard
                    title="Operational Readiness"
                    value={`${availabilityRate}%`}
                    icon="⚡"
                    bgColor="bg-indigo-50"
                    textColor="text-indigo-600"
                />
            </div>

            {/* Espacio para gráficas o lista reciente */}
            {/* Dashboard.tsx */}
            <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Gráfica - Ocupa 2 columnas en pantallas grandes */}
                <div className="lg:col-span-2">
                    <CategoryChart data={stats?.category_distribution || []} />
                </div>

                <div className="lg:col-span-2">
                    <StatusOverview data={stats?.status_distribution || []} />
                </div>

                {/* Panel lateral de ayuda o stats rápidos */}
                <div className="bg-slate-900 rounded-2xl p-8 text-white flex flex-col justify-between overflow-hidden relative">
                    <div className="relative z-10">
                        <h3 className="text-xl font-bold mb-2">Inventory Health</h3>
                        <p className="text-slate-400 text-sm">You have {stats?.asset_count} assets distributed in {stats?.category_count} categories.</p>
                    </div>
                    <div className="mt-8 relative z-10">
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all">
                            Download Report
                        </button>
                    </div>
                    {/* Un círculo decorativo de fondo */}
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, bgColor, textColor, isSmallText = false }: any) {
    return (
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${bgColor} text-xl`}>
                    {icon}
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${bgColor} ${textColor}`}>
                    Live
                </span>
            </div>
            <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">{title}</h3>
            <p className={`text-slate-900 font-black truncate ${isSmallText ? 'text-lg' : 'text-3xl'}`}>
                {value}
            </p>
        </div>
    );
}