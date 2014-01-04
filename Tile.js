const TileSize=32;

function Tile(type)
{
    this.Type=type;
}


Tile.SetupRender=function()
{
   
    Game.WebGLContext.useProgram(Tile.Program);
    Game.WebGLContext.bindTexture(Game.WebGLContext.TEXTURE_2D,Tile.Texture);
    Game.VAOExtension.bindVertexArrayOES(Tile.VAO);
}

Tile.Init=function()
{
    Tile.loaded=false;
    Tile.requirements=[];
    Tile.requirements.push(LoadScript("tile.vs.glsl"),Game.FragmentShader,LoadImage("TileTexture.png"));
    Tile.oncomplete=function()
    {
	var gl=Game.WebGLContext;
	Tile.Program=CreateProgram(gl,CreateShader(gl,Tile.requirements[0]),CreateShader(gl,Tile.requirements[1]));
	Tile.ResLocation=gl.getUniformLocation(Tile.Program,"u_resolution");
	gl.useProgram(Tile.Program);
	gl.uniform2f(Tile.ResLocation, TileSize*ChunkSize, TileSize*ChunkSize);
	Tile.TypeLocation=gl.getUniformLocation(Tile.Program,"u_type");
	Tile.PositionLocation=gl.getUniformLocation(Tile.Program,"u_position");
	Tile.TexCoordLocation=gl.getAttribLocation(Tile.Program,"a_texCoord");
	Tile.VertexLocation=gl.getAttribLocation(Tile.Program,"a_vertex");


	
	Tile.VAO=Game.VAOExtension.createVertexArrayOES();
	Game.VAOExtension.bindVertexArrayOES(Tile.VAO);

	Tile.Texture=gl.createTexture();
	
	gl.bindTexture(gl.TEXTURE_2D, Tile.Texture);

	// Set the parameters so we can render any size image.
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, Tile.requirements[2]);

	Tile.VertexBuffer=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, Tile.VertexBuffer);

	gl.bufferData(
	    gl.ARRAY_BUFFER,
	    GenerateRectangleArray(TileSize,TileSize),
	    gl.STATIC_DRAW);
	gl.enableVertexAttribArray(Tile.VertexLocation);
	gl.vertexAttribPointer(Tile.VertexLocation, 2, gl.FLOAT, false, 0, 0);
	Tile.TexCoordBuffer=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,Tile.TexCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,GenerateRectangleArray(1,1),gl.STATIC_DRAW);
	gl.enableVertexAttribArray(Tile.TexCoordLocation);
	gl.vertexAttribPointer(Tile.TexCoordLocation, 2, gl.FLOAT, false, 0, 0);
	Game.VAOExtension.bindVertexArrayOES(null);

	
	Tile.loaded=true;
	UpdateResources();
    }
    AddResource(Tile);
}
