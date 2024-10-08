import { FiHome, FiLayers } from 'react-icons/fi';

export default function AdminSidebar({ activeTab, setActiveTab }) {
  return (
    <div className="w-64 bg-indigo-700 text-white">
      <div className="p-4">
        <h1 className="text-2xl font-semibold">Admin Panel</h1>
      </div>
      <nav className="mt-8">
        {[
          ['dashboard', '/admin'],
          ['projects', '/admin/projects'],
        ].map(([tab, href]) => (
          <a
            key={tab}
            href={href}
            className={`flex items-center py-3 px-4 ${
              activeTab === tab ? 'bg-indigo-800 border-l-4 border-white' : ''
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'dashboard' ? (
              <FiHome className="mr-3" />
            ) : (
              <FiLayers className="mr-3" />
            )}
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </a>
        ))}
      </nav>
    </div>
  );
}
