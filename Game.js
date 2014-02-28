

function Game()
{

}




Game.Init=function()
{
    Game.Loaded=false;
    Game.Requirements=[];
    Game.Requirements.push(Tile,Chunk);
    Game.Name="Game";
    Game.Percent=0;
    Game.oncomplete=function()
    {
	UpdateShaderResolutions(Game.Canvas3D);
	UpdateShaderScroll(0,-ChunkSize*TileSize*0);
	Prng.seed = Math.random()*500;
	Game.PerlinNoise=PerlinSimplex;
	Game.PerlinNoise.setRng(Prng);
	Game.PerlinNoise.noiseDetail(2,.5);

	
	Game.tiles=[];
	for(var i=-1;i<64;i++)
	{
	    Game.tiles[i]=new Tile();
	    Game.tiles[i].Type=i;
	    if(i==-1)
		Game.tiles[i].Density=-20;
	    else if(i==0)
		Game.tiles[i].Density=0.5;
	    else
		Game.tiles[i].Density=Game.tiles[i-1].Density+0.25*((i+1)/i);
	}
	Game.tiles[-1].Density=-20;
	Game.tiles[0].Density=0.75;
	Game.tiles[1].Density=0.85;
	Game.tiles[2].Density=1.20;
	Game.tiles[3].Density=1.35;
	
	for(var x=0;x<5;x++)
	{
	    for(var y=2;y>-8;y--)
	    {
		
		var temp=new Chunk(x,y);
		/*for(var i=0;i<ChunkSize;i++)
		{
		    for(var j=0;j<ChunkSize;j++)
		    {
			var rand=Math.floor((Math.random()*4));
			var tile=tiles[rand];
			//temp.AlterTile(i,j,tile);
		    }
		}*/
		//generate height map
		
		
		temp.DrawImage();
	    }
	}
	Game.Loaded=true;
	Game.Percent=100;
	
	LoadingUI.UpdateResource(this);
    }
    LoadingUI.AddResource(Game);
}


Game.Loop=function()
{

}
