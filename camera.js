function Camera(){
	this.x = 0;
	this.y = 0;

	this.update = function(){
		c.fillStyle = "blue";
    	c.fillRect(this.x, this.y, canvas.width, canvas.height);
	}

	this.translate = function(x, y){
		c.translate(x, y);
		this.x -= x;
		this.y -= y;
	}

	this.setPos = function(x, y){
		c.translate(this.x - x,  this.y - y);
		this.x = x;
		this.y = y;
	}
}