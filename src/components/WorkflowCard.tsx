import type { Workflow } from '../hooks/useWorkflows';

interface WorkflowCardProps {
  workflow: Workflow;
  category: string;
  onClick: () => void;
}

export default function WorkflowCard({ workflow, category, onClick }: WorkflowCardProps) {
  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'low': return 'bg-green-400';
      case 'medium': return 'bg-yellow-400';
      case 'high': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-xl shadow hover:shadow-lg border border-gray-200 dark:border-gray-700 p-6 cursor-pointer transition flex flex-col h-full"
      onClick={onClick}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${workflow.name}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`inline-block w-2.5 h-2.5 rounded-full ${workflow.active ? 'bg-green-500' : 'bg-gray-400'}`} title={workflow.active ? 'Active' : 'Inactive'}></span>
          <span className={`inline-block w-2.5 h-2.5 rounded-full ${getComplexityColor(workflow.complexity)}`} title={workflow.complexity}></span>
          <span className="text-xs text-gray-500 dark:text-gray-400">{workflow.node_count} nodes</span>
          <span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-2 py-0.5 ml-2">{category}</span>
        </div>
        <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded px-2 py-0.5">{workflow.trigger_type}</span>
      </div>
      <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1 line-clamp-2">{workflow.name}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm mb-2 line-clamp-2">{workflow.description}</p>
      {workflow.integrations.length > 0 && (
        <div className="mt-auto pt-2">
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">Integrations ({workflow.integrations.length})</div>
          <div className="flex flex-wrap gap-1">
            {workflow.integrations.slice(0, 5).map((integration, index) => (
              <span key={index} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-2 py-0.5 text-xs">
                {integration}
              </span>
            ))}
            {workflow.integrations.length > 5 && (
              <span className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded px-2 py-0.5 text-xs">
                +{workflow.integrations.length - 5}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
