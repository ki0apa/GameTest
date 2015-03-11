function World(){
	this.registries = [];

	this.addTile = function(tile){
		if(this.getRegistry(tile.posx, tile.posy) instanceof TileRegistry){
			this.getRegistry(tile.posx, tile.posy).addTile(tile);
		}else{
			var n = new TileRegistry(tile.posx, tile.posy);
			n.addTile(tile);
			this.registries[this.registries.length - 1] = n;
		}
	}

	this.getTile = function(x, y){
		return this.getRegistry(x, y) instanceof TileRegistry ? this.getRegistry(x, y).getTile(x, y) : null;
	}

	this.deleteTile = function(x, y){
		return this.getRegistry(x, y).deleteTile(x, y);
	}

	this.update = function(){
		for(var i = 0; i < this.registries.length; i++){
			console.log("hello");
			this.registries[i].update();
		}
	}

	this.getRegistry = function(x, y){
		for(var i = 0; i < this.registries.length; i++){
			if(this.registries[i].inBounds(x, y)) return this.registries[i];
		}
		return null;
	}
}

function TileRegistry(x, y){
	this.tiles = [[]];
	this.width = 400;
	this.size = 400;
	this.posx = Math.floor(x / 400) * 400;
	this.posy = Math.floor(y / 400) * 400;

	this.addTile = function(tile){
		console.log(this.inBounds(100, 100) + " " + this.posx + " " + this.posy);
		if(this.inBounds(tile.posx, tile.posy)){
			if(!this.tiles[(tile.posx - this.posx) / 16]){
				this.tiles[(tile.posx - this.posx) / 16] = [];
			}
			this.tiles[(tile.posx - this.posx) / 16][(tile.posy - this.posy) / 16] = tile;
		}
	}

	this.getTile = function(x, y){
		if(this.inBounds(x, y)){
			var posx = Math.floor((x - this.posx) / 16);
			var posy = Math.floor((y - this.posy) / 16);
			if(this.tiles[posx]){
				return this.tiles[posx][posy];
			}
		}
		return null;
	}

	this.deleteTile = function(x, y){
		if(this.inBounds(x, y)){
			var posx = Math.floor((x - this.posx) / 16);
			var posy = Math.floor((y - this.posy) / 16);
			if(this.tiles[posx]){
				var temp = this.tiles[posx][posy];
				delete this.tiles[posx][posy];
				return this.tiles[posx][posy];
			}
		}
		return null;
	}

	this.update = function(){
		for(i in this.tiles){
        	for(j in this.tiles[i]){
        		if(this.tiles[i][j]){
        			this.tiles[i][j].update();
        		} 
        	}
		}
	}

	this.inBounds = function(x, y){
		return x >= this.posx && x <= this.posx + this.width &&
			y >= this.posy && y <= this.posy + this.height;
	}
}