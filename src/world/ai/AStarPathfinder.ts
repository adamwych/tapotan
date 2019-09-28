export interface AStarPathfinderNode {
    parent?: AStarPathfinderNode;
    position?: number[];

    g?: number;
    h?: number;
    f?: number;
}

export default class AStarPathfinder {
    constructor(nodes: Array<AStarPathfinderNode>) {

    }

    public static find(_nodes: Array<number[]>, start: number[], goal: number[], spacing: number = 1) {
        const areNodesEqual = (nodeA: AStarPathfinderNode, nodeB: AStarPathfinderNode) => {
            return nodeA.position[0] === nodeB.position[0] && nodeA.position[1] === nodeB.position[1];
        };

        let openList: Array<AStarPathfinderNode> = [];
        let closedList: Array<AStarPathfinderNode> = [];

        let nodes = _nodes.map(position => ({
            position: position,
            g: 0,
            h: 0,
            f: 0,
        }));

        let startNode: AStarPathfinderNode = {
            position: start,
            g: 0,
            h: 0,
            f: 0
        };

        let endNode: AStarPathfinderNode = {
            position: goal,
            g: 0,
            h: 0,
            f: 0
        };

        openList.push(startNode);

        while (openList.length > 0) {
            let currentNode: AStarPathfinderNode = { f: Infinity };
            let currentNodeIndex: number = 0;

            for (let i = 0; i < openList.length; i++) {
                let node = openList[i];
                if (node.f < currentNode.f) {
                    currentNode = node;
                    currentNodeIndex = i;
                }
            }

            openList.splice(currentNodeIndex, 1);
            closedList.push(currentNode);

            if (areNodesEqual(currentNode, endNode)) {
                let path = [];
                let current = currentNode;

                while (current) {
                    path.push(current.position);
                    current = current.parent;
                }

                return path.reverse();
            }

            let children = [];
            let positions = [
                [0, -spacing], [0, spacing], [-spacing, 0], [spacing, 0], [-spacing, -1], [-spacing, 1], [spacing, -spacing], [spacing, spacing]
            ];

            positions.forEach(childPosition => {
                let nodePosition = [
                    currentNode.position[0] + childPosition[0],
                    currentNode.position[1] + childPosition[1]
                ];

                let nodeFound = false;

                nodes.forEach(node => {
                    if (node.position[0] === nodePosition[0] && node.position[1] === nodePosition[1]) {
                        nodeFound = true;
                    }
                });

                if (!nodeFound) {
                    return;
                }

                let node: AStarPathfinderNode = {
                    parent: currentNode,
                    position: nodePosition,

                    g: 0,
                    h: 0,
                    f: 0
                };

                children.push(node);
            });

            children.forEach(child => {
                if (closedList.includes(child)) {
                    return;
                }

                child.g = currentNode.g + 1;
                child.h = ((child.position[0] - endNode.position[0]) ** 2) + ((child.position[1] - endNode.position[1]) ** 2);
                child.f = child.g + child.h;

                openList.push(child);
            });
        }
    }

}