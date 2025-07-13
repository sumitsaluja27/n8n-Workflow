export function generateMermaidDiagram(nodes: any[], connections: any): string {
  let diagram = 'graph TD\n';

  // Add nodes
  nodes.forEach((node, index) => {
    const nodeId = `node${index}`;
    const nodeName = node.name || node.type || `Node ${index}`;
    diagram += `    ${nodeId}["${nodeName}"]\n`;
  });

  // Add connections
  Object.entries(connections).forEach(([sourceNode, outputs]) => {
    if (typeof outputs === 'object' && outputs !== null) {
      Object.entries(outputs).forEach(([outputName, connections]) => {
        if (Array.isArray(connections)) {
          connections.forEach((connection: any) => {
            const sourceId = `node${sourceNode}`;
            const targetId = `node${connection.node}`;
            diagram += `    ${sourceId} --> ${targetId}\n`;
          });
        }
      });
    }
  });

  return diagram;
}
