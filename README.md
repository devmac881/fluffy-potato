# Coverage Explorer

A React + Mapbox GL JS prototype for visualizing geographic coverage from predefined origin locations over a network imported from a NetworkX graph export.

## Getting started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment template and add your Mapbox token:
   ```bash
   cp .env.example .env
   # edit .env to include VITE_MAPBOX_TOKEN
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## Data configuration

- `data/network.json` contains the exported NetworkX graph (nodes, edges, metadata).
- `data/origins.json` lists selectable origin locations mapped to node IDs.

Update these files to point at your actual network model and origin catalog.

## Features

- Choose an origin to compute reachability across the network.
- Adjust coverage threshold to expand or contract reachable nodes.
- Visualize reachable nodes and edges with Mapbox GL JS.
- Inspect coverage metrics (reachable nodes, percentage coverage, threshold).

## Testing

Run unit tests (example placeholder):
```bash
npm run test
```

## Accessibility & UX considerations

- Keyboard-accessible form controls and ARIA-live metrics updates.
- Responsive layout with sidebar on desktop and stacked layout on mobile widths.
- High-contrast legend and overlays for clarity.
