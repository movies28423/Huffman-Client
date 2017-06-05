/**********************************************************************
 * 
 * Implementation of Huffman Algorithm
 *
 */

var PriorityQueue = require('/Users/stephanie/Huffman/PriorityQueue.js').PriorityQueue;
var fs = require('fs');
var Node = require('/Users/stephanie/Huffman/Node.js').Node;
var BitOperatorHelper = require('/Users/stephanie/Huffman/BitOperatorHelper.js').BitOperatorHelper;

var Huffman = function(message) {

    //private fields

    let charNodeMap = {};

    let forest = new PriorityQueue();

    let tree = {};

    let internalNodeCount = 0;

    let headerBits = 0;

    let dataBits = 0;

    let encodedCharMap = {};

    let incomingDecodedCharMap = {};

    let encodedTree = null;

    //private methods

    let buildCharMap = function() {

        for(var i = 0; i < message.length; i++){

            let c = message[i];

            if (charNodeMap[c] == undefined) {
                charNodeMap[c] = new Node(c, 1, null, null);
            } else {
                charNodeMap[c].updateCount();
            }

        }

    };

    let buildForest = function(){

        for (let c in charNodeMap) {
          forest.queue(charNodeMap[c]);
        }

    };

    let buildTree = function(){

        //check for length greater than 1 (actually two because index at 0 is not a part of the forest)
        while (forest.length() > 1) {

            let node1 = forest.dequeue();
            let node2 = forest.dequeue();

            let combinedNode = new Node('\0', node1.count + node2.count, node1, node2);
            internalNodeCount++;
            forest.queue(combinedNode);

        }

        tree = forest.dequeue();

    };

    let buildEncodedCharMapRecursive = function(root, code){

        if (root == null) {
            return;
        }

        if (root.ch != '\0') {
            encodedCharMap[root.ch] = code;
            dataBits += (root.count * code.length);
            headerBits += 8;
            return;
        }

        buildEncodedCharMapRecursive(root.left, code + "0");
        buildEncodedCharMapRecursive(root.right, code + "1");

    };

    let buildEncodedCharMap = function(){

        headerBits = internalNodeCount;
        buildEncodedCharMapRecursive(tree, "");

        let sizeOfBuffer = Math.ceil((headerBits + dataBits)/BitOperatorHelper.constants.BITS_IN_BYTES) + 1;
        encodedTree = Buffer.alloc(sizeOfBuffer);

    };

    return {

        //public methods
        buildEncodedData : function(){

            buildCharMap();
            buildForest();
            buildTree();
            buildEncodedCharMap();  

            //public fields
            this.tree = tree;  
            this.headerBits = headerBits;
            this.dataBits = dataBits;
            this.encodedCharMap = encodedCharMap; 
            this.encodedTree = encodedTree;    
        }
  };

};

module.exports = {
  'Huffman': Huffman
};
