"use strict"; 

function GenerateRectangleArray(width,height)
{
    return new Float32Array([0,0,
			     0,width,
			     height,0,
			     0,width,
			     height,width,
			     height,0]);
}

if (typeof String.prototype.endsWith !== 'function') {
    String.prototype.endsWith = function(suffix) {
        return this.indexOf(suffix, this.length - suffix.length) !== -1;
    };
}

function CreateProgram(gl,vs,fs)
{
    var program=gl.createProgram();
    gl.attachShader(program,vs);
    gl.attachShader(program,fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    {
	lastError = gl.getProgramInfoLog (program);
	console.log("Error in program linking:" + lastError);
	
	gl.deleteProgram(program);
	return null;
    }
    return program;
}

var ResolutionUpdateLocations=[];

function AddResolutionUpdateLocation(Program,Location)
{
    ResolutionUpdateLocations.push({Program:Program,Location:Location});
}

function UpdateShaderResolutions(canvas)
{
    for(var i=0;i<ResolutionUpdateLocations.length;i++)
    {
	Game.WebGLContext.useProgram(ResolutionUpdateLocations[i].Program);
	Game.WebGLContext.uniform2f(ResolutionUpdateLocations[i].Location,canvas.width,canvas.height);
    }
}

var ScrollUpdateLocations=[];

function AddScrollUpdateLocation(Program,Location)
{
    ScrollUpdateLocations.push({Program:Program,Location:Location});
}

function UpdateShaderScroll(scrollX,scrollY)
{
    for(var i=0;i<ScrollUpdateLocations.length;i++)
    {
	Game.WebGLContext.useProgram(ScrollUpdateLocations[i].Program);
	Game.WebGLContext.uniform2f(ScrollUpdateLocations[i].Location,scrollX,scrollY);
    }
}

// function CreateShader(gl,id)
// {
//     var shaderScript, theSource, currentChild, shader;
    
//     shaderScript = document.getElementById(id);
    
//     if (!shaderScript) {
// 	return null;
//     }
    
//     theSource = "";
//     currentChild = shaderScript.firstChild;
    
//     while(currentChild) {
// 	if (currentChild.nodeType == currentChild.TEXT_NODE) {
// 	    theSource += currentChild.textContent;
// 	}
	
// 	currentChild = currentChild.nextSibling;
//     }
//     if (shaderScript.type == "x-shader/x-fragment") {
// 	shader = gl.createShader(gl.FRAGMENT_SHADER);
//     } else if (shaderScript.type == "x-shader/x-vertex") {
// 	shader = gl.createShader(gl.VERTEX_SHADER);
//     } else {
// 	// Unknown shader type
// 	return null;
//     }
//     gl.shaderSource(shader, theSource);    
//     // Compile the shader program
//     gl.compileShader(shader);  
    
//     // See if it compiled successfully
//     if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
// 	alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader));  
// 	return null;  
//     }
    
//     return shader;
// }

function CreateShader(gl,script)
{
    var shader;
    if(script.path.endsWith(".fs.glsl"))
    {
	shader = gl.createShader(gl.FRAGMENT_SHADER);
    }
    else if(script.path.endsWith(".vs.glsl"))
    {
	shader = gl.createShader(gl.VERTEX_SHADER);
    }
    else
    {
	return null;
    }
    gl.shaderSource(shader,script.data);
    gl.compileShader(shader);  
    
    // See if it compiled successfully
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
	console.log("An error occurred compiling the shader "+script.path+": " + gl.getShaderInfoLog(shader));  
	return null;  
    }
    
    return shader;
}
function InitWebGL(canvas)
{
    var gl = null;
    
    try {
	// Try to grab the standard context. If it fails, fallback to experimental.
	gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }
    catch(e) {}
    
    // If we don't have a GL context, give up now
    if (!gl) {
	alert("Unable to initialize WebGL. Your browser may not support it.");
	gl = null;
    }
    
    return gl;
}

var Resources=[];

function AddResource(resource)
{
    Resources.push(resource);
    UpdateResources();
}

function UpdateResources()
{
    for(var i=0;i<Resources.length;i++)
    {
	if(Resources[i].oncomplete && !Resources[i].loaded)
	{
	    var done=true;
	    for(var j=0;j<Resources[i].requirements.length;j++)
	    {
		if(!Resources[i].requirements[j].loaded)
		{
		    done=false;
		    break;
		}
	    }
	    if(done)
	    {
		Resources[i].oncomplete();
	    }
	}
    }
}

function LoadImage(path)
{
    var image=new Image();
    image.src="images/"+path;
    image.onload=function()
    {
	image.loaded=true;
	UpdateResources();
    }
    AddResource(image);
    return image;
}

function LoadScript(path)
{
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
		UpdateResources();
            } else { // Failed
               console.log("Failed to load script"+path);
            }
        }
    };
    request.send(null);
    AddResource(script);
    return script;
}
		   
// FastRng
if (!this.Prng) {
	var Prng = function() {
		var iMersenne = 2147483647;
		var rnd = function(seed) {
			if (arguments.length) {
				that.seed = arguments[0];
			}
			that.seed = that.seed*16807%iMersenne;
			return that.seed;
		};
		var that = {
			seed: 123,
			rnd: rnd,
			random: function(seed) {
				if (arguments.length) {
					that.seed = arguments[0];
				}
				return rnd()/iMersenne;
			}
		};
		return that;
	}();
}

