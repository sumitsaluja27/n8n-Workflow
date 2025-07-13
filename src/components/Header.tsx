import type { Stats } from '../hooks/useWorkflows';

interface HeaderProps {
  stats: Stats | null;
}

export default function Header({ stats }: HeaderProps) {
  return (
    <header className="relative w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-16 mb-12 shadow-sm border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-yellow-400 text-5xl drop-shadow">⚡</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight drop-shadow">N8N Workflow Documentation</h1>
        </div>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 font-medium">Lightning-fast workflow browser with instant search</p>
        {stats && (
          <div className="flex flex-wrap justify-center gap-8 text-gray-900 dark:text-white">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold">{stats.total.toLocaleString()}</div>
              <div className="uppercase text-xs text-gray-500 dark:text-gray-400 tracking-widest font-semibold">Workflows</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold text-green-500">{stats.active.toLocaleString()}</div>
              <div className="uppercase text-xs text-gray-500 dark:text-gray-400 tracking-widest font-semibold">Active</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold">{stats.total_nodes.toLocaleString()}</div>
              <div className="uppercase text-xs text-gray-500 dark:text-gray-400 tracking-widest font-semibold">Total Nodes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold">{stats.unique_integrations.toLocaleString()}</div>
              <div className="uppercase text-xs text-gray-500 dark:text-gray-400 tracking-widest font-semibold">Integrations</div>
            </div>
          </div>
        )}
      </div>
      <div className="absolute left-0 right-0 bottom-0 h-2 bg-gradient-to-r from-blue-400/10 via-blue-200/30 to-blue-400/10 dark:from-blue-900/20 dark:via-blue-800/30 dark:to-blue-900/20" />
    </header>
  );
}
