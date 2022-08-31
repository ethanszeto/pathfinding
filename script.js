class box {
  constructor(x,y,wall,color){
    this.x = x;
    this.y = y;
    this.wall = wall;
    this.path = false;
    this.color = color;
  }
  print(){
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x*boxSize+1,this.y*boxSize+1,boxSize-1,boxSize-1);
  }
}

class path extends box{
  constructor(x,y,wall,color,weight,pathNum,path){
    super(x,y,wall,color);
    this.path = path;
    this.weight = weight;
    this.pathNum = pathNum;
  }

  print(){
    super.print();
    ctx.fillStyle = "#000000";
    ctx.font = boxSize/2 + "px Arial";
    ctx.fillText(this.weight, this.x*boxSize + 5, this.y*boxSize + boxSize/2);
  }
}

document.getElementById('space').addEventListener( 'mousemove', function( evt ) {
  const rect = document.getElementById('space').getBoundingClientRect();
  mouse.x = Math.floor( ( evt.clientX - rect.left ) / ( rect.right - rect.left ) * document.getElementById('space').width );
  mouse.y = Math.floor( ( evt.clientY - rect.top ) / ( rect.bottom - rect.top ) * document.getElementById('space').height );
  var x = Math.floor(mouse.x / boxSize);
  var y = Math.floor(mouse.y / boxSize);
  //highlighting when hover
  var color = grid[x][y].color;
  color = color.substring(1);
  hoverBox = new box(x, y, false, "#" + LightenDarkenColor(color, 30));
  console.log("#" + LightenDarkenColor(color, 30));
  if(!targetClicked){
    hoverBox.print();
    for(var r = 0; r < grid.length; r++){
      for(var c = 0; c < grid[r].length; c++){
        if(startClicked){
          grid[start.x][start.y].print();
        }
        if(!(grid[r][c].x == x && grid[r][c].y == y)){
          grid[r][c].print();
        }
      }
    }
  }
});
//Clicking the canvas
document.getElementById('space').addEventListener("click", ()=> {
  var x = Math.floor(mouse.x / boxSize);
  var y = Math.floor(mouse.y / boxSize);
  //add walls
  if(addMode && !removeMode){
    if((start == null || target == null) || (x != start.x && y != start.y && x != target.x && y != target.y) && !finished){
      grid[x][y] = new box(x, y, true, "#000000");
      grid[x][y].print();
    }
    //remove walls
  } else if(removeMode && !addMode){
    if((start == null || target == null) || (x != start.x && y != start.y && x != target.x && y != target.y) && !finished){
      grid[x][y] = new box(x,y,false,"#CCCCCC");
      grid[x][y].print();
    }
    //starting point
  } else if(!startClicked && !addMode && !removeMode){
    startClicked = true;
    start = new path(x, y, false, "#00cf25", 0, 0, true);
    grid[x][y] = start;
    grid[x][y].print();
    console.log("x: " + x + " y: " + y);
    //target
  } else if(startClicked && !targetClicked && !addMode && !removeMode){
    targetClicked = true;
    target = new path(x, y, false, "#00cf25", 0, null, true);
    grid[x][y] = target;
    grid[x][y].print();
    console.log("x: " + x + " y: " + y);
    pathfind(start, target, 0);
  }
});

window.addEventListener("load", ()=>{
  newGrid();
});

function newGrid(){
  finished = false;
  start = null;
  target = null;
  startClicked = false;
  targetClicked = false;
  successfulPaths = [];
  activePaths = [];
  shortestPathIndex = null;
  minSize = 145;
  allPaths = [];
  for(var r = 0; r < gridSize; r++){
    for(var c = 0; c < gridSize; c++){
      grid[r][c] = new box(r,c,false,"#CCCCCC");
      grid[r][c].print();
    }
  }
  for(var i = 0; i < walls; i++){
    var randx = Math.floor(Math.random() * gridSize);
    var randy = Math.floor(Math.random() * gridSize);
    while(grid[randx][randy].wall){
      randx = Math.floor(Math.random() * gridSize);
      randy = Math.floor(Math.random() * gridSize);
    }
    grid[randx][randy] = new box(randx, randy, true, "#000000");
    grid[randx][randy].print();
  }
  if(gridOn){
    ctx.fillStyle = "#000000";
    for(var r = 0; r < gridSize; r++){
      for(var c = 0; c < gridSize; c++){
        ctx.fillRect(r*boxSize, c*boxSize, 720, 1);
        ctx.fillRect(r*boxSize, c*boxSize, 1, 720);
      }
    }
  }
}


