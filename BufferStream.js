/**********************************************************************
 * 
 * Wrapper around the JS API Buffer Object
 *
 */

var BufferStream = function(buffer) {

    let position = -1;

    let getByteAtPosition = function(position){

        if(position >= buffer.length){
            return null;
        } else {
            return buffer[position];
        }

    };

    return {

        //public methods

        current : function() {

            return getByteAtPosition(position);

        },

        next : function() {

            position++;
            return getByteAtPosition(position);

        },

        peek : function() {

            nextPosition = position + 1;
            return getByteAtPosition(nextPosition);

        }

    }

}

module.exports = {
  'BufferStream': BufferStream
};