import { useState, useEffect } from 'react';
import workflowsData from '../data/workflows.json';
import statsData from '../data/stats.json';
import categoriesData from '../data/categories.json';
import categoryMappingsData from '../data/category-mappings.json';

export interface Node {
  name?: string;
  type?: string;
  [key: string]: unknown;
}

export interface Connections {
  [key: string]: unknown;
}

export interface Workflow {
  filename: string;
  name: string;
  workflow_id: string;
  active: boolean;
  nodes: Node[];
  connections: Connections;
  tags: string[];
  created_at: string;
  updated_at: string;
  file_hash: string;
  file_size: number;
  node_count: number;
  complexity: 'low' | 'medium' | 'high';
  trigger_type: string;
  integrations: string[];
  description: string;
}

export interface Stats {
  total: number;
  active: number;
  inactive: number;
  triggers: Record<string, number>;
  complexity: Record<string, number>;
  total_nodes: number;
  unique_integrations: number;
  last_indexed: string;
}

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryMappings, setCategoryMappings] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      setWorkflows(workflowsData as Workflow[]);
      setStats(statsData as Stats);
      setCategories(categoriesData as string[]);
      setCategoryMappings(new Map(Object.entries(categoryMappingsData as Record<string, string>)));
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setLoading(false);
    }
  }, []);

  return {
    workflows,
    stats,
    categories,
    categoryMappings,
    loading,
    error
  };
}