function pathfind(s, t, weight){
  if(weight == 0){
    allPaths.push([s]);
    activePaths.push(true);
  }

  //Check and track Adjacent tiles to the one passed into the function
  var adjacentTiles = [];
  if(s.y != 0 && !grid[s.x][s.y-1].wall){
    if(!grid[s.x][s.y-1].path){
      adjacentTiles.push(new path(s.x,s.y-1,false,"#4287f5",weight+1,null,true));
    } else {
      if(grid[s.x][s.y-1].weight > weight + 1){
        adjacentTiles.push(new path(s.x,s.y-1,false,"#4287f5",weight+1,null,true));
      }
    }
  }
  if(s.y != gridSize-1 && !grid[s.x][s.y+1].wall){
    if(!grid[s.x][s.y+1].path){
      adjacentTiles.push(new path(s.x,s.y+1,false,"#4287f5",weight+1,null,true));
    } else {
      if(grid[s.x][s.y+1].weight > weight + 1){
        adjacentTiles.push(new path(s.x,s.y+1,false,"#4287f5",weight+1,null,true));
      }
    }
  }
  if(s.x != 0 && !grid[s.x-1][s.y].wall){
    if(!grid[s.x-1][s.y].path){
      adjacentTiles.push(new path(s.x-1,s.y,false,"#4287f5",weight+1,null,true));
    } else {
      if(grid[s.x-1][s.y].weight > weight + 1){
        adjacentTiles.push(new path(s.x-1,s.y,false,"#4287f5",weight+1,null,true));
      }
    }
  }
  if(s.x != gridSize-1 && !grid[s.x+1][s.y].wall){
    if(!grid[s.x+1][s.y].path){
      adjacentTiles.push(new path(s.x+1,s.y,false,"#4287f5",weight+1,null,true));
    } else {
      if(grid[s.x+1][s.y].weight > weight + 1){
        adjacentTiles.push(new path(s.x+1,s.y,false,"#4287f5",weight+1,null,true));
      }
    }
  }
  //if any of the adjacent tiles is next to the target, add the path of the original tile to success
  if((s.x == t.x && s.y == t.y+1) || (s.x == t.x && s.y == t.y-1) || (s.x == t.x+1 && s.y == t.y) || (s.x == t.x-1 && s.y == t.y)){
    createSuccessfulPath(allPaths[s.pathNum]);
  }
  if(adjacentTiles.length != 0){
    //add new paths
    for(var i = 0; i < adjacentTiles.length; i++){
      if(i == adjacentTiles.length-1){
        allPaths[s.pathNum].push(adjacentTiles[i]);
      } else {
        var newPath = createNewPath(allPaths[s.pathNum]);
        newPath.push(adjacentTiles[i]);
        allPaths.push(newPath);
        activePaths.push(true);
      }
    }
  
    //give paths correct pathNum
    for(var r = 0; r < allPaths.length; r++){
      for(var c = 0; c < allPaths[r].length; c++){
        allPaths[r][c].pathNum = r;
      }
    }
  
    for(var i = 0; i < adjacentTiles.length; i++){
      grid[adjacentTiles[i].x][adjacentTiles[i].y] = adjacentTiles[i];
      grid[adjacentTiles[i].x][adjacentTiles[i].y].print();
    }

    //recursive, calls after 300/rate time
    setTimeout(()=>{
      for(var i = 0; i < adjacentTiles.length; i++){
        pathfind(grid[adjacentTiles[i].x][adjacentTiles[i].y], t, weight+1);
      }
    },300/propogationRate);
    //if there are no adjacent tiles the path dies.
  } else {
    activePaths[s.pathNum] = false;
  }
  //if every single path is no longer active the program is finished running
  //ending code to find and display the shortest path
  if(activePaths.every((boolean)=>{return boolean == false;})){
    finished = true;
    for(var i = 0; i < successfulPaths.length; i++){
      if(successfulPaths[i].length < minSize){
        minSize = successfulPaths[i].length;
        shortestPathIndex = i;
      }
    }
    if(shortestPathIndex != null){
      for(var i = 0; i < successfulPaths[shortestPathIndex].length; i++){
        if(i == 0){
          successfulPaths[shortestPathIndex][i].color = "#00cf25";
          successfulPaths[shortestPathIndex][i].print();
        } else {
          successfulPaths[shortestPathIndex][i].color = "#34ad2b";
          successfulPaths[shortestPathIndex][i].print();
        }
      }
    }
    start.weight = "S";
    start.print();
    target.weight = "E";
    target.print();
    console.log(allPaths);
    console.log(allPaths.length);
    displayStats();
  }
  
}

//creates a completely new path since arrays in JS are mutable
//makes sure it's not just a reference
function createNewPath(currentPath){
  var existingPath = [];
  for(var z = 0; z < currentPath.length; z++){
    existingPath.push(new path(currentPath[z].x,currentPath[z].y,currentPath[z].wall,currentPath[z].color,currentPath[z].weight,currentPath[z].pathNum,currentPath[z].path));
  }
  return Array.from(existingPath);
}

//creates a completely new path for the successful ones, and stores them separately
function createSuccessfulPath(currentPath){
  var success = [];
  for(var z = 0; z < currentPath.length; z++){
    success.push(new path(currentPath[z].x,currentPath[z].y,currentPath[z].wall,currentPath[z].color,currentPath[z].weight,currentPath[z].pathNum,currentPath[z].path));
  }
  successfulPaths.push(Array.from(success));
}

//darken lighten colors (needed for display)
function LightenDarkenColor(col, amt) {
  col = parseInt(col, 16);
  return (((col & 0x0000FF) + amt) | ((((col >> 8) & 0x00FF) + amt) << 8) | (((col >> 16) + amt) << 16)).toString(16);
}