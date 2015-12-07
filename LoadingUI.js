"use strict";

var LoadingUI={Resources:[]};

LoadingUI.AddResource=function(resource)
{
    if(resource.Requirements===undefined)
    {
		resource.Requirements=[];
    }
    resource.Dependants=[];
    for(var index=0;index<this.Resources.length;index++)
    {
		if(this.Resources[index].Requirements.indexOf(resource)!=-1)
		{
			resource.Dependants.push(this.Resources[index]);
		}
		if(resource.Requirements.indexOf(this.Resources[index])!=-1)
		{
			this.Resources[index].Dependants.push(resource);
		}
    }
    resource.CheckDone=ResourceCheckDone;
    resource.UpdatePercent=ResourceUpdatePercent;
    this.Resources.push(resource);
    this.UpdateResource(resource);
    return resource;
}

LoadingUI.UpdateResource=function(resource,rerender)
{
    if(rerender===undefined)
		rerender=true;
    var updates=[];
    for(var index=0;index<resource.Dependants.length;index++)
    {
		var dep=resource.Dependants[index];
		if(resource.Loaded)
		{
			resource.Percent=100;
			if(dep.CheckDone())
			{
				if(dep.oncomplete && !dep.Loaded)
					dep.oncomplete();
				dep.Loaded=true;

			}
		}
		updates.push(dep);
		dep.UpdatePercent();

    }
    for(var i=0;i<updates.length;i++)
    {
		LoadingUI.UpdateResource(updates[i],false);
    }
    if(rerender)
		this.Render();
}


function ResourceCheckDone()
{
    for(var index=0;index<this.Requirements.length;index++)
    {
		if(!this.Requirements[index].Loaded)
			return false;
    }
    return true;
}

function ResourceUpdatePercent()
{
    var totalPercent=0;
    for(var index=0;index<this.Requirements.length;index++)
    {
		totalPercent+=this.Requirements[index].Percent;
    }
    this.Percent=totalPercent/this.Requirements.length;
}


LoadingUI.AddImage=function(path)
{
    var image=new Image();
    image.src="images/"+path;
    image.Loaded=false;
    image.Percent=0;
    image.Name="Image: "+path;
    image.onload=function()
    {
		this.Loaded=true;
		this.Percent=100;
		LoadingUI.UpdateResource(this);
    }
    LoadingUI.AddResource(image);
    return image;
}

LoadingUI.AddScript=function(path)
{
    path="shaders/"+path;
    var script={};
    script.Loaded=false;
    script.path=path;
    script.Name="Script: "+path;
    script.Percent=0;
    var request=new XMLHttpRequest();
    request.onprogress=function(event)
    {
		if(event.lengthComputable)
		{
			script.Percent=(event.loaded / event.total)*100;
			LoadingUI.UpdateResource(script);
		}
    };

    request.open('GET',path,true);

    request.onreadystatechange=function()
    {
		if (request.readyState == 4) {
            // If we got HTTP status 200 (OK)
            if (request.status == 200) {
                script.Loaded=true;
				script.data=request.responseText;
				LoadingUI.UpdateResource(script);
            } else { // Failed
				console.log("Failed to load script"+path);
            }
        }
    };
    request.send(null);
    LoadingUI.AddResource(script);
    return script;
}

LoadingUI.Render=function()
{
    this.Context.setTransform(1, 0, 0, 1, 0, 0);
    this.Context.clearRect(0,0,Game.Canvas2D.width,Game.Canvas2D.height);
    var TopLevel=this.Resources.filter(function(i){return i.Dependants.length==0;});
    var y=0;
    for(var i=0;i<TopLevel.length;i++)
    {
		this.RenderItem(0,TopLevel[i],y);
    }
}

LoadingUI.Loaded=function()
{
    var TopLevel=this.Resources.filter(function(i){return i.Dependants.length==0;});
    var y=0;
    for(var i=0;i<TopLevel.length;i++)
    {
		if(!TopLevel[i].Loaded)
			return false;
    }
    return true;
}

