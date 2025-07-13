import type { Workflow } from '../hooks/useWorkflows';
import WorkflowCard from './WorkflowCard';

interface WorkflowGridProps {
  workflows: Workflow[];
  loading: boolean;
  error: string | null;
  categoryMappings: Map<string, string>;
  onWorkflowSelect: (workflow: Workflow) => void;
}

export default function WorkflowGrid({
  workflows,
  loading,
  error,
  categoryMappings,
  onWorkflowSelect
}: WorkflowGridProps) {
  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <span className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 text-red-800 rounded p-4 my-8 max-w-2xl mx-auto text-center">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  if (workflows.length === 0) {
    return (
      <div className="flex justify-center py-24">
        <span className="text-gray-500 dark:text-gray-400 text-lg">No workflows found. Try adjusting your search terms or filters.</span>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 pb-24">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center tracking-tight">Browse Workflows</h2>
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-6 text-center">
        {workflows.length.toLocaleString()} workflows found
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {workflows.map((workflow) => (
          <WorkflowCard
            key={workflow.filename}
            workflow={workflow}
            category={categoryMappings.get(workflow.filename) || 'Uncategorized'}
            onClick={() => onWorkflowSelect(workflow)}
          />
        ))}
      </div>
    </section>
  );
}
