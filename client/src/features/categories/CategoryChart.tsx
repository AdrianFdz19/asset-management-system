import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = ['#0ea5e9', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444'];

function CategoryChart({ data }: { data: any[] }) {
    // Formateamos los datos para Recharts
    const formattedData = data.map(item => ({
        name: item.category_name,
        value: parseInt(item.total)
    }));

    return (
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm h-[400px]">
            <h3 className="text-slate-900 font-bold text-lg mb-6 text-left">Assets by Category</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={formattedData}
                        cx="50%"
                        cy="45%"
                        innerRadius={80}
                        outerRadius={110}
                        paddingAngle={8}
                        dataKey="value"
                    >
                        {formattedData.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                    />
                    <Legend iconType="circle" layout="horizontal" verticalAlign="bottom" align="center" />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}