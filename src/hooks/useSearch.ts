import { useState, useMemo } from 'react';
import type { Workflow } from './useWorkflows';

export interface Filters {
  trigger: string;
  complexity: string;
  category: string;
  activeOnly: boolean;
}

export function useSearch(workflows: Workflow[], categoryMappings: Map<string, string>) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    trigger: 'all',
    complexity: 'all',
    category: 'all',
    activeOnly: false
  });

  const filteredWorkflows = useMemo(() => {
    return workflows.filter(workflow => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matches =
          workflow.name.toLowerCase().includes(query) ||
          workflow.description.toLowerCase().includes(query) ||
          workflow.integrations.some(integration =>
            integration.toLowerCase().includes(query)
          );
        if (!matches) return false;
      }

      // Trigger filter
      if (filters.trigger !== 'all' && workflow.trigger_type !== filters.trigger) {
        return false;
      }

      // Complexity filter
      if (filters.complexity !== 'all' && workflow.complexity !== filters.complexity) {
        return false;
      }

      // Category filter
      if (filters.category !== 'all') {
        const workflowCategory = categoryMappings.get(workflow.filename) || 'Uncategorized';
        if (workflowCategory !== filters.category) {
          return false;
        }
      }

      // Active only filter
      if (filters.activeOnly && !workflow.active) {
        return false;
      }

      return true;
    });
  }, [workflows, searchQuery, filters, categoryMappings]);

  return {
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    filteredWorkflows
  };
}
