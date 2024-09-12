import { PriorityQueue } from '@datastructures-js/priority-queue';

interface Dictionary<T> {
  [Key: string]: T;
}

interface PriortiyPoint {
  priority: number;
  point: Point;
}

class Point {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  key(): string {
    return `${this.x}-${this.y}`;
  }
}

const grid: (number | string)[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
];

// The order of the offsets would normally be N E S W, but this makes it the way the website has
// Also, are diagonals allowed? If so, add offsets to support that
const neighborOffsets = [
  [0, 1], // east
  [0, -1], // west
  [-1, 0], // north
  [1, 0], // south
];

const frontier = new PriorityQueue<PriortiyPoint>(
  (a, b) => a.priority - b.priority
);
const came_from: Dictionary<Point> = {};
const cost: Dictionary<number> = {};

function run() {
  const start = new Point(0, 0);
  const goal = new Point(14, 14);

  if (!isValid(start) || !isValid(goal)) {
    console.log('Start or end point is invalid.');
    return;
  }

  frontier.enqueue({
    priority: 0,
    point: start,
  });
  came_from[start.key()] = null;
  cost[start.key()] = 0;

  while (frontier.size() > 0) {
    const current = frontier.dequeue().point;
    const cString = current.key();

    if (cString === goal.key()) break;

    calculateNeighbors(current).forEach((next) => {
      const new_cost = cost[cString] + 1;
      const nString = next.key();

      if (!cost[nString] || new_cost < cost[nString]) {
        cost[nString] = new_cost;
        const priority = new_cost + heuristic(goal, next);

        frontier.enqueue({
          priority,
          point: next,
        });

        came_from[nString] = current;
      }
    });
  }

  let current = goal;
  const path: Point[] = [];

  while (current.key() != start.key()) {
    path.push(current);
    current = came_from[current.key()];

    if(!current) {
      console.log("No complete path could be found for the given starting and ending points.")
      return;
    }
  }

  for (let i = 0; i < path.length; i++) {
    const current = path[i];
    grid[current.y][current.x] = '\x1b[34mX\x1b[0m';
  }

  grid[start.y][start.x] = '\x1b[32mS\x1b[0m';
  grid[goal.y][goal.x] = '\x1b[31mE\x1b[0m';

  printGrid();
}

function calculateNeighbors(point: Point) {
  const neighbors = neighborOffsets
    .map((offset) => new Point(point.x + offset[0], point.y + offset[1]))
    .filter((point) => isValid(point));

  // Not "strictly" necessary, but makes the path look like the visual on the website
  if ((point.x + point.y) % 2 == 0) neighbors.reverse();

  return neighbors;
}

function isValid(point: Point) {
  const { x, y } = point;
  return (
    x >= 0 &&
    y >= 0 &&
    y < grid.length &&
    x < grid[0].length &&
    grid[y][x] === 0
  );
}

function heuristic(goal: Point, next: Point) {
  return Math.abs(goal.x - next.x) + Math.abs(goal.y - next.y);
}

function printGrid(): void {
  grid.forEach((row) => {
    console.log(row.join(' '));
  });
}

run();