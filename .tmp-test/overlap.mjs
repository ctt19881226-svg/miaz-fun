const boxes = [
 {type:'ice',x:715,y:500,w:175,h:24},
 {type:'wood',x:748,y:435,w:26,h:105},
 {type:'wood',x:835,y:435,w:26,h:105},
 {type:'wood',x:791,y:371,w:140,h:24},
 {type:'ice',x:930,y:505,w:120,h:20},
 {type:'wood',x:966,y:447,w:25,h:95},
 {type:'tnt',x:910,y:456,w:48,h:48},
 {type:'fish',x:792,y:330,w:34,h:34},
 {type:'fish',x:948,y:397,w:34,h:34},
 {type:'fish',x:655,y:500,w:34,h:34},
 {type:'seal',x:800,y:470,w:48,h:54},
 {type:'seal',x:972,y:488,w:48,h:54},
];
const snowball = {type:'snowball',x:585,y:505,r:26};

function overlap(a,b){
  const ax1=a.x-a.w/2, ax2=a.x+a.w/2, ay1=a.y-a.h/2, ay2=a.y+a.h/2;
  const bx1=b.x-b.w/2, bx2=b.x+b.w/2, by1=b.y-b.h/2, by2=b.y+b.h/2;
  return ax1<bx2 && ax2>bx1 && ay1<by2 && ay2>by1;
}
for(let i=0;i<boxes.length;i++){
  for(let j=i+1;j<boxes.length;j++){
    if(overlap(boxes[i],boxes[j])){
      console.log('OVERLAP', boxes[i].type+'@'+boxes[i].x+','+boxes[i].y, 'x', boxes[j].type+'@'+boxes[j].x+','+boxes[j].y);
    }
  }
}
// snowball vs boxes (circle vs rect)
for(const b of boxes){
  const cx=Math.max(b.x-b.w/2, Math.min(snowball.x, b.x+b.w/2));
  const cy=Math.max(b.y-b.h/2, Math.min(snowball.y, b.y+b.h/2));
  const d=Math.hypot(snowball.x-cx, snowball.y-cy);
  if(d<snowball.r) console.log('SNOWBALL OVERLAP', b.type+'@'+b.x+','+b.y, 'dist',d.toFixed(1));
}
