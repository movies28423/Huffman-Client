/**********************************************************************
 * 
 * Heap class - at the moment hard coded to be min heap to support
 * Huffman algorithm and being arranged to work with Node class
 *
 */

let Heap = function() {

    //private fields

    let heap = [null];

    //private methods

    //reorders the Heap so the min count each Node is at the top of the Queue
    let reorderHeap = function(length) {

        let k = 1;

        while (2 * k < length) {

            //compare the current element at k with its left or right child
            //compare left child with right child, if left child is bigger
            //we want to compare the element with its right child
            //left = 2 * k, right = (2 * k) + 1
            let j = 2 * k;
            if (j < length && heap[j].count > heap[j + 1].count) {
                j++;
            } 
            if (heap[k].count <= heap[j].count) {
                break;
            }

            let temp = heap[k];
            heap[k] = heap[j];
            heap[j] = temp;
            k = j;

        }
    };

    return {

        //public fields

        length : 1,

        //public methods

        //inserts the current Node at its proper position in the heap
        //start by pushing the node to the end of heap
        //then compares the count at the length of the heap / 2 (Parent Node)
        //until the count at the Parent Node is less than or equal to the current node
        insertNode : function(node){

            if (heap.length == 1) {
                heap.push(node);
                return;
            }

            heap.push(node);
            this.length++;
            let parentIndex = Math.floor(this.length/2);
            let parent = heap[parentIndex];
            let heapIndex = this.length;

            while (heapIndex > 1) {

                if (node.count < parent.count) {

                    heap[parentIndex] = node;
                    heap[heapIndex] = parent;
                    heapIndex = parentIndex;
                    parentIndex = Math.floor(parentIndex/2);
                    parent = heap[parentIndex];

                } else {
                    break;
                }

            }

        },

        //pops the minimum Node off the heap and 
        //reorders the Heap as neccessary to preserve the min Heap property
        removeMin : function(){

            if (heap.length <= 1) {
                throw "empty";
            }

            if (heap.length <= 2) {
                return heap.pop();
            }

            var min = heap[1];

            //copy the end element so we can pop off the end
            heap[1] = heap[this.length];
            heap.pop();
            this.length--;

            reorderHeap(this.length);

            return min;            

        }

    }

};

module.exports = {
  'Heap': Heap
};