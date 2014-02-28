uniform vec2 u_position;
attribute vec2 a_vertex;
attribute vec2 a_texCoord;
varying vec2 v_texCoord;
uniform vec2 u_resolution;
uniform vec2 u_scroll;
void main()
{
    vec2 zeroToOne = (u_position+a_vertex-u_scroll) / u_resolution;

    // convert from 0->1 to 0->2
    vec2 zeroToTwo = zeroToOne * 2.0;

    // convert from 0->2 to -1->+1 (clipspace)
    vec2 clipSpace = zeroToTwo - 1.0;
    gl_Position = vec4(clipSpace , 0, 1);
    v_texCoord=a_texCoord;
}
