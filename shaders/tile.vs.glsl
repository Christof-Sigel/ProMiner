uniform vec2 u_position;
attribute vec2 a_vertex;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;
uniform vec2 u_resolution;
uniform float u_type;

void main()
{
    vec2 zeroToOne = (u_position+a_vertex) / u_resolution;

    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // convert from 0->2 to -1->+1 (clipspace)
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace , 0, 1);
    vec2 a_textCoord=vec2(a_texCoord.x,1.0-a_texCoord.y);
    if(u_type==-1.0)
	v_texCoord=vec2(-1,-1);
    else
	v_texCoord=(a_textCoord+vec2(mod(u_type,8.0),floor(u_type/8.0)))/8.0;
}
