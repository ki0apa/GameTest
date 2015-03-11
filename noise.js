function Perlin1D(spacing){

    //contains random gradients, hash functioned
    this.gradients = [];
    this.numOfGradients = 20;
    this.spacing = spacing;

    this.randomGradient = function(){
        var x = (Math.random() * 2) - 1;
        var y = (Math.random() * 2) - 1;
        var length = Math.sqrt(x * x + y * y);

        x = x / length;
        y = y / length
        return {x: x, y: y};
    }

    for(var i = 0; i < this.numOfGradients; i++) this.gradients[i] = this.randomGradient();

    this.hash = function(x){
        return Math.abs((((x << 1) * 2654435761) >> 12)) % this.numOfGradients;
    }

    this.lerp = function(v1, v2, x){
        var ft = x * Math.PI;
        var f = (1 - Math.cos(ft)) * .5;

        return v1 * (1-f) + v2 * f;
    }

    this.dotGridGradient = function(intx, x){
        var dx = x - intx;

        return (dx * this.gradients[this.hash(intx)].x);
    }

    this.lerpNoise = function(x){
        var x0 = Math.floor(x / this.spacing) * this.spacing;
        x0 = x > 0.0 ? x0 : x0 - 1;
        var x1 = x0 + this.spacing;
        var fractx = (x - x0) / this.spacing;

        var n0 = this.dotGridGradient(x0, x);
        var n1 = this.dotGridGradient(x1, x);

        return this.lerp(n0, n1, fractx);
    }

    this.perlin = function(x) {
        var total = 0;
        var p = 1/ 4;
        var n = 5;

        for(var i = 0; i < n; i++){
            var freq = Math.pow(2, i);
            var amp = Math.pow(p, i) * 0.25;
            total += this.lerpNoise(x * freq) * amp;
        }

        return total / n;
    }

}

function Perlin2D(spacing){
    //contains random gradients, hash functioned
    this.gradients = [];
    this.numOfGradients = 20;
    this.spacing = spacing;

    this.randomGradient = function(){
        var x = (Math.random() * 2) - 1;
        var y = (Math.random() * 2) - 1;
        var length = Math.sqrt(x * x + y * y);

        x = x / length;
        y = y / length
        return {x: x, y: y};
    }

    for(var i = 0; i < this.numOfGradients; i++) this.gradients[i] = this.randomGradient();

    this.hash = function(x){
        return Math.abs((((x << 1) * 2654435761) >> 12)) % this.numOfGradients;
    }

    this.lerp = function(v1, v2, x){
        var ft = x * Math.PI;
        var f = (1 - Math.cos(ft)) * .5;

        return v1 * (1-f) + v2 * f;
    }

    this.dotGridGradient = function(intx, inty, x, y){
        var dx = x - intx;
        var dy = y - inty;

        var grad = this.gradients[this.hash(intx + inty)];

        return (dx * grad.x + dy * grad.y);
    }

    this.lerpNoise = function(x, y){
        var x0 = Math.floor(x / this.spacing) * this.spacing;
        x0 = x > 0.0 ? x0 : x0 - 1;
        var x1 = x0 + this.spacing;
        var fractx = (x - x0) / this.spacing;

        var y0 = Math.floor(y / this.spacing) * this.spacing;
        y0 = y > 0.0 ? y0 : y0 - 1;
        var y1 = y0 + this.spacing;
        var fracty = (y - y0) / this.spacing;

        var n0 = this.dotGridGradient(x0, y0, x, y);
        var n1 = this.dotGridGradient(x1, y0, x, y);
        var ix0 = this.lerp(n0, n1, fractx);
        var n2 = this.dotGridGradient(x0, y1, x, y);
        var n3 = this.dotGridGradient(x1, y1, x, y);
        var ix1 = this.lerp(n2, n3, fractx);

        return this.lerp(ix0, ix1, fracty);
    }

    this.perlin = function(x, y) {
        var total = 0;
        var p = 1/ 4;
        var n = 5;

        for(var i = 0; i < n; i++){
            var freq = Math.pow(2, i);
            var amp = Math.pow(freq, -.8) * 1.1;
            total += this.lerpNoise(x * freq, y * freq) * amp;
        }

        return total / n;
    }

}