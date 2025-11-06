export interface NetworkNode {
  id: string;
  name?: string;
  coordinates: [number, number];
  metadata?: Record<string, unknown>;
}

export interface NetworkEdge {
  id: string;
  from: string;
  to: string;
  weight: number;
  metadata?: Record<string, unknown>;
}

export interface NetworkGraph {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  metadata?: Record<string, unknown>;
}

export interface OriginLocation {
  id: string;
  name: string;
  nodeId: string;
  description?: string;
}
