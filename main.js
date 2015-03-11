var canvas, c;
var world;
var keys = [];
//0,1= x,y; 2-4= mouse clicks; 5 mouse wheel
var mouse = [];
var mousew = [];
var mode = "game";
var player;
var camera;

window.onload = function () {
    canvas = document.createElement("canvas");
    c = canvas.getContext("2d");
    
    canvas.width = window.innerWidth - 12;
    canvas.height = window.innerHeight - 12;

    document.body.appendChild(canvas);

    world = new World();
    player = new Player();
    camera = new Camera();

    genWorld();

    addListners();

    var down = false;
	var i = 0;
    setInterval(function () {
        if(keys[69]){
        	if(!down){
        		mode = mode == "game" ? "shop" : "game";
        		down = true;
        	}
        }
        else down = false;

        if(mode == "shop"){
        	c.fillStyle = "black";
        	c.fillRect(0, 0, canvas.width, canvas.height);  
        }

        else if(mode == "game"){  
        	camera.setPos(player.posx - (canvas.width / 2), player.posy - (canvas.height / 2));
        	camera.update();

        	mouse[0] = mousew[0] + camera.x;
        	mouse[1] = mousew[1] + camera.y;

        	world.update(); 
        	player.update();   
    	}
        mouse[5] = 0;
    }, 30);

}

var genWorld = function(){
    var perlin1D = new Perlin1D(500);
    var perlin2D = new Perlin2D(500);

    for(var i = 0; i < 2000; i += 16){
        var start = 400 + perlin1D.perlin(i) * 16;
    	for(var j = start; j < 1000; j += 16){
    		new Tile(i, j, j == start ? "grass" : "dirt");
    	}
    }

    for(var i = 0; i < 2000; i+= 16){
        for(var j = 0; j < 1000; j += 16){
            var tile = world.getTile(i, j);
            if(tile instanceof Tile && tile.type == "dirt" && perlin2D.perlin(i, j) > 45){
                new Tile(i, j, "gold");
            }
        }
    }
}

var addListners = function(){
    document.addEventListener("keydown", function (e) {
        keys[e.keyCode] = true;
    });

    document.addEventListener("keyup", function (e) {
        delete keys[e.keyCode];
    });

    mouse[0] = mouse[1] = 0;

    document.addEventListener("mousemove", function (e){
        mousew[0] = e.clientX;
        mousew[1] = e.clientY;
    });

    for(var i = 2; i <= 4; i++){
        mouse[i] = false;
    }

    document.addEventListener("mousedown", function (e) {
        mouse[e.button + 2] = true;
    });

    document.addEventListener("mouseup", function (e){
        mouse[e.button + 2] = false;
    });

    mouse[5] = 0;

    document.addEventListener("mousewheel", function (e){
        mouse[5] = e.deltaY / 100;
    });

    document.addEventListener('contextmenu', function (e){
        e.preventDefault();
    });

	window.onresize = function(){
		canvas.width = window.innerWidth - 4;
		canvas.height = window.innerHeight - 4;
		c.translate(-camera.x, -camera.y)
	}
}
