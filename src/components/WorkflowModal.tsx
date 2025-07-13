import { useState, useEffect } from 'react';
import { generateMermaidDiagram } from '../utils/mermaidUtils';
import type { Workflow } from '../hooks/useWorkflows';

interface WorkflowModalProps {
  workflow: Workflow;
  category: string;
  onClose: () => void;
}

export default function WorkflowModal({ workflow, category, onClose }: WorkflowModalProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'json' | 'diagram'>('details');
  const [jsonData, setJsonData] = useState<string | null>(null);
  const [diagramData, setDiagramData] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (workflow && activeTab === 'json') {
      loadWorkflowJson();
    } else if (workflow && activeTab === 'diagram') {
      loadWorkflowDiagram();
    }
    // eslint-disable-next-line
  }, [workflow, activeTab]);

  const loadWorkflowJson = async () => {
    setLoading(true);
    try {
      const fullWorkflowData = {
        ...workflow,
        nodes: workflow.nodes,
        connections: workflow.connections
      };
      setJsonData(JSON.stringify(fullWorkflowData, null, 2));
    } catch (error) {
      setJsonData('Error loading JSON');
      console.error('Error loading JSON:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWorkflowDiagram = async () => {
    setLoading(true);
    try {
      const diagram = generateMermaidDiagram(workflow.nodes, workflow.connections);
      setDiagramData(diagram);
    } catch (error) {
      setDiagramData('Error loading diagram');
      console.error('Error loading diagram:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const downloadWorkflow = () => {
    if (!jsonData) return;
    const blob = new Blob([jsonData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = workflow.filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-xl max-w-2xl w-full mx-4 relative animate-fade-in">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 dark:hover:text-white text-2xl"
          onClick={onClose}
          aria-label="Close modal"
        >
          &times;
        </button>
        <div className="p-6">
          <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
            <button
              className={`py-2 px-4 font-semibold border-b-2 transition ${activeTab === 'details' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button
              className={`py-2 px-4 font-semibold border-b-2 transition ${activeTab === 'json' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('json')}
            >
              JSON
            </button>
            <button
              className={`py-2 px-4 font-semibold border-b-2 transition ${activeTab === 'diagram' ? 'border-blue-500 text-blue-600 dark:text-blue-400' : 'border-transparent text-gray-500 dark:text-gray-400'}`}
              onClick={() => setActiveTab('diagram')}
            >
              Diagram
            </button>
          </div>

          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="text-lg font-bold text-gray-900 dark:text-white mb-2">{workflow.name}</div>
              <div className="text-gray-600 dark:text-gray-300 mb-2">{workflow.description}</div>
              <div className="flex flex-wrap gap-2 mb-2">
                <span className={`inline-block px-2 py-0.5 rounded text-xs font-semibold ${workflow.active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>{workflow.active ? 'Active' : 'Inactive'}</span>
                <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700">{workflow.trigger_type}</span>
                <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-yellow-100 text-yellow-700">{workflow.complexity}</span>
                <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-gray-100 text-gray-700">{workflow.node_count} nodes</span>
                <span className="inline-block px-2 py-0.5 rounded text-xs font-semibold bg-gray-200 text-gray-700">{category}</span>
              </div>
              {workflow.integrations.length > 0 && (
                <div>
                  <div className="font-semibold text-gray-700 dark:text-gray-200 mb-1">Integrations</div>
                  <div className="flex flex-wrap gap-1">
                    {workflow.integrations.map((integration, index) => (
                      <span key={index} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-2 py-0.5 text-xs">
                        {integration}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="pt-2">
                <button
                  className="inline-flex items-center gap-2 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                  onClick={downloadWorkflow}
                  disabled={!jsonData}
                >
                  Download JSON
                </button>
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700 dark:text-gray-200">Workflow JSON</span>
                <button
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded text-sm ${copied ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                  onClick={() => jsonData && copyToClipboard(jsonData)}
                  disabled={!jsonData}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              {loading ? (
                <div className="flex justify-center py-8">
                  <span className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                </div>
              ) : (
                <pre className="bg-gray-100 dark:bg-gray-800 rounded p-4 text-xs overflow-x-auto max-h-96 whitespace-pre-wrap">{jsonData || 'No JSON data available'}</pre>
              )}
            </div>
          )}

          {activeTab === 'diagram' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-700 dark:text-gray-200">Workflow Diagram</span>
                <button
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded text-sm ${copied ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                  onClick={() => diagramData && copyToClipboard(diagramData)}
                  disabled={!diagramData}
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              {loading ? (
                <div className="flex justify-center py-8">
                  <span className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                </div>
              ) : diagramData ? (
                <div className="bg-gray-100 dark:bg-gray-800 rounded p-4 overflow-x-auto">
                  <pre className="text-xs whitespace-pre-wrap">{diagramData}</pre>
                </div>
              ) : (
                <span className="text-gray-500 dark:text-gray-400">No diagram data available</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
