"use strict";

function Map(seed)
{
    this.Seed=seed;
    this.Chunks=[];
    this.TilePool=new TilePool();
}

Map.prototype.GenerateChunk(x,y)
{
    //input x,y is based on chunk number (i.e. they increase by 1, not by ChunkSize)
    this.Chunks[x][y]=new Chunk(x,y);
    
}

Map.prototype.GetChunk(x,y)
{
    if(!this.Chunks[x][y])
    {
	this.GenerateChunk(x,y);
    }
    return this.Chunks[x][y];
}
