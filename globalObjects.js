var isMobile = ('ontouchstart' in document.documentElement && /mobi/i.test(navigator.userAgent));
if(isMobile){
  //document.body.style.overflowY = "scroll";
  document.getElementById('options').style.position = "relative";
  document.getElementById('stats').style.position = "relative";
  document.getElementById('toggleOptions').style.marginTop = "40px";
  document.getElementById('credit').style.position = "relative";
}

var c = document.getElementById('space');
var ctx = c.getContext('2d');
var mouse = { x: 0, y: 0 };
var gridSize = 12;
var boxSize = c.width/gridSize;
var gridOn = true;
var grid = [[],[],[],[],[],[],[],[],[],[],[],[]];
var startClicked = false;
var targetClicked = false;

var start = null;
var target = null;

var allPaths = [];
var successfulPaths = [];
var minSize = 145;
var shortestPathIndex = null;

var activePaths = [];

var propogationRate = 1;
var walls = 50;

var addMode = false;
var removeMode = false;
var finished = false;
var hoverBox;


document.getElementById('propogation-slider').oninput = ()=> {
  propogationRate = document.getElementById('propogation-slider').value;
  if((propogationRate - Math.floor(propogationRate)) == 0){
    document.getElementById('propLabel').innerHTML = "Propogation Rate: " + propogationRate + ".0x";
  } else {
    document.getElementById('propLabel').innerHTML = "Propogation Rate: " + propogationRate + "x";
  }
}

document.getElementById('wall-slider').oninput = ()=> {
  walls = document.getElementById('wall-slider').value;
  document.getElementById('wallLabel').innerHTML = "Number of Walls: " + walls;
  document.getElementById('totalPathLabel').innerHTML = "None";
  document.getElementById('successfulPathLabel').innerHTML = "None";
  document.getElementById('viewPathNum').value = "";
  document.getElementById('viewSPathNum').value = "";
  newGrid();
}

document.getElementById('newGrid-btn').addEventListener("click", ()=>{
  document.getElementById('totalPathLabel').innerHTML = "None";
  document.getElementById('successfulPathLabel').innerHTML = "None";
  document.getElementById('viewPathNum').value = "";
  document.getElementById('viewSPathNum').value = "";
  newGrid();
});

function displayStats(){
  document.getElementById('totalPathLabel').innerHTML = allPaths.length;
  document.getElementById('successfulPathLabel').innerHTML = successfulPaths.length;
}

document.getElementById('viewPath-btn').addEventListener("click", ()=>{
  var pathIndex = document.getElementById('viewPathNum').value - 1;
  for(var r = 0; r < grid.length; r++){
    for(var c = 0; c < grid[r].length; c++){
      if(!grid[r][c].wall && grid[r][c].path){
        grid[r][c].color = "#4287f5";
        grid[r][c].print();
      }
    }
  }
  if(pathIndex >= 0 && pathIndex < allPaths.length){
    for(var i = 0; i < allPaths[pathIndex].length; i++){
      allPaths[pathIndex][i].color = "#ff4a4a";
      allPaths[pathIndex][i].print();
    }
  } else {
    alert("Invalid Range");
  }

  start.color = "#00cf25";
  target.color = "#00cf25";
  start.print();
  target.print();
});

document.getElementById('viewSPath-btn').addEventListener("click", ()=>{
  var pathIndex = document.getElementById('viewSPathNum').value - 1;
  for(var r = 0; r < grid.length; r++){
    for(var c = 0; c < grid[r].length; c++){
      if(!grid[r][c].wall && grid[r][c].path){
        grid[r][c].color = "#4287f5";
        grid[r][c].print();
      }
    }
  }
  if(pathIndex >= 0 && pathIndex < successfulPaths.length){
    for(var i = 0; i < successfulPaths[pathIndex].length; i++){
      successfulPaths[pathIndex][i].color = "#34ad2b";
      successfulPaths[pathIndex][i].print();
    }
  } else {
    alert("Invalid Range");
  }

  start.color = "#00cf25";
  target.color = "#00cf25";
  start.print();
  target.print();
});

var showingOptions = false;
document.getElementById('toggleOptions').addEventListener("click", ()=>{
  if(showingOptions){
    showingOptions = !showingOptions;
    document.getElementById('options').style.display = "none";
    document.getElementById('stats').style.display = "none";
  } else {
    showingOptions = !showingOptions;
    document.getElementById('options').style.display = "block";
    document.getElementById('stats').style.display = "block";
  }
});

document.getElementById('clear-selection').addEventListener("click", ()=>{
  var elements = document.getElementsByName('editMode');
  for(var i = 0; i < elements.length; i++){
    elements[i].checked = false;
  }
  addMode = false;
  removeMode = false;
});

document.getElementById('add-walls').addEventListener("click", ()=>{
  addMode = true;
  removeMode = false;
});

document.getElementById('remove-walls').addEventListener("click", ()=>{
  addMode = false;
  removeMode = true;
});