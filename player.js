function Player(){
    this.posx = 1000;
    this.posy = 0;
    this.vx = 0;
    this.vy = 0;
    this.width = 16;
    this.height = 32;
    this.onGround = false;
    this.gravity = 0.7;
    this.jumpPower = 10.0;
    this.walkSpeed = 3.0;
    this.imageLoc = document.getElementById("player");

    this.reach = 100;
    this.inventory = new Inventory();
    this.selected = new Selected();
	this.bounds = {top: false, right:false, bottom: false, left: false};

	this.update = function(){
		this.updateBounds();

        //updates if the player is on ground or not
        this.onGround = this.bounds.bottom;


        //makes player fall
        if (!this.onGround){
        	if(this.vy < 16) this.vy += this.gravity;
        } 

		this.vx = 0;

        //walking right
        if(keys[68]){      
        	if(!this.bounds.right){  
        		this.vx = this.walkSpeed;
        	}
        }

        //walking left
        else if(keys[65]){
        	if(!this.bounds.left){  
        		this.vx = -this.walkSpeed;    
        	}
        }

        //spacebar jump
        if(keys[32] && this.onGround){
        	this.vy = -this.jumpPower;
        }

        //add velocity
        this.posx += this.vx;
        this.posy += this.vy;

		this.updateBounds();

        //checks boudns with items
        if(this.bounds.bottom){
            this.posy = Math.floor(this.posy / 16) * 16;
            this.vy = 0.0;
        }

        //checks bounds with top
       	if(this.bounds.top){
            this.posy = Math.floor(this.posy / 16) * 16 + 16;
       		this.vy *= -0.4;
       	} 

        //draw
        c.drawImage(this.imageLoc, this.posx, this.posy);

        //delete block
        if(mouse[2]){
        	if(this.selected.visible && this.selected.tile instanceof Tile){
                this.selected.tile.damage(10);
                if(this.selected.tile.dead){
                    this.inventory.addTile(this.selected.tile);
                    this.selected.tile.kill();
                }
            } 
        }

        if(mouse[4]){
            if(this.selected.visible && !(this.selected.tile instanceof Tile)){
                var tile = this.inventory.items[this.inventory.tile];
                if(tile instanceof Tile){
                    new Tile(this.selected.posx, this.selected.posy, tile.type);
                    tile.add(-1);
                }
            } 
        }

        //move selctor
        this.selected.posx = Math.floor(mouse[0] / 16) * 16;
        this.selected.posy = Math.floor(mouse[1] / 16) * 16;
        this.selected.visible = this.inReach(this.selected.posx, this.selected.posy) ? true : false;

        //update inventory selected
        this.inventory.selected += mouse[5];

        for(var i = 49; i <= 58; i++){
            if(keys[i]) this.inventory.selected = i - 49;
        }

        this.inventory.update();

        this.selected.update();
	}

    this.inReach = function(x, y){
        var distance = Math.sqrt(Math.pow(this.posx + (this.width / 2) - x, 2) + Math.pow(this.posy + (this.height / 2) - y, 2));
        return distance < this.reach;
    }

	this.updateBounds = function(){
		//Or false gets rid of undifined
		this.bounds.top = world.getTile(this.posx, this.posy) instanceof Tile 
            || world.getTile(this.posx + this.width, this.posy) instanceof Tile;
		this.bounds.right = world.getTile(this.posx + this.width + this.walkSpeed, this.posy + 1) instanceof Tile 
            || world.getTile(this.posx + this.width + this.walkSpeed, this.posy + this.height - 1) instanceof Tile;
		this.bounds.bottom = world.getTile(this.posx + this.width, this.posy + this.height) instanceof Tile 
            || world.getTile(this.posx, this.posy + this.height) instanceof Tile;
		this.bounds.left = world.getTile(this.posx - this.walkSpeed, this.posy + 1) instanceof Tile 
            || world.getTile(this.posx - this.walkSpeed, this.posy + this.height - 1) instanceof Tile;
	}
}

function Inventory(){
    this.numSlots = 9;
    this.items = [];
    this.imageLoc = document.getElementById("slot");
    this.maxStack = 10;
    this.selected = 0;

    this.update = function(){
        //wraps selector
        if(this.selected > 8) this.selected = 0;
        else if(this.selected < 0) this.selected = 8;


        for(var i = 0; i < 9; i++){
            //determines where 
            var x = i <= this.selected ? i * 34: i * 34 + 8;
            x = x + camera.x;

            if(this.selected == i){
                c.drawImage(this.imageLoc, x, camera.y, 40, 40);
            }else{
                c.drawImage(this.imageLoc, x, camera.y);
            }

            //fills number for iventory
            c.fillStyle = "white";
            c.font = "10px serif";
            c.fillText((i + 1) + "", x + 5, camera.y + 10);

            if(this.items[i] instanceof Item){
                //deletes item if there are no blocks left
                if(this.items[i].dead){
                    delete this.items[i];
                }else{
                    //draws items that are less than selected
                    if(i <  this.selected){
                        this.items[i].setPos(camera.x + (i * 34) + 8, camera.y + 8);
                        this.items[i].width = 16;
                        this.items[i].height = 16; 
                    }

                    //draws items that are selected
                    else if(i == this.selected){
                        this.items[i].setPos(camera.x + (i * 34) + 10, camera.y + 10);
                        this.items[i].width = 20;
                        this.items[i].height = 20; 
                    }

                    //draws items that are more than selected
                    else if(i > this.selected){
                        this.items[i].setPos(camera.x + (i * 34) + 16, camera.y + 8);
                        this.items[i].width = 16;
                        this.items[i].height = 16; 
                    }

                    this.items[i].update(); 
                } 
            } 
        }
    }

    this.addTile = function(tile){
        //checks to see if there is already block
        for(var i = 0; i < this.numSlots; i++){
            if(this.items[i] instanceof Item && this.items[i].type == tile.type && this.items[i].amount < this.maxStack){
                this.items[i].add(1);
                return;
            }
        }

        //looks for open slot and adds it
        for(var i = 0; i < this.numSlots + 1; i++){
            if(!(this.items[i] instanceof Item)){
                this.items[i] = new Item((i * 34) + 8, 8, tile.type);
                return;
            }
        }
    }
}