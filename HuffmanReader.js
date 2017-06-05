/**********************************************************************
 * 
 * Reader Class that implements Huffman Class
 *
 */

let Node = require('/Users/stephanie/Huffman/Node.js').Node;
let BitOperatorHelper = require('/Users/stephanie/Huffman/BitOperatorHelper.js').BitOperatorHelper;
let Huffman = require('/Users/stephanie/Huffman/Huffman.js').Huffman;

let HuffmanReader = function(bitStream){

    //private fields

	let incomingTree = null;

	let incomingDecodedCharMap = {};

	let incomingEncodedCharMap = {};

	let decodedMessage = [];

	let bitsReadIn = 0;

	let exceededMaximumCallStackSize = false;

    //private methods
	let readTree = function(bitStream){

		let isLeaf = bitStream.current() == '1';

		if (isLeaf) {

		    let ch = bitStream.readBitsToCharCode();
		    bitStream.next();

		    return new Node(ch, -1, null, null);

		}

		bitStream.next();

		let node = new Node('\0', -1, null, null);

		if (incomingTree == null) {
		    incomingTree = node;
		}

		node.left = readTree(bitStream);
		node.right = readTree(bitStream);

		return node;

	};

    let buildDecodedCharMap = function(node, encoding){

		if(node == null){
			return;
		}

 		let isLeaf = node.right == null && node.left == null;

		if (isLeaf) {

		    let ch = node.ch;
            incomingDecodedCharMap[encoding] = ch;
            incomingEncodedCharMap[ch] = encoding;
            return;
		}

		buildDecodedCharMap(node.left, encoding + "0");
		buildDecodedCharMap(node.right, encoding + "1");

	};

	let decodeMessage = function() {

		var prefix = "";

		while(!bitStream.inLastByte()){

	        let currentBit = bitStream.current();

	        let currentPrefix = prefix + currentBit.toString();

	        if (typeof incomingDecodedCharMap[currentPrefix] != 'undefined'){

	        	bitsReadIn += currentPrefix.length;

	        	decodedMessage.push(incomingDecodedCharMap[currentPrefix]);
	        	currentPrefix = "";

	        }

	        prefix = currentPrefix;
	        bitStream.next();

		}

		let bitsToRemoveFromMessage = BitOperatorHelper.constants.BITS_IN_BYTES - 
                                          bitStream.getBitsToReadInLastByteCount() - 
                                          prefix.length;

        let correctBitsToReadIn = bitsReadIn - bitsToRemoveFromMessage;

        let actualBitsReadIn = bitsReadIn;

        while(actualBitsReadIn > correctBitsToReadIn){

        	let chToRemove = decodedMessage.pop();
        	actualBitsReadIn -= incomingEncodedCharMap[chToRemove].length;

        }

		return;

	};

    return {

        //public methods

	    getDecodedMessage : function(){

			readTree(bitStream);
			buildDecodedCharMap(incomingTree, "");
		    
		    decodeMessage("");

		    return decodedMessage.join("");

		}

	}

}

module.exports = {
  'HuffmanReader': HuffmanReader
};