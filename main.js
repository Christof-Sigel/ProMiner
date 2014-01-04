

function init()
{
    Game.Canvas=document.getElementById("background");
    Game.WebGLContext=InitWebGL(Game.Canvas);
    Game.VAOExtension=Game.WebGLContext.getExtension("OES_vertex_array_object");
    Game.FragmentShader=LoadScript("default.fs.glsl");
    Tile.Init();
    Game.Init();
    
}



