const utils = {
    degreesToRadians: (degrees) => {
        return degrees * Math.PI / 180;
    },

    distanceBetweenPoints: (x1, y1, x2, y2) => {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    },

    lerp: (start, end, t) => {
        return start * (1 - t) + end * t;
    },

    clamp: (value, min, max) => {
        return Math.min(Math.max(value, min), max);
    }
};