const _ = require('lodash');
const util = require('util')

const input = [1, 1, 2, 5, 7, 8, 12, 14, 20, 25, 26, 26, 28, 45];
const target = 45;



function findOptions(input, result, target) {
    console.log(input, result, target);
    // if (input == null || result == null) {
    //     return null;
    // }
    return input.map((value, index) => {
        const newResult = _.clone(result)
        newResult.push(value);
        const sum = _.sum(newResult);
        // console.log(value, sum, target);
        if (sum == target) {
            return newResult;
        } else if (sum < target) {
            const newArray = _.clone(input);
            newArray.splice(index, 1);
            return findOptions(
                newArray,
                newResult,
                target - value);
        } else if (sum > target) {
            return null;
        }
    })



}


console.log(util.inspect(findOptions([2, 3, 4, 13, 22, 43,], [], 45)));

// input = [1, 1, 2, 5, 7, 8, 12, 14, 20, 25, 26, 26, 28, 45];
// result = []
// target = 45;


// input = [2, 5, 7, 8, 12, 14, 20, 25, 26, 26, 28, 45];
// result = [1, 1]
// target = 43;


// input = [1, 1, 5, 7, 8, 12, 14, 20, 25, 26, 26, 28, 45];
// result = [2]
// target = 43;

// 2^n

