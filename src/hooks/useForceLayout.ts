'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import {
  forceSimulation,
  forceCollide,
  forceRadial,
  forceCenter,
  SimulationNodeDatum,
} from 'd3-force';

export interface ForceNode extends SimulationNodeDatum {
  id: string;
  radius: number;
  x?: number;
  y?: number;
}

interface UseForceLayoutOptions {
  width: number;
  height: number;
  centerRadius?: number;
  nodeRadius?: number;
  padding?: number;
}

export function useForceLayout<T extends ForceNode>(
  nodes: T[],
  options: UseForceLayoutOptions
) {
  const { width, height, centerRadius = 100, nodeRadius = 40, padding = 20 } = options;
  const simulationRef = useRef<ReturnType<typeof forceSimulation<T>> | null>(null);
  const [positions, setPositions] = useState<Map<string, { x: number; y: number }>>(
    new Map()
  );

  const updatePositions = useCallback(() => {
    if (!simulationRef.current) return;
    
    const newPositions = new Map<string, { x: number; y: number }>();
    simulationRef.current.nodes().forEach((node) => {
      if (node.x !== undefined && node.y !== undefined) {
        newPositions.set(node.id, { x: node.x, y: node.y });
      }
    });
    setPositions(newPositions);
  }, []);

  useEffect(() => {
    if (nodes.length === 0 || width === 0 || height === 0) return;

    const centerX = width / 2;
    const centerY = height / 2;
    const orbitRadius = Math.min(width, height) / 2 - nodeRadius - padding;

    // Initialize node positions in a circle
    const nodesWithPositions = nodes.map((node, index) => {
      const angle = (2 * Math.PI * index) / nodes.length - Math.PI / 2;
      return {
        ...node,
        x: centerX + orbitRadius * 0.8 * Math.cos(angle),
        y: centerY + orbitRadius * 0.8 * Math.sin(angle),
      };
    });

    // Create simulation
    const simulation = forceSimulation<T>(nodesWithPositions as T[])
      .force('center', forceCenter(centerX, centerY).strength(0.02))
      .force(
        'radial',
        forceRadial<T>(orbitRadius * 0.7, centerX, centerY).strength(0.3)
      )
      .force(
        'collide',
        forceCollide<T>()
          .radius((d) => d.radius + padding)
          .strength(0.8)
      )
      .alphaDecay(0.02)
      .velocityDecay(0.3)
      .on('tick', updatePositions);

    simulationRef.current = simulation;

    return () => {
      simulation.stop();
      simulationRef.current = null;
    };
  }, [nodes, width, height, centerRadius, nodeRadius, padding, updatePositions]);

  // Reheat simulation when nodes change
  useEffect(() => {
    if (simulationRef.current && nodes.length > 0) {
      simulationRef.current.alpha(0.3).restart();
    }
  }, [nodes.length]);

  return { positions };
}
