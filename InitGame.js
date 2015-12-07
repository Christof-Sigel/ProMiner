'use strict';


function init(){
	var Canvas = document.getElementById("Canvas");
	var Context = Canvas.getContext("2d");

	var seed = Math.random()*500;
	var PerlinNoise=OpenSimplex.create(seed);

	var NewImage = LoadImage("Ground.png");
	NewImage.onload=function(){
		for(var x=0;x<64;x++){
			for(var y=0;y<64;y++){
				var data = Math.floor((PerlinNoise.noise2D(x/16,y/16)+1)*127);
				if(data < 200){
					Context.drawImage(NewImage, x*32, y*32);
				}
				if(data<0)
					console.log(data);
				if(data>256)
					console.log(data);
				Context.fillStyle="rgb("+data+","+data+","+data+")";
				Context.fillRect(64*32+x*8,y*8,8,8);
			}
		}
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