LoadingUI.RenderItem=function(level,item,y)
{
    this.DrawItem(item.Percent,level*this.XOffset+10,y,item.Name);
    y=y+this.ItemHeight;
    var initialy=y;
    if(item.Percent==100)
		return y;
    var finaly=y;
    for(var i=0;i<item.Requirements.length;i++)
    {
		finaly=y;
		y=this.RenderItem(level+1,item.Requirements[i],y);
    }
    if(finaly>initialy)
    {
		initialy-=this.ItemHeight*0.1;
		finaly+=this.ItemHeight*0.5;
		var x=(level+0.5)*this.XOffset+10;
		this.RenderLine({x:x,y:initialy},{x:x,y:finaly});
    }

    return y;
}

LoadingUI.DrawItem=function(Percent,x,y,Name)
{
    var beg={x:x,y:y+0.1*this.ItemHeight};
    if(y>0)
    {
		//this.RenderLine({x:x-0.5*this.XOffset,y:y-0.5*this.ItemHeight},{x:x-0.5*this.XOffset,y:y+0.5*this.ItemHeight});
		this.RenderLine({x:x-0.5*this.XOffset,y:y+0.5*this.ItemHeight},{x:x,y:y+0.5*this.ItemHeight});
    }

    this.RenderRect(beg,{x:x+this.ItemWidth,y:y+0.9*this.ItemHeight},Red);
    this.RenderRect(beg,{x:x+Percent/100*this.ItemWidth,y:y+0.9*this.ItemHeight},Green);
    this.RenderText({x:x,y:y+this.ItemHeight*0.5},Percent.toFixed(2)+"%: "+Name,Black);
}

LoadingUI.RenderLine=function(beg,end,color)
{
    if(color===undefined)
		color=Black;
    this.Context.strokeStyle=color.ToRGBString();
    this.Context.beginPath();
    this.Context.moveTo(beg.x,beg.y);
    this.Context.lineTo(end.x,end.y);
    this.Context.closePath();
    this.Context.stroke();
}


LoadingUI.RenderRect=function(beg,end,color)
{
    if(color===undefined)
		color=Black;
    this.Context.fillStyle=color.ToRGBString();
    this.Context.fillRect(beg.x,beg.y,end.x-beg.x,end.y-beg.y);
}

LoadingUI.RenderText=function(beg,text,color)
{
    if(color===undefined)
		color=Black;
    this.Context.fillStyle=color.ToRGBString();
    this.Context.fillText(text,beg.x,beg.y);
}

function Color(Red,Green,Blue)
{
    this.Red=Red;
    this.Green=Green;
    this.Blue=Blue;
}

Color.prototype.ToRGBString=function()
{
    return "rgb("+Math.floor(this.Red*255)+","+Math.floor(this.Green*255)+","+Math.floor(this.Blue*255)+")";
}


LoadingUI.ItemHeight=50;
LoadingUI.ItemWidth=400;
LoadingUI.XOffset=30;
var Red=new Color(255,0,0);
var Green=new Color(0,255,0);
var Black=new Color(0,0,0);


LoadingUI.DebugInfo=function()
{
    console.log(this.Loaded()+" : ");
    var TopLevel=this.Resources.filter(function(i){return i.Dependants.length==0;});
    var y=0;
    for(tpi in TopLevel)
    {
		this.DebugItem(0,TopLevel[tpi]);
    }
}

LoadingUI.DebugItem=function(level,item)
{
    var output="";
    for(var i=0;i<level;i++)
    {
		output+="-";
    }
    console.log(output+item.Percent+"% : "+item.Name);
    if(item.Percent>=100)
		return;
    for(var i in item.Requirements)
    {
		this.DebugItem(level+1,item.Requirements[i]);
    }
}
