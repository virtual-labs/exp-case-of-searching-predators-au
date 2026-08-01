let last=null;
function g(id){return +document.getElementById(id).value;}
const chart=()=>document.getElementById('chart');
function build(){
  const hw=g('hw'),hb=g('hb'),ab=g('ab'),s=g('start'),e=g('end');const step=(e-s)/40;
  const y1=[],y2=[],y3=[],y4=[];
  for(let x=s;x<=e+1e-9;x+=step){
    y1.push([+x.toFixed(4),1/x+hw]);
    y2.push([+x.toFixed(4),(1+x*hw+ab*hb)/(x+ab)]);
    y3.push([+x.toFixed(4),(1+x*hw+x*hb)/(2*x)]);
    y4.push([+x.toFixed(4),(1+x*hw+2*x*hb)/(3*x)]);
  }
  return {y1,y2,y3,y4};
}
function run(){
  const d=build();last=d;
  const series=[{color:'#b50246',name:'Only worms',data:d.y1},{color:'#0e7c86',name:'Worms + few beetles',data:d.y2},{color:'#e0662c',name:'Worms + beetles (equal)',data:d.y3},{color:'#3b6fb5',name:'Worms + many beetles',data:d.y4}];
  Chart.draw(chart(),series,{xlabel:'Abundance of worms (per second)',ylabel:'Average time per prey (s)',ratio:0.55});setLegend(series);
  document.getElementById('counts').innerHTML='As worm abundance rises, average handling time falls; adding beetles (higher handling time) shifts the curves upward. The optimal diet minimises average time per item.';
}
function sync(){document.querySelectorAll('#simbox .val').forEach(function(v){var el=document.getElementById(v.id.slice(2));if(el)v.textContent=el.value;});}
const D={hw:1,hb:60,ab:0.0025,start:0.005,end:0.09};
function resetSim(){for(const k in D)document.getElementById(k).value=D[k];sync();run();toast('Reset');}
function downloadCSV(){if(!last){toast('Plot first');return;}let csv='abundance,onlyWorms,worms+fewBeetles,worms+equalBeetles,worms+manyBeetles\n';for(let i=0;i<last.y1.length;i++)csv+=last.y1[i][0]+','+last.y1[i][1]+','+last.y2[i][1]+','+last.y3[i][1]+','+last.y4[i][1]+'\n';dl(csv,'minimal-time.csv','text/csv');toast('CSV downloaded');}
var _lr;document.querySelectorAll('#simbox input[type=range]').forEach(function(el){el.addEventListener('input',function(){clearTimeout(_lr);_lr=setTimeout(run,110);});});
sync();window.addEventListener('resize',function(){if(last)run();});
