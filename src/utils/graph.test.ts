import { describe, expect, it } from 'vitest';
import type { NetworkGraph } from '../types/network';
import { computeReachableNodes } from './graph';

const sampleGraph: NetworkGraph = {
  nodes: [
    { id: 'A', coordinates: [0, 0] },
    { id: 'B', coordinates: [1, 0] },
    { id: 'C', coordinates: [2, 0] },
  ],
  edges: [
    { id: 'A-B', from: 'A', to: 'B', weight: 2 },
    { id: 'B-C', from: 'B', to: 'C', weight: 2 },
  ],
};

describe('computeReachableNodes', () => {
  it('returns nodes within threshold', () => {
    const result = computeReachableNodes(sampleGraph, { originId: 'A', maxCost: 3 });
    expect(result.map((item) => item.node.id)).toEqual(['A', 'B']);
  });

  it('includes origin node at zero cost', () => {
    const result = computeReachableNodes(sampleGraph, { originId: 'A', maxCost: 0 });
    expect(result).toHaveLength(1);
    expect(result[0].node.id).toBe('A');
    expect(result[0].cost).toBe(0);
  });
});
