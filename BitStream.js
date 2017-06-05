/**********************************************************************
 * 
 * Tracks and allows for manipulating of specific Bits
 *
 */

let BitOperatorHelper = require('/Users/stephanie/Huffman/BitOperatorHelper.js').BitOperatorHelper;
let BufferStream = require('/Users/stephanie/Huffman/BufferStream.js').BufferStream;

let BitStream = function(buffer) {

    //private fields

    let bufferStream = new BufferStream(buffer);

    let currentByte = bufferStream.next();

    let bitPositionInByte = 0;

    return {

        //public methods

        current : function(){

            let byteAsString = bufferStream.current().toString(BitOperatorHelper.constants.BINARY_RADIX);
            let paddedByteString = BitOperatorHelper.padToXthBit(byteAsString, BitOperatorHelper.constants.BITS_IN_BYTES - byteAsString.length);

            return paddedByteString[bitPositionInByte];
             
        },

        next : function() {

            if (bitPositionInByte == BitOperatorHelper.constants.BITS_IN_BYTES_INDEXED_AT_ZERO) {
                currentByte = bufferStream.next();
                bitPositionInByte = 0;
            } else {
                bitPositionInByte++;
            }

            let byteAsString = currentByte.toString(BitOperatorHelper.constants.BINARY_RADIX);
            let paddedByteString = BitOperatorHelper.padToXthBit(byteAsString, BitOperatorHelper.constants.BITS_IN_BYTES - byteAsString.length);

            let bitAsString = paddedByteString[bitPositionInByte];

            return bitAsString;
        },

        readBitsToCharCode : function() {

            let bitList = [];

            for (let i = 0; i < BitOperatorHelper.constants.ASCII_CHAR_ENCODING_LENGTH; i++) {

                let next = this.next();
                bitList.push(next + "");

            }

            return String.fromCharCode(parseInt(bitList.join(""), BitOperatorHelper.constants.BINARY_RADIX));

        },

        inLastByte : function(){
            return bufferStream.peek() == null;
        },

        getBitsToReadInLastByteCount : function(){
            return Number(bufferStream.current());
        }       

    }

}

module.exports = {
  'BitStream': BitStream
};