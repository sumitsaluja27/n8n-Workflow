import { useState } from 'react';
import { MantineProvider, Container } from '@mantine/core';
import Header from './components/Header';
import SearchControls from './components/SearchControls';
import WorkflowGrid from './components/WorkflowGrid';
import WorkflowModal from './components/WorkflowModal';
import { useWorkflows } from './hooks/useWorkflows';
import { useSearch } from './hooks/useSearch';
import { useTheme } from './hooks/useTheme';
import type { Workflow } from './hooks/useWorkflows';
import './App.css';

function App() {
  const { theme, toggleTheme } = useTheme();
  const { workflows, stats, categories, categoryMappings, loading, error } = useWorkflows();
  const { searchQuery, setSearchQuery, filters, setFilters, filteredWorkflows } = useSearch(workflows, categoryMappings);
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null);

  return (
    <MantineProvider theme={{ colorScheme: theme }}>
      <div className="app">
        <Header stats={stats} />
        <SearchControls
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories}
          onThemeToggle={toggleTheme}
          theme={theme}
        />
        <Container size="xl" py="xl">
          <WorkflowGrid
            workflows={filteredWorkflows}
            loading={loading}
            error={error}
            categoryMappings={categoryMappings}
            onWorkflowSelect={setSelectedWorkflow}
          />
        </Container>
        {selectedWorkflow && (
          <WorkflowModal
            workflow={selectedWorkflow}
            category={categoryMappings.get(selectedWorkflow.filename) || 'Uncategorized'}
            onClose={() => setSelectedWorkflow(null)}
          />
        )}
      </div>
    </MantineProvider>
  );
}

export default App;
