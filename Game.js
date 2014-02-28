

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
	UpdateShaderResolutions(Game.Canvas);

	
	var temp=new Chunk(0,0);
	var tile=new Tile();
	tile.Type=0;
	for(var i=0;i<8;i++)
	{
	    for(var j=0;j<8;j++)
	    {
		temp.AlterTile(i,j,tile);
	    }
	}
	temp.DrawImage();
	Game.Loaded=true;
	Game.Percent=100;
	
	LoadingUI.UpdateResource(this);
    }
    LoadingUI.AddResource(Game);
}
