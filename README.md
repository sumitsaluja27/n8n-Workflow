# N8N Workflow Documentation

A modern React + Vite application for browsing and searching N8N workflow documentation. This application provides a lightning-fast interface for exploring workflow metadata, searching by various criteria, and viewing detailed workflow information.

## Features

- **Fast Search**: Instant search across workflow names, descriptions, and integrations
- **Advanced Filtering**: Filter by trigger type, complexity, category, and active status
- **Workflow Details**: View detailed workflow information including JSON and Mermaid diagrams
- **Dark/Light Theme**: Toggle between dark and light themes
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Static Generation**: Pre-generated data for optimal performance

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **UI Framework**: Mantine UI
- **Build Tool**: Vite
- **Icons**: Lucide React
- **Diagrams**: Mermaid
- **Deployment**: Netlify (static hosting)

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd n8n-workflows
```

2. Install dependencies:
```bash
npm install
```

3. Generate static data:
```bash
npm run generate-data
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Building for Production

```bash
npm run build
```

This will:
1. Generate static data from workflow files
2. Build the React application
3. Output optimized files to the `dist` directory

## Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx      # Application header with stats
│   ├── SearchControls.tsx # Search and filter controls
│   ├── WorkflowCard.tsx   # Individual workflow card
│   ├── WorkflowGrid.tsx   # Grid of workflow cards
│   └── WorkflowModal.tsx  # Detailed workflow modal
├── hooks/              # Custom React hooks
│   ├── useWorkflows.ts # Workflow data management
│   ├── useSearch.ts    # Search and filtering logic
│   └── useTheme.ts     # Theme management
├── utils/              # Utility functions
│   └── mermaidUtils.ts # Mermaid diagram generation
├── data/               # Generated static data
│   ├── workflows.json  # Workflow metadata
│   ├── stats.json      # Statistics
│   ├── categories.json # Categories
│   └── category-mappings.json # Category assignments
└── App.tsx             # Main application component
```

## Data Generation

The application uses a static data generation script that processes workflow JSON files and creates optimized data files for the frontend. This approach provides:

- **Fast Loading**: No server-side processing required
- **SEO Friendly**: Static files are easily indexed
- **Cost Effective**: No server costs for hosting
- **Scalable**: Can handle thousands of workflows efficiently

### Running Data Generation

```bash
npm run generate-data
```

This script:
1. Reads all workflow JSON files from the `workflows/` directory
2. Extracts metadata and analyzes workflow structure
3. Generates categories based on integrations
4. Creates optimized JSON files in `src/data/`

## Deployment

### Netlify

The application is configured for easy deployment to Netlify:

1. Connect your repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Deploy!

The `netlify.toml` file contains the necessary configuration.

### Other Platforms

The application can be deployed to any static hosting platform:
- Vercel
- GitHub Pages
- AWS S3 + CloudFront
- Any CDN

## Development

### Adding New Workflows

1. Add workflow JSON files to the `workflows/` directory
2. Run `npm run generate-data` to update the static data
3. The new workflows will appear in the application

### Customizing Categories

Edit the category rules in `scripts/generate-static-data.js` to customize how workflows are categorized based on their integrations.

### Styling

The application uses Mantine UI components with a custom theme. To modify styling:

1. Update theme configuration in `src/App.tsx`
2. Modify component styles using Mantine's styling system
3. Add custom CSS in `src/App.css` if needed

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
