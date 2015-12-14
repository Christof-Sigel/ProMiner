'use strict';

var Tiles=[]
var Context;
var Context3d;
var NewImage;
var FShader;
var VShader;

function init(){
    var Canvas = document.getElementById("Canvas");
   // Context = Canvas.getContext("2d");
    Context3d = InitWebGL(Canvas);
    var seed = Math.random()*500;
    var PerlinNoise=OpenSimplex.create(seed);

    for(var x=0;x<64;x++){
	Tiles[x]=[];
	for(var y=0;y<64;y++){
	    var data = Math.floor((PerlinNoise.noise3D(x/16,y/16,0.2)+1)*127);

	    Tiles[x][y] = data;//Context.drawImage(NewImage, x*32, y*32);
	}
    }
    FShader = LoadShader("test.fs.glsl");
    VShader = LoadShader("test.vs.glsl");
	NewImage = LoadImage("Ground.png");
	NewImage.onload=function(){
	    setInterval(Render3d, 500);
		//Context.drawImage(NewImage, 32, 32);
	}
}


function LoadImage(path){
    var image=new Image();
    image.Loaded=false;
    image.Percent=0;
    image.onload=function(){
	this.Loaded=true;
	this.Percent=100;
	//TODO(Christof): Update Loading UI here?
    }
    image.src="images/"+path;
    image.Name="Image: "+path;

    return image;
}

function Render(){
    for(var x=0;x<64;x++){
	for(var y=0;y<64;y++){
	    var data = Tiles[x][y];
	    if(data<100){
		Context.drawImage(NewImage, x*32, y*32);
	    }
	    Context.fillStyle="rgb("+data+","+data+","+data+")";
	    Context.fillRect(64*32+x*8,y*8,8,8);
	}
    }

}

function Render3d(){
    if(FShader.shader !== undefined && VShader.shader !== undefined){

    }
}

function InitWebGL(canvas){
    var gl = null;

    try {
	// Try to grab the standard context. If it fails, fallback to experimental.
	gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }
    catch(e) {
	console.log(e)
    }

    // If we don't have a GL context, give up now
    if (!gl) {
	alert("Unable to initialize WebGL. Your browser may not support it.");
	gl = null;
    }

    return gl;
}

function CreateFragmentShader(Source, gl){
    CreateShader(gl.FRAGMENT_SHADER, Source, gl);
}

function CreateVertexShader(Source, gl){
    CreateShader(gl.VERTEX_SHADER, Source, gl);
}

function CreateShader(Type,Source, gl){
    var shader = gl.createShader(Type);

    gl.shaderSource(shader,Source);
    gl.compileShader(shader);

    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	console.log("An error occurred compiling shader: " + gl.getShaderInfoLog(shader));
	return null;
    }

    return shader;
}



function LoadShader(path){
    path="shaders/"+path;
    var script={};
    script.loaded=false;
    script.path=path;
    var request = new XMLHttpRequest();
    request.open('GET', path, true);

    // Hook the event that gets called as the request progresses
    request.onreadystatechange = function () {
        // If the request is "DONE" (completed or failed)
        if (request.readyState == 4) {
            // If we got HTTP status 200 (OK)
            if (request.status == 200) {
                script.loaded=true;
		script.data=request.responseText;
		var shader;
		if(path.endsWith('.fs.glsl')){
		    shader = CreateFragmentShader(script.data, Context3d);
		}else if(path.endsWith('.vs.glsl')){
		    shader = CreateVertexShader(script.data, Context3d);
		}
		script.shader=shader;
            } else { // Failed
               console.log("Failed to load script"+path);
            }
        }
    };
    request.send(null);
    return script;
}


if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}
