function Tile(x, y, type){
    this.posx = Math.floor(x / 16) * 16;
    this.posy = Math.floor(y / 16) * 16;
    this.width = 16;
    this.height = 16;
    this.type = type;
    this.dead = false;
    this.duration = 400;
    this.imageLoc = document.getElementById(this.type);

    world.addTile(this);

    this.update = function(){
        if(this.dead){
            world.deleteTile(this.posx, this.posy);
        } 
        c.drawImage(this.imageLoc, this.posx, this.posy);
    }

    this.damage = function(amount){
        this.duration -= amount;
        this.dead = this.duration < 0;
    }

    this.kill = function(){
        this.dead = true;
        world.deleteTile(this.posx, this.posy);
    }
}

function Selected(){
	this.visible = false;
	this.posx = 0;
	this.posy = 0;
    this.tile;
	this.imageLoc = document.getElementById("selcted4");

	this.update = function(){
        this.tile = world.getTile(this.posx, this.posy);
        if(this.tile instanceof Tile && this.tile.duration > 0) this.imageLoc = document.getElementById("selcted" + (Math.floor((this.tile.duration - 1) / 100) + 1));
        else this.imageLoc = document.getElementById("selcted4");
        if(this.visible){
            c.drawImage(this.imageLoc, this.posx, this.posy);
        } 
	}
}

function Item(x, y, type){
    this.posx = x
    this.posy = y;
    this.width = 16;
    this.height = 16;
    this.type = type;
    this.amount = 1;
    this.dead = false;
    this.imageLoc = document.getElementById(this.type);

    this.update = function(){
        if(this.amount >= 1){
            c.drawImage(this.imageLoc, this.posx, this.posy, this.width, this.height);
            c.fillStyle = "white";
            c.font = (this.width - 4) + "px serif";
            c.fillText(this.amount + "", this.posx + (this.width - 6), this.posy + this.height + 4);
        }else{
            this.dead = true;
        }
    }

    this.add = function(n){
        this.amount += n;
    }

    this.setPos = function(x, y){
        this.posx = x;
        this.posy = y;
    }

    this.big = function(){
        if(this.width == 16){
            this.posx += 2;
            this.posy += 2;
        }
        this.width = 20;
        this.height = 20;
    }

    this.defualt = function(){
        if(this.width == 20){
            this.posx -= 2;
            this.posy -= 2;
        }
        this.width = 16;
        this.height = 16;
    }
}