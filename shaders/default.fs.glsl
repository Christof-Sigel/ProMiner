precision mediump float;

uniform sampler2D u_image;

varying vec2 v_texCoord;

void main()
{
    if(v_texCoord.x==-1.0 && v_texCoord.y==-1.0)
	gl_FragColor = vec4(0,0,0,0);
    else
	gl_FragColor = texture2D(u_image, v_texCoord);
}
