/**********************************************************************
 * 
 * Priority Queue - Wrapper around Heap class
 *
 */

let Heap = require('/Users/stephanie/Huffman/Heap.js').Heap;

let PriorityQueue = function(){

    //private fields

	let internalQueue = new Heap();

	return {

		//public methods

		queue : function(node) {
		  internalQueue.insertNode(node);
		},

		dequeue : function() {
		  return internalQueue.removeMin();
		},

		length : function() {
		  return internalQueue.length;
	    }

	}

};

module.exports = {
	'PriorityQueue': PriorityQueue
};