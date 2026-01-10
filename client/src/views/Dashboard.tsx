import { useGetDashboardStatsQuery } from '../features/api/apiSlice'

export default function Dashboard() {
    const { data: stats, isSuccess, isLoading, isFetching, isError } = useGetDashboardStatsQuery();

    if (isLoading || isFetching) return <div className="p-8 text-gray-500">Loading dashboard stats...</div>;
    if (isError) return <div className="p-8 text-red-500">Error loading data.</div>;

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
            </div>

            {/* Espacio para gráficas o lista reciente */}
            <div className="mt-10 p-8 border-2 border-dashed border-slate-200 bg-white rounded-2xl text-center text-slate-400 font-medium shadow-sm">
                Charts and Activity Feed coming soon...
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