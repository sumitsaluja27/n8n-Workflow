import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class StaticDataGenerator {
  constructor() {
    // Use correct paths for the new structure
    this.workflowsDir = path.resolve(__dirname, '../workflows');
    this.outputDir = path.resolve(__dirname, '../src/data');
    this.workflows = [];
    this.categories = new Set();
    this.categoryMap = new Map();
  }

  analyzeWorkflowFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    const filename = path.basename(filePath);
    const workflow = {
      filename,
      name: this.formatWorkflowName(filename),
      workflow_id: data.id || '',
      active: data.active || false,
      nodes: data.nodes || [],
      connections: data.connections || {},
      tags: data.tags || [],
      created_at: data.createdAt || '',
      updated_at: data.updatedAt || '',
      file_hash: this.getFileHash(filePath),
      file_size: fs.statSync(filePath).size
    };
    const jsonName = data.name?.trim();
    if (jsonName && jsonName !== filename.replace('.json', '') && !jsonName.startsWith('My workflow')) {
      workflow.name = jsonName;
    }
    workflow.node_count = workflow.nodes.length;
    workflow.complexity = this.getComplexity(workflow.node_count);
    const { trigger_type, integrations } = this.analyzeNodes(workflow.nodes);
    workflow.trigger_type = trigger_type;
    workflow.integrations = Array.from(integrations);
    workflow.description = this.generateDescription(workflow, trigger_type, integrations);
    return workflow;
  }

  formatWorkflowName(filename) {
    let name = filename.replace('.json', '');
    const parts = name.split('_');
    if (parts.length > 1 && /^\d+$/.test(parts[0])) {
      parts.shift();
    }
    const readableParts = parts.map(part => {
      const lower = part.toLowerCase();
      if (lower === 'http') return 'HTTP';
      if (lower === 'api') return 'API';
      if (lower === 'webhook') return 'Webhook';
      if (lower === 'automation') return 'Automation';
      if (lower === 'automate') return 'Automate';
      if (lower === 'scheduled') return 'Scheduled';
      if (lower === 'triggered') return 'Triggered';
      if (lower === 'manual') return 'Manual';
      return part.charAt(0).toUpperCase() + part.slice(1);
    });
    return readableParts.join(' ');
  }

  getComplexity(nodeCount) {
    if (nodeCount <= 5) return 'low';
    if (nodeCount <= 15) return 'medium';
    return 'high';
  }

  analyzeNodes(nodes) {
    const integrations = new Set();
    let triggerType = 'Manual';
    nodes.forEach(node => {
      if (node.type) {
        const typeParts = node.type.split('.');
        if (typeParts.length > 2) {
          const integration = typeParts[2];
          integrations.add(integration);
        }
      }
      if (node.type === 'n8n-nodes-base.webhook') {
        triggerType = 'Webhook';
      } else if (node.type === 'n8n-nodes-base.cron') {
        triggerType = 'Scheduled';
      } else if (node.type === 'n8n-nodes-base.httpRequest') {
        triggerType = 'HTTP';
      }
    });
    return { trigger_type: triggerType, integrations };
  }

  generateDescription(workflow, triggerType, integrations) {
    const parts = [];
    if (triggerType !== 'Manual') {
      parts.push(`${triggerType} trigger`);
    }
    if (integrations.size > 0) {
      const integrationList = Array.from(integrations).slice(0, 3).join(', ');
      parts.push(`integrates with ${integrationList}`);
    }
    if (workflow.node_count > 1) {
      parts.push(`${workflow.node_count} nodes`);
    }
    return parts.join(' • ') || 'Workflow automation';
  }

  getFileHash(filePath) {
    const content = fs.readFileSync(filePath);
    return crypto.createHash('md5').update(content).digest('hex');
  }

  generateCategories() {
    const categoryRules = {
      'Communication': ['slack', 'telegram', 'discord', 'mattermost', 'email', 'gmail'],
      'CRM & Sales': ['hubspot', 'pipedrive', 'salesforce', 'zoho', 'copper'],
      'Productivity': ['notion', 'airtable', 'google', 'microsoft', 'todoist'],
      'Development': ['github', 'gitlab', 'bitbucket', 'docker', 'aws'],
      'E-commerce': ['shopify', 'stripe', 'chargebee', 'quickbooks'],
      'Marketing': ['mailchimp', 'sendgrid', 'mailgun', 'typeform', 'calendly'],
      'Data & Analytics': ['bigquery', 'mysql', 'postgres', 'mongodb', 'firebase'],
      'Social Media': ['twitter', 'facebook', 'instagram', 'linkedin'],
      'Monitoring': ['uptimerobot', 'netlify', 'vercel', 'travis'],
      'File Management': ['dropbox', 'google drive', 'aws s3', 'onedrive']
    };
    this.workflows.forEach(workflow => {
      let assignedCategory = 'Uncategorized';
      for (const [category, keywords] of Object.entries(categoryRules)) {
        const hasKeyword = workflow.integrations.some(integration =>
          keywords.some(keyword => integration.toLowerCase().includes(keyword.toLowerCase()))
        );
        if (hasKeyword) {
          assignedCategory = category;
          break;
        }
      }
      this.categoryMap.set(workflow.filename, assignedCategory);
      this.categories.add(assignedCategory);
    });
  }

  generate() {
    console.log('Starting static data generation...');
    const workflowFiles = fs.readdirSync(this.workflowsDir)
      .filter(file => file.endsWith('.json'))
      .map(file => path.join(this.workflowsDir, file));
    console.log(`Found ${workflowFiles.length} workflow files`);
    this.workflows = workflowFiles.map(filePath => {
      try {
        return this.analyzeWorkflowFile(filePath);
      } catch (error) {
        console.error(`Error processing ${filePath}:`, error.message);
        return null;
      }
    }).filter(Boolean);
    this.generateCategories();
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
    const stats = {
      total: this.workflows.length,
      active: this.workflows.filter(w => w.active).length,
      inactive: this.workflows.filter(w => !w.active).length,
      triggers: this.workflows.reduce((acc, w) => {
        acc[w.trigger_type] = (acc[w.trigger_type] || 0) + 1;
        return acc;
      }, {}),
      complexity: this.workflows.reduce((acc, w) => {
        acc[w.complexity] = (acc[w.complexity] || 0) + 1;
        return acc;
      }, {}),
      total_nodes: this.workflows.reduce((sum, w) => sum + w.node_count, 0),
      unique_integrations: new Set(this.workflows.flatMap(w => w.integrations)).size,
      last_indexed: new Date().toISOString()
    };
    fs.writeFileSync(
      path.join(this.outputDir, 'workflows.json'),
      JSON.stringify(this.workflows, null, 2)
    );
    fs.writeFileSync(
      path.join(this.outputDir, 'stats.json'),
      JSON.stringify(stats, null, 2)
    );
    fs.writeFileSync(
      path.join(this.outputDir, 'categories.json'),
      JSON.stringify(Array.from(this.categories).sort(), null, 2)
    );
    fs.writeFileSync(
      path.join(this.outputDir, 'category-mappings.json'),
      JSON.stringify(Object.fromEntries(this.categoryMap), null, 2)
    );
    console.log('Static data generation complete!');
    console.log(`- ${this.workflows.length} workflows processed`);
    console.log(`- ${this.categories.size} categories generated`);
    console.log(`- Files written to ${this.outputDir}`);
  }
}

const generator = new StaticDataGenerator();
generator.generate();
