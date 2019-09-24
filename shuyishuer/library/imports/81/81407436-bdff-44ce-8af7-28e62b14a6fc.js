"use strict";
cc._RF.push(module, '81407Q2vf9Ezor3KOYrFKb8', 'MathExtension');
// scripts/Utils/MathExtension.ts

Math.randomRangeInt = function (min, max) {
    var rand = Math.random();
    if (rand === 1) {
        rand -= Number.EPSILON;
    }
    return min + Math.floor(rand * (max - min));
};
Math.randomRangeFloat = function (min, max) {
    return min + (Math.random() * (max - min));
};
Math.fmod = function (x, y) {
    var temp = Math.floor(x / y);
    return x - temp * y;
};

cc._RF.pop();