import type { NetworkGraph, NetworkNode } from '../types/network';

type Neighbor = {
  node: NetworkNode;
  weight: number;
};

type GraphIndex = {
  nodesById: Map<string, NetworkNode>;
  adjacency: Map<string, Neighbor[]>;
};

export interface ReachabilityOptions {
  originId: string;
  maxCost: number;
}

export interface ReachableNode {
  node: NetworkNode;
  cost: number;
  path: string[];
}

export const buildGraphIndex = (graph: NetworkGraph): GraphIndex => {
  const nodesById = new Map<string, NetworkNode>();
  graph.nodes.forEach((node) => nodesById.set(node.id, node));

  const adjacency = new Map<string, Neighbor[]>();
  graph.edges.forEach((edge) => {
    const fromNode = nodesById.get(edge.from);
    const toNode = nodesById.get(edge.to);
    if (!fromNode || !toNode) {
      return;
    }

    if (!adjacency.has(edge.from)) {
      adjacency.set(edge.from, []);
    }
    if (!adjacency.has(edge.to)) {
      adjacency.set(edge.to, []);
    }

    adjacency.get(edge.from)?.push({ node: toNode, weight: edge.weight });
    adjacency.get(edge.to)?.push({ node: fromNode, weight: edge.weight });
  });

  return { nodesById, adjacency };
};

export const computeReachableNodes = (
  graph: NetworkGraph,
  { originId, maxCost }: ReachabilityOptions,
): ReachableNode[] => {
  const { nodesById, adjacency } = buildGraphIndex(graph);
  const originNode = nodesById.get(originId);
  if (!originNode) {
    throw new Error(`Origin node ${originId} not found in graph.`);
  }

  const costs = new Map<string, number>();
  const previous = new Map<string, string | null>();
  const visited = new Set<string>();

  const queue: Array<{ nodeId: string; cost: number }> = [{ nodeId: originId, cost: 0 }];
  costs.set(originId, 0);
  previous.set(originId, null);

  const enqueue = (nodeId: string, cost: number) => {
    let index = queue.findIndex((item) => cost < item.cost);
    if (index === -1) {
      index = queue.length;
    }
    queue.splice(index, 0, { nodeId, cost });
  };

  const reachable: ReachableNode[] = [];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current) break;
    if (visited.has(current.nodeId)) continue;
    visited.add(current.nodeId);

    const cost = costs.get(current.nodeId) ?? Infinity;
    if (cost > maxCost) continue;

    const node = nodesById.get(current.nodeId);
    if (node) {
      const path: string[] = [];
      let walker: string | null | undefined = current.nodeId;
      while (walker) {
        path.unshift(walker);
        walker = previous.get(walker) ?? null;
      }
      reachable.push({ node, cost, path });
    }

    const neighbors = adjacency.get(current.nodeId) ?? [];
    neighbors.forEach(({ node: neighborNode, weight }) => {
      const newCost = cost + weight;
      if (newCost > maxCost) {
        return;
      }
      const existingCost = costs.get(neighborNode.id);
      if (existingCost === undefined || newCost < existingCost) {
        costs.set(neighborNode.id, newCost);
        previous.set(neighborNode.id, current.nodeId);
        enqueue(neighborNode.id, newCost);
      }
    });
  }

  return reachable;
};

export const computeBounds = (nodes: NetworkNode[]) => {
  if (nodes.length === 0) {
    return null;
  }
  const longitudes = nodes.map((node) => node.coordinates[0]);
  const latitudes = nodes.map((node) => node.coordinates[1]);
  return [
    [Math.min(...longitudes), Math.min(...latitudes)],
    [Math.max(...longitudes), Math.max(...latitudes)],
  ];
};

export const buildReachabilityGeoJSON = (reachableNodes: ReachableNode[]) => {
  return {
    type: 'FeatureCollection',
    features: reachableNodes.map(({ node, cost }) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: node.coordinates,
      },
      properties: {
        id: node.id,
        name: node.name ?? node.id,
        cost,
      },
    })),
  } as const;
};

export const buildReachableEdges = (
  graph: NetworkGraph,
  reachableNodes: ReachableNode[],
) => {
  const reachableIds = new Set(reachableNodes.map(({ node }) => node.id));
  return graph.edges
    .filter((edge) => reachableIds.has(edge.from) && reachableIds.has(edge.to))
    .map((edge) => ({
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          graph.nodes.find((node) => node.id === edge.from)?.coordinates ?? [0, 0],
          graph.nodes.find((node) => node.id === edge.to)?.coordinates ?? [0, 0],
        ],
      },
      properties: {
        id: edge.id,
        weight: edge.weight,
      },
    }));
};
