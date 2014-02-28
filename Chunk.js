
const ChunkSize=8;


function Chunk(x,y)
{
    
    this.Tiles=[];
    this.GenerateTexture();//for when we need to start unloading stuff later when we run into memory limits
    this.Update=true;
    this.X=x;
    this.Y=y;
}

Chunk.prototype.GenerateTexture=function()
{
    var gl=Game.WebGLContext;
    this.Texture=gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D,this.Texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, ChunkSize*TileSize, ChunkSize*TileSize, 0,
      gl.RGBA, gl.UNSIGNED_BYTE, null);

    this.FBO=gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER,this.FBO);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.Texture, 0);

}

Chunk.prototype.AlterTile=function(x,y,NewTileType)
{
    this.Tiles[x+y*ChunkSize]=NewTileType;
    this.Update=true;
}

Chunk.prototype.UpdateImage=function()
{
    var gl=Game.WebGLContext;

    //TODO:
    this.Update=false;
    Tile.SetupRender();
    gl.bindFramebuffer(gl.FRAMEBUFFER,this.FBO);
   
    // Tell webgl the viewport setting needed for framebuffer.
    gl.viewport(0, 0, TileSize*ChunkSize, TileSize*ChunkSize);
    
    for(var i=0;i<ChunkSize;i++)
    {
	for(var j=0;j<ChunkSize;j++)
	{
	    gl.uniform2f(Tile.PositionLocation,i*TileSize,j*TileSize);
	    gl.uniform1f(Tile.TypeLocation,this.Tiles[i+j*ChunkSize].Type);
	    gl.drawArrays(gl.TRIANGLES, 0, 6);
	}
    }
    gl.viewport(0,0, Game.Canvas3D.width, Game.Canvas3D.height);
}

Chunk.prototype.DrawImage=function()
{
    var gl=Game.WebGLContext;
    if(this.Update)
	this.UpdateImage();
    //TODO:
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.useProgram(Chunk.Program);
    
    Game.VAOExtension.bindVertexArrayOES(Chunk.VAO);
    gl.bindTexture(gl.TEXTURE_2D,this.Texture);
        
    gl.uniform2f(Chunk.PositionLocation,this.X*TileSize*ChunkSize,this.Y*TileSize*ChunkSize);
   
    gl.drawArrays(gl.TRIANGLES,0,6);
    Game.VAOExtension.bindVertexArrayOES(null);
}

Chunk.Init=function()
{
    var gl=Game.WebGLContext;
    Chunk.Loaded=false;
    Chunk.Percent=0;
    Chunk.Name="Chunk";
    Chunk.Requirements=[];
    Chunk.Requirements.push(LoadingUI.AddScript("chunk.vs.glsl"),Game.FragmentShader,Tile);
    Chunk.oncomplete=function()
    {
	Chunk.Program=CreateProgram(gl,CreateShader(gl,Chunk.Requirements[0]),CreateShader(gl,Chunk.Requirements[1]));
	Chunk.PositionLocation=gl.getUniformLocation(Chunk.Program,"u_position");
	Chunk.VertexLocation=gl.getAttribLocation(Chunk.Program,"a_vertex");
	Chunk.TexCoordLocation=gl.getAttribLocation(Chunk.Program,"a_texCoord");
	Chunk.ResLocation=gl.getUniformLocation(Chunk.Program,"u_resolution");
	Chunk.ScrollLocation=gl.getUniformLocation(Chunk.Program,"u_scroll");
	AddScrollUpdateLocation(Chunk.Program,Chunk.ScrollLocation);
	AddResolutionUpdateLocation(Chunk.Program,Chunk.ResLocation);
	Chunk.VAO=Game.VAOExtension.createVertexArrayOES();
	Game.VAOExtension.bindVertexArrayOES(Chunk.VAO);
	Chunk.VertexBuffer=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, Chunk.VertexBuffer);
	gl.bufferData(
	    gl.ARRAY_BUFFER,
	    GenerateRectangleArray(ChunkSize*TileSize,ChunkSize*TileSize),
	    gl.STATIC_DRAW);
	gl.enableVertexAttribArray(Chunk.VertexLocation);
	gl.vertexAttribPointer(Chunk.VertexLocation, 2, gl.FLOAT, false, 0, 0);
	Chunk.TexCoordBuffer=gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER,Chunk.TexCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER,GenerateRectangleArray(1,1),gl.STATIC_DRAW);
	gl.enableVertexAttribArray(Chunk.TexCoordLocation);
	gl.vertexAttribPointer(Chunk.TexCoordLocation, 2, gl.FLOAT, false, 0, 0);
	Game.VAOExtension.bindVertexArrayOES(null);
	Chunk.Loaded=true;
	LoadingUI.UpdateResource(this);
    }
    LoadingUI.AddResource(Chunk);
}


