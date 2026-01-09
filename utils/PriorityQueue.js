class PriorityQueue {
    constructor() {
        this.heap = [];
    }

    push(val) {
        this.heap.push(val);
        this.bubbleUp();
    }

    bubbleUp() {// heappify
        let index = this.heap.length - 1;
        while (index > 0) {
            let parentIdx = Math.floor((index - 1) / 2);// parent
            if (this.heap[parentIdx].count >= this.heap[index].count) break;
            // swap parent with index,
            /*

                this.heap[parentIdx]=this.heap[index];

                this.heap[index]=this.heap[parentIdx];

            */
            [this.heap[parentIdx], this.heap[index]] = [this.heap[index], this.heap[parentIdx]];
            index = parentIdx;
        }
    }

    pop() {
        if (this.size() === 0) return null;
        const top = this.heap[0];
        const last = this.heap.pop();
        if (this.size() > 0) {
            this.heap[0] = last;
            this.bubbleDown();
        }
        return top;
    }

    bubbleDown() {
        let index = 0;
        const length = this.heap.length;
        while (true) {
            let left = 2 * index + 1;
            let right = 2 * index + 2;
            let swap = null;

            if (left < length && this.heap[left].count > this.heap[index].count) swap = left;
            if (right < length && (swap === null ? this.heap[right].count > this.heap[index].count : this.heap[right].count > this.heap[left].count)) swap = right;

            if (swap === null) break; 
            [this.heap[index], this.heap[swap]] = [this.heap[swap], this.heap[index]];
            index = swap;
        }
    }

    size() { return this.heap.length; }
}

module.exports = PriorityQueue;