/*
    Image Process - Andrew M
*/

var ImageProcess = function (colors) {
    this.totals;
    this.Stats = {
        Mean: 0,
        SD: 0
    }
    this.Color = colors
};

ImageProcess.prototype.getDataValues = function (dataValues) {
    return this.computeTotals(dataValues)
}

ImageProcess.prototype.squaredError = function (threeColorArray, singleThreeColor) {
    var similarity = 0;
    for (var i = 0; i < 3; i++) {
        similarity += Math.pow(singleThreeColor[i] - threeColorArray[i], 2);
    }
    return similarity;
}

ImageProcess.prototype.squareDiff = function (mean, value) {
    return Math.pow(value - mean, 2);
}

ImageProcess.prototype.meanAndStandardDeviation = function (values) {
    var mean = values.reduce((a, b) => { return a + b }) / values.length;
    var sd = values.reduce((a, b) => { return a + this.squareDiff(mean, b) }, 0);
    this.Stats = { Mean: mean, SD: Math.sqrt(sd / values.length) };
    return this.Stats;
}

ImageProcess.prototype.normalize = function (totals) {
    this.meanAndStandardDeviation(totals);
    return totals.map((x) => {
        return Math.pow(((x - this.Stats.Mean) / this.Stats.SD), 2);
    });
}

ImageProcess.prototype.computeTotals = function (array) {
    var totalCounts = new Array(this.Color.length).fill(1)
    var cost = [];
    let squaredError = null;
    for(var i=0; i<array.data.length; i+=4){
        let min = Number.MAX_VALUE;
        let minIdx = 0;
        this.Color.forEach((color, idx) => {
            squaredError = this.squaredError([array.data[i], array.data[i+1], array.data[i+2]], color);
           if(squaredError < min) {
               min = squaredError
               minIdx = idx
           }
        });
        totalCounts[minIdx] += 1;
    }
    return totalCounts;
}