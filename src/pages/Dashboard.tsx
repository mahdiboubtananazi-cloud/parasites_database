import React, { useEffect, useState } from 'react';
import { parasitesApi, Parasite } from '../api/parasites';
import { useAuth } from '../contexts/AuthContext';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [parasites, setParasites] = useState<Parasite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await parasitesApi.getAll();
        // ????? ???????? ??? ???????? (??? ?? ??? ????)
        // ????? ????? ??? ?????? ??? ??????
        setParasites(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="p-10 text-center">???? ???????...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">???? ??????</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">?????? ???????</h3>
          <p className="text-3xl font-bold">{parasites.length}</p>
        </div>
        {/* ????? ????? ?????? ?? ?????????? ??? */}
      </div>

      <h2 className="text-xl font-bold mb-4">??? ??????? ???????</h2>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-right">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4">?????</th>
              <th className="p-4">???????</th>
              <th className="p-4">???????</th>
            </tr>
          </thead>
          <tbody>
            {parasites.slice(0, 5).map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-4">{p.name}</td>
                <td className="p-4">{p.category}</td>
                <td className="p-4">{new Date(p.created_at).toLocaleDateString('ar-EG')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
