import type { Filters } from '../hooks/useSearch';

interface SearchControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  categories: string[];
  onThemeToggle: () => void;
  theme: 'light' | 'dark';
}

export default function SearchControls({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  categories,
  onThemeToggle,
  theme
}: SearchControlsProps) {
  const handleFilterChange = (key: keyof Filters, value: string | boolean) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <section className="w-full bg-white dark:bg-gray-900 shadow-sm py-4 mb-8 sticky top-0 z-20 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <input
            type="text"
            className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-2 text-base text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Search workflows by name, description, or integration..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <select
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-base text-gray-900 dark:text-white"
            value={filters.trigger}
            onChange={(e) => handleFilterChange('trigger', e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="Webhook">Webhook</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Manual">Manual</option>
            <option value="HTTP">HTTP</option>
          </select>
          <select
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-base text-gray-900 dark:text-white"
            value={filters.complexity}
            onChange={(e) => handleFilterChange('complexity', e.target.value)}
          >
            <option value="all">All Levels</option>
            <option value="low">Low (≤5 nodes)</option>
            <option value="medium">Medium (6-15 nodes)</option>
            <option value="high">High (16+ nodes)</option>
          </select>
          <select
            className="rounded-md border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-base text-gray-900 dark:text-white"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-gray-700 dark:text-gray-200 text-base">
            <input
              type="checkbox"
              checked={filters.activeOnly}
              onChange={(e) => handleFilterChange('activeOnly', e.target.checked)}
              className="accent-blue-500"
            />
            Active only
          </label>
          <button
            type="button"
            onClick={onThemeToggle}
            className="ml-0 md:ml-4 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600 transition"
          >
            {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </button>
        </div>
      </div>
    </section>
  );
}
