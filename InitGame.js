'use strict';

var Tiles=[]
var Context;
var NewImage;

function init(){
    var Canvas = document.getElementById("Canvas");
    Context = Canvas.getContext("2d");

    var seed = Math.random()*500;
    var PerlinNoise=OpenSimplex.create(seed);

    for(var x=0;x<64;x++){
	Tiles[x]=[];
	for(var y=0;y<64;y++){
	    var data = Math.floor((PerlinNoise.noise3D(x/16,y/16,0.2)+1)*127);

	    Tiles[x][y] = data;//Context.drawImage(NewImage, x*32, y*32);



	}
    }

	NewImage = LoadImage("Ground.png");
	NewImage.onload=function(){
	    Render();
		//Context.drawImage(NewImage, 32, 32);
	}
}


function LoadImage(path){
	var image=new Image();
    image.src="images/"+path;
    image.Loaded=false;
    image.Percent=0;
    image.Name="Image: "+path;
    image.onload=function(){
		this.Loaded=true;
		this.Percent=100;
		//TODO(Christof): Update Loading UI here?
    }
    return image;

}

function Render(){
    for(var x=0;x<64;x++){
	for(var y=0;y<64;y++){
	    var data = Tiles[x][y];
	    if(data<200){
		Context.drawImage(NewImage, x*32, y*32);
	    }
	    Context.fillStyle="rgb("+data+","+data+","+data+")";
	    Context.fillRect(64*32+x*8,y*8,8,8);
	}
    }

}
