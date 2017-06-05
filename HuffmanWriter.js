/**********************************************************************
 * 
 * Writer Class that implements Huffman Class
 *
 */

let fs = require('fs');
let BitOperatorHelper = require('/Users/stephanie/Huffman/BitOperatorHelper.js').BitOperatorHelper;
let Huffman = require('/Users/stephanie/Huffman/Huffman.js').Huffman;

let HuffmanWriter = function(message, outputFileName){

        //private fields

	    let huffman = new Huffman(message);

	    huffman.buildEncodedData();

	    let bitPosition = 0;

	    let dataBits = huffman.dataBits;

	    let headerBits = huffman.headerBits;

	    let encodedCharMap = huffman.encodedCharMap;

	    let tree = huffman.tree;

	    let encodedTree = huffman.encodedTree;

        //private methods
        
        let writeTreeInternal = function(root){

            let currentByte = Math.floor(bitPosition/BitOperatorHelper.constants.BITS_IN_BYTES);
            let currentBit = bitPosition % BitOperatorHelper.constants.BITS_IN_BYTES;

            if (root.left == null && root.right == null) {

                let mask = BitOperatorHelper.setXthBit(currentBit, 1, 0, true);

                encodedTree[currentByte] |= mask;
                bitPosition++;

                let chAsBinaryRaw = BitOperatorHelper.charToBinary(root.ch);
                let chAsBinary = BitOperatorHelper.padToXthBit(chAsBinaryRaw, BitOperatorHelper.constants.ASCII_CHAR_ENCODING_LENGTH - chAsBinaryRaw.length);
                
                if(chAsBinary.length > BitOperatorHelper.constants.ASCII_CHAR_ENCODING_LENGTH){
                	chAsBinary = chAsBinary.substring(chAsBinary.length - BitOperatorHelper.constants.ASCII_CHAR_ENCODING_LENGTH, chAsBinary.length);
                }

                for (var i = 0; i < BitOperatorHelper.constants.BITS_IN_BYTES_INDEXED_AT_ZERO; i++) {

                    currentByte = Math.floor(bitPosition/BitOperatorHelper.constants.BITS_IN_BYTES);
                    currentBit = bitPosition % BitOperatorHelper.constants.BITS_IN_BYTES;

                    let mask = BitOperatorHelper.setXthBit(currentBit, Number(chAsBinary[i]), 0, true);

                    encodedTree[currentByte] |= mask;
                    bitPosition++;

                } 

                return encodedTree;

            } 

            bitPosition++;

            writeTreeInternal(root.left);
            writeTreeInternal(root.right);

        };

        let writeTree = function(){
            writeTreeInternal(tree);
        };
        
        let writeData = function(){

            let dataBitPosition = headerBits;

            for (let c in message) {

                let encoding = encodedCharMap[message[c]];

                for (let i = 0; i < encoding.length; i++) {

                    currentByte = Math.floor(dataBitPosition/BitOperatorHelper.constants.BITS_IN_BYTES);
                    currentBit = dataBitPosition % BitOperatorHelper.constants.BITS_IN_BYTES;

                    let mask = BitOperatorHelper.setXthBit(currentBit, Number(encoding[i]), 0, true);

                    encodedTree[currentByte] |= mask;

                    dataBitPosition++;

                }

            }
        };
        
        let writeBitsToUseFromLastByte = function(){

            let bitsToUseInLastByte = ((headerBits + dataBits) % BitOperatorHelper.constants.BITS_IN_BYTES)
                                          .toString(BitOperatorHelper.constants.BINARY_RADIX);

            let footerBitPosition = 0;

            if((headerBits + dataBits) % BitOperatorHelper.constants.BITS_IN_BYTES){

            	footerBitPosition = headerBits + dataBits - ((headerBits + dataBits) % BitOperatorHelper.constants.BITS_IN_BYTES) +
            	    (BitOperatorHelper.constants.BITS_IN_BYTES * 2) -
            	    bitsToUseInLastByte.length;

            } else {

            	footerBitPosition = (headerBits + dataBits)/BitOperatorHelper.constants.BITS_IN_BYTES +
            	    BitOperatorHelper.constants.BITS_IN_BYTES -
            	    bitsToUseInLastByte.length;  

            } 

            for (let i = 0; i < bitsToUseInLastByte.length; i++) {

                currentByte = Math.floor(footerBitPosition/BitOperatorHelper.constants.BITS_IN_BYTES);
                currentBit = footerBitPosition % BitOperatorHelper.constants.BITS_IN_BYTES;

                let mask = BitOperatorHelper.setXthBit(currentBit, Number(bitsToUseInLastByte[i]), 0, true);
               
                encodedTree[currentByte] |= mask;

                footerBitPosition++;

            }

        }

    return {

        //public methods
        
        writeToZip : function() {
            
        	writeTree();

        	writeData();

        	writeBitsToUseFromLastByte();

        	try {
        		fs.writeFileSync(outputFileName, encodedTree);
        	} catch (e){
        		console.log(e + "");
        	}
        }
    
    };

};

module.exports = {
  'HuffmanWriter': HuffmanWriter
};