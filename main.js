
const FPS=60;

function init()
{
    Game.Canvas3D=document.getElementById("background");
    Game.Canvas2D=document.getElementById("UI");
    Game.Context2D=Game.Canvas2D.getContext("2d");
    LoadingUI.Context=Game.Context2D;
    Game.WebGLContext=InitWebGL(Game.Canvas3D);
    Game.VAOExtension=Game.WebGLContext.getExtension("OES_vertex_array_object");
    Game.FragmentShader=LoadingUI.AddScript("default.fs.glsl");
    Game.FragmentShader.Percent=0;
    Game.FragmentShader.Name="Game.FragmentShader";

    Tile.Init();
    Chunk.Init();
    Game.Init();
}



