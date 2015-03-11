var ImageConverter = function(){

  function projectImgToCanvas(img,cvs,conf){
    var ctx = cvs.getContext('2d'),
        /* set cropping area on image  */
        sx = Number(conf.x) || 0,
        sy = Number(conf.y) || 0,
        sw = Number(conf.w) || img.width,
        sh = Number(conf.h) || img.height,

    /* set project area */ 
    dx = 0,
    dy = 0,
    dw = cvs.width,
    dh = cvs.height;

    ctx.fillStyle = "black"; 

    if(sy < 0){
      var StoDh = dh/sh; 
      dy = sy*StoDh;
      dh += dy;
      sh += sy;
      sy = 0;
      dy *=-1;
      ctx.fillRect(0,0,cvs.width,dy);
    } 

    if(sx < 0){ 
      var StoDw = dw/sw;
      dx = sx*StoDw;
      dw += dx;
      sw += sx;
      sx = 0;
      dx *= -1;
      ctx.fillRect(0,0,dx,cvs.height);
    }

    if(sx + sw > img.width){
      var StoDw = dw/sw;
      sw -= (sx + sw - img.width);
      dw = sw*StoDw;
      ctx.fillRect(dx+dw,0,cvs.width-dx-dw,cvs.height);
    }

    if(sy + sh > img.height){
      var StoDh = dh/sh;
      sh -= (sy + sh - img.height);
      dh = sh*StoDh;
      ctx.fillRect(0,dy+dh,cvs.width,100);
    }
    ctx.drawImage(img,sx,sy,sw,sh,dx,dy,dw,dh);
  }

  return {
    drawImage:projectImgToCanvas,
  };
  }();
