

function Game()
{

}




Game.Init=function()
{
    Game.loaded=false;
    Game.requirements=[];
    Game.requirements.push(Tile,Chunk);
    Game.oncomplete=function()
    {
	UpdateShaderResolutions(Game.Canvas);

	
	var temp=new Chunk(0,0);
	var tile=new Tile();
	Tile.Type=0;
	for(var i=0;i<8;i++)
	{
	    for(var j=0;j<8;j++)
	    {
		temp.AlterTile(i,j,tile);
	    }
	}
	temp.DrawImage();
	Game.loaded=true;
	UpdateResources();
    }
    AddResource(Game);
}
