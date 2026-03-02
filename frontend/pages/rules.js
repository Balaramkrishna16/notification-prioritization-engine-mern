import { useState, useEffect } from 'react';

export default function RulesManager() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    event_type: '',
    action: 'FORCE_NOW',
    priority_adjustment: 0
  });

  const fetchRules = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rules`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      setRules(data);
    } catch (err) {
      console.error("Failed to fetch rules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRules(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rules`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        ...formData,
        condition_json: { event_type: formData.event_type }
      }),
    });

    if (res.ok) {
      setShowModal(false);
      fetchRules();
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem('token');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/rules/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchRules();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Rules Manager</h1>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold shadow-md hover:bg-blue-700 transition-all"
          >
            + New Rule
          </button>
        </div>

        {/* 📋 Active Rules List */}
        <div className="grid grid-cols-1 gap-4">
          {rules.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-xl border border-dashed text-gray-400">
              No active rules found. Create one to override AI logic.
            </div>
          ) : (
            rules.map((rule) => (
              <div key={rule._id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="font-bold text-gray-900">{rule.name}</h3>
                  <p className="text-sm text-gray-500">{rule.description || 'No description provided.'}</p>
                  <div className="mt-2 flex gap-2">
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded font-mono uppercase">
                      IF Type == {rule.condition_json?.event_type}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded font-bold ${
                      rule.action.includes('NOW') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      THEN {rule.action}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(rule._id)}
                  className="text-red-500 hover:text-red-700 text-sm font-bold uppercase tracking-tight"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🏗️ Modal for Creating Rules */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmit} className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Create Logic Rule</h2>
            <div className="space-y-4">
              <input placeholder="Rule Name" required className="w-full p-3 border rounded-lg" onChange={e => setFormData({...formData, name: e.target.value})} />
              <input placeholder="Event Type (e.g., SECURITY)" required className="w-full p-3 border rounded-lg" onChange={e => setFormData({...formData, event_type: e.target.value})} />
              <select className="w-full p-3 border rounded-lg" onChange={e => setFormData({...formData, action: e.target.value})}>
                <option value="FORCE_NOW">FORCE NOW (Bypass AI)</option>
                <option value="FORCE_NEVER">FORCE NEVER (Drop)</option>
                <option value="ADJUST_PRIORITY">ADJUST PRIORITY</option>
              </select>
              <textarea placeholder="Rule Description" className="w-full p-3 border rounded-lg" onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 text-gray-500 font-bold">Cancel</button>
              <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-bold">Save Rule</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}