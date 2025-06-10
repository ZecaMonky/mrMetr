'use client';

import { useEffect, useState } from 'react';

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-4 border border-gray-200 w-full sm:w-70">
      <h3 className="text-gray-500 text-sm mb-1">{title}</h3>
      <div>{value}</div>
    </div>
  );
}

export default function AdminStats() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      const res = await fetch('/api/admin');
      const data = await res.json();
      setStats(data);
    }
    fetchStats();
  }, []);

  if (!stats) return <p>Загрузка статистики...</p>;

  return (
    <div className="flex flex-wrap gap-4">
      <StatCard title="Всего заказов" value={stats.totalOrders} />
      <StatCard title="Общая выручка" value={stats.totalRevenue.toFixed(2) + ' ₽'} />
      <StatCard title="Средний чек" value={stats.averageOrderValue.toFixed(2) + ' ₽'} />
      <StatCard title="Продано товаров" value={stats.totalItemsSold} />
      <StatCard title="Заказов за неделю" value={stats.weeklyOrders} />

        {stats.topProduct && (
        <StatCard
            title="Самый продаваемый товар"
            value={
            <div className="text-base">
                <span className="text-sm font-bold block">{stats.topProduct.name}</span>
                <span className="text-sm text-gray-600">{stats.topProduct.quantity} шт.</span>
            </div>
            }
        />
        )}

      <div className="w-full mt-6">
        <h3 className="text-lg font-semibold mb-2">Динамика выручки (по дням):</h3>
        <ul className="space-y-1 text-gray-700">
          {Object.entries(stats.revenueByDate).map(([date, amount]) => (
            <li key={date}>
              <span className="font-medium">{date}</span>: {amount.toFixed(2)} ₽
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
