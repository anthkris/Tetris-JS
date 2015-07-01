var tetris = {};
var gravity;

//DRAWING THE GRID

//doing with jQuery makes it less accessible but prevents 220 lines of HTML
tetris.drawPlayField = function() {
	for (var row = 0; row < 22; row++){
		//jQuery append method attaches content to the end of each element
		//so this loop creates 22 rows with blank spaces
		$('#playfield').append('<tr class="' + row + '"></tr>');
		//this loop creates 10 columns with blank spaces
		//adds id as number of column
		for (var col = 0; col < 10; col++){
			$('.' + row).append('<td id="'+ col + '"></td>');
		}
	}
}

//DEFINE ALL 7 TETRONIMOS

//define default origin at midpoint
tetris.origin = {row: 1, col: 5};
//default current shape
tetris.currentShape = 'I';
//placeholder for current coordinates
tetris.currentCoor;


tetris.shapeToCoor = function (shape, origin){
	//each shape coordinates are returned
	//also define shape at various rotations
	if (shape === 'L'){
		return [{row: origin.row, col: origin.col},
				//for L and J this bit begins the shape to the side of midpoint
				{row: origin.row - 1, col: origin.col},
				{row: origin.row + 1, col: origin.col},
				{row: origin.row + 1, col: origin.col + 1}]
	} else if(shape === 'L90'){
		return [{row: origin.row, col: origin.col},
				{row: origin.row, col: origin.col - 1},
				{row: origin.row + 1, col: origin.col - 1},
				{row: origin.row, col: origin.col + 1}]
	} else if(shape === 'L180'){
		return [{row: origin.row, col: origin.col},
				{row: origin.row - 1, col: origin.col},
				{row: origin.row - 1, col: origin.col - 1},
				{row: origin.row + 1, col: origin.col}]
	} else if(shape === 'L270'){
		return [{row: origin.row, col: origin.col},
				{row: origin.row, col: origin.col + 1},
				{row: origin.row - 1, col: origin.col + 1},
				{row: origin.row, col: origin.col - 1}]
	} else if(shape === 'J'){
		return [{row: origin.row, col: origin.col},
				{row: origin.row - 1, col: origin.col},
				{row: origin.row + 1, col: origin.col},
				{row: origin.row + 1, col: origin.col - 1}]
	} else if(shape === 'J90'){
		return [{row: origin.row, col: origin.col},
				{row: origin.row, col: origin.col - 1},
				{row: origin.row - 1, col: origin.col - 1},
				{row: origin.row, col: origin.col + 1}]
	} else if(shape === 'J180'){
		return [{row: origin.row, col: origin.col},
				{row: origin.row - 1, col: origin.col},
				{row: origin.row - 1, col: origin.col + 1},
				{row: origin.row + 1, col: origin.col}]
	} else if(shape === 'J270'){
		return [{row: origin.row, col: origin.col},
				{row: origin.row, col: origin.col + 1},
				{row: origin.row + 1, col: origin.col + 1},
				{row: origin.row, col: origin.col - 1}]
	} else if(shape === 'T'){
		return [{row: origin.row, col: origin.col},
				{row: origin.row, col: origin.col + 1},
				{row: origin.row, col: origin.col - 1},
				{row: origin.row + 1, col: origin.col}]
	} else if(shape === 'T90'){
		return [{row: origin.row, col: origin.col},
				{row: origin.row - 1, col: origin.col},
				{row: origin.row + 1, col: origin.col},
				{row: origin.row, col: origin.col - 1}]
	} else if(shape === 'T180'){
		return [{row: origin.row, col: origin.col},
				{row: origin.row, col: origin.col + 1},
				{row: origin.row, col: origin.col - 1},
				{row: origin.row - 1, col: origin.col}]
	} else if(shape === 'T270'){
		return [{row: origin.row, col: origin.col},
				{row: origin.row + 1, col: origin.col},
				{row: origin.row - 1, col: origin.col},
				{row: origin.row, col: origin.col + 1}]
	} else if(shape === 'I'){
		return [{row: origin.row, col: origin.col},
				{row: origin.row + 1, col: origin.col},
				{row: origin.row - 1, col: origin.col},
				{row: origin.row - 2, col: origin.col}]
	} else if(shape === 'I90'){
		return [{row: origin.row, col: origin.col},
				{row: origin.row, col: origin.col - 1},
				{row: origin.row, col: origin.col + 1},
				{row: origin.row, col: origin.col + 2}]
	} else if(shape === 'Z'){
		return [{row: origin.row, col: origin.col},
				{row: origin.row, col: origin.col + 1},
				{row: origin.row - 1, col: origin.col},
				{row: origin.row - 1, col: origin.col - 1}]
	} else if(shape === 'Z90'){
		return [{row: origin.row, col: origin.col},
				{row: origin.row, col: origin.col + 1},
				{row: origin.row - 1, col: origin.col + 1},
				{row: origin.row + 1, col: origin.col}]
	} else if(shape === 'S'){
		return [{row: origin.row, col: origin.col},
				{row: origin.row, col: origin.col - 1},
				{row: origin.row + 1, col: origin.col - 1},
				{row: origin.row + 1, col: origin.col - 2}]
	} else if(shape === 'S90'){
		return [{row: origin.row, col: origin.col},
				{row: origin.row, col: origin.col - 1},
				{row: origin.row - 1, col: origin.col - 1},
				{row: origin.row + 1, col: origin.col}]
	} else if(shape === 'O'){
		return [{row: origin.row, col: origin.col},
				{row: origin.row + 1, col: origin.col},
				{row: origin.row + 1, col: origin.col + 1},
				{row: origin.row, col: origin.col + 1}]
	}
}
//Set current coordinates depending on the current shape
tetris.currentCoor = tetris.shapeToCoor(tetris.currentShape, tetris.origin);


//FILLING THE CELLS WITH COLOR

//method to fill in the cells
tetris.fillCells = function(coordinates, fillColor){
	for (var i = 0; i < coordinates.length; i++){ 
		var row = coordinates[i].row;
		var col = coordinates[i].col;
		var $coor = $('.' + row).find('#' + col);
		$coor.attr('bgcolor', fillColor);
	}
}

//functions to fill cells with specific tetronimo color

tetris.hexColor = function(shape){

	if (shape === 'I' || shape === 'I90'){
		return '#00FFFF';
	} else if (shape === 'J' || shape === 'J90' || shape === 'J180' || shape === 'J270'){
		return '#0000FF';
	} else if (shape === 'L' || shape === 'L90' || shape === 'L180' || shape === 'L270'){
		return '#FF8000';
	} else if (shape === 'O'){
		return '#FFFF00';
	} else if (shape === 'Z' || shape === 'Z90'){
		return '#FF0000';
	} else if (shape === 'S' || shape === 'S90'){
		return '#00FF00';
	}  else if (shape === 'T' || shape === 'T90' || shape === 'T180' || shape === 'T270'){
		return '#FF00FF';
	}

};


//SHAPE MOVEMENT

//Refactored code to use new ifReverse function
//ifReverse checks whether or not the current block should be reversed to stay on grid
tetris.ifReverse = function(){
	for (var i = 0; i < this.currentCoor.length; i++){
		var row = this.currentCoor[i].row;
		var col = this.currentCoor[i].col;
		var $coor = $('.' + row).find('#' + col);
		if($coor.length === 0 || $coor.attr('bgcolor') === 'silver' || row > 21){
			return true;
		}
	}
	return false;
}

//Moving the Current Shape

tetris.move = function(direction){
	//erases current shape by filling it with no color
	this.fillCells(this.currentCoor,'');
	
	//move origin
	if(direction === 'right'){
		this.origin.col++;
	} else if (direction === 'left') {
		this.origin.col--;
	}
	
	this.currentCoor = this.shapeToCoor(this.currentShape, this.origin);
	
	//get shape back on grid if it goes off
	if (this.ifReverse()){
		if (direction === 'right'){
			//if right, increment the value of column property up 1
			this.origin.col--;
		} else if (direction === 'left'){
			this.origin.col++;
		}
	}
	
	this.currentCoor = this.shapeToCoor(this.currentShape, this.origin);
	
	//redraw shape
	this.fillCells(this.currentCoor, this.hexColor(this.currentShape));

}

//Rotating the Current Shape

tetris.rotate = function(){
	//save current shape
	var lastShape = this.currentShape;
	//erase shape by filling cells with nothing
	this.fillCells(this.currentCoor, '');
	
	//for L shape
	if (this.currentShape === 'L'){
		this.currentShape = 'L90';
	} else if (this.currentShape === 'L90'){
		this.currentShape = 'L180';
	} else if (this.currentShape === 'L180'){
		this.currentShape = 'L270';
	} else if (this.currentShape === 'L270'){
		this.currentShape = 'L';
	}
	
	//for J shape
	if (this.currentShape === 'J'){
		this.currentShape = 'J90';
	} else if (this.currentShape === 'J90'){
		this.currentShape = 'J180';
	} else if (this.currentShape === 'J180'){
		this.currentShape = 'J270';
	} else if (this.currentShape === 'J270'){
		this.currentShape = 'J';
	}
	
	//for T shape
	if (this.currentShape === 'T'){
		this.currentShape = 'T90';
	} else if (this.currentShape === 'T90'){
		this.currentShape = 'T180';
	} else if (this.currentShape === 'T180'){
		this.currentShape = 'T270';
	} else if (this.currentShape === 'T270'){
		this.currentShape = 'T';
	}
	
	//for I shape
	if (this.currentShape === 'I'){
		this.currentShape = 'I90';
	} else if (this.currentShape === 'I90'){
		this.currentShape = 'I';
	}
	
	//for Z shape
	if (this.currentShape === 'Z'){
		this.currentShape = 'Z90';
	} else if (this.currentShape === 'Z90'){
		this.currentShape = 'Z';
	}
	
	//for S shape
	if (this.currentShape === 'S'){
		this.currentShape = 'S90';
	} else if (this.currentShape === 'S90'){
		this.currentShape = 'S';
	}
	
	//for O shape, no rotation possible
	if (this.currentShape === 'O'){
		this.currentShape = 'O';
	}

	//redraw shape
	this.currentCoor = this.shapeToCoor(this.currentShape, this.origin);
	
	for (var i = 0; i < this.currentCoor.length; i++){
		if(this.ifReverse()){
			this.currentShape = lastShape;
		}
	}
	this.currentCoor = this.shapeToCoor(this.currentShape, this.origin);
	this.fillCells(this.currentCoor, this.hexColor(this.currentShape));
}
//SCORE
tetris.score = 0;

//Add Gravity
//drop shape by one row
tetris.drop = function() {
	//erases current shape by filling it with no color
	this.fillCells(this.currentCoor,'');
	this.origin.row++;
	
	for (var i = 0; i < this.currentCoor.length; i++){
		this.currentCoor[i].row++;
	}
	
	this.currentCoor = this.shapeToCoor(this.currentShape, this.origin);
	
	if (this.ifReverse()){
		//keep tetronimo on grid
		for (var i = 0; i < this.currentCoor.length; i++){
			this.currentCoor[i].row--;
		}
		this.origin.row--;
		
		//changes colors for dead blocks
		this.fillCells(this.currentCoor, 'silver');
		
		//spawn new shape when prev shape reaches bottom or end the game
		for (var j = 0, i = 0; j < 10; j++){
			//if any cell in the top row is silver, reachedTop is true and game should end
			var $coor = $('.' + i).find('#' + j);
			if ($coor.attr('bgcolor') === 'silver'){
				var reachedTop = true;
				this.end();
			} else {
				this.spawn();
				this.emptyFullRow();
			}
		}
		
	}
	
	//redraw shape
	this.fillCells(this.currentCoor, this.hexColor(this.currentShape));
	
}

//EMPTY FULL ROWS

tetris.emptyFullRow = function(){
	//stores number of full rows
	var drops = 0;
	
	
	//scans for full rows from bottom to top
	for (var i = 21; i >= 0; i--){
		var rowIsFull = true;
		
		//looks through each cell from left to right
		for (var j = 0; j < 10; j++){
			//if each cell is not set to silver, row is not full
			
			var $coor = $('.' + i).find('#' + j);
			if ($coor.attr('bgcolor') !== 'silver'){
				rowIsFull = false;
			}
			//if drops is greater than 0
			if (drops > 0){
				//set new expression to lower cells by number of rows in drops
				var $newCoor = $('.' + (i + drops)).find('#' + j);
				$newCoor.attr('bgcolor', $coor.attr('bgcolor'));
				
			}
		}
		
		if (rowIsFull){
			drops++;
			this.score += 10;
			printScore(this.score);
		}
	}
}
//SPAWN NEW SHAPES

tetris.spawn = function(){
	//gets random shape from shapeArray
	var random = Math.floor(Math.random() * 7);
	var shapeArray = ['L', 'J', 'I', 'O', 'S', 'T', 'Z'];
	this.currentShape = shapeArray[random];
	if (this.score >= 100){
		//must clear interval before you can change it
		clearInterval(gravity);
		gravity = setInterval (function(){
			tetris.drop();
		}, 400);
	} else if (this.score >= 200){
		clearInterval(gravity);
		gravity = setInterval (function(){
			tetris.drop();
		}, 300);
	}
	this.origin = {row: 1, col: 5};
	this.currentCoor = this.shapeToCoor(this.currentShape, this.origin);
	
}

//PRINT SCORE

function printScore(score){
	var scoreOutput = document.getElementById('score');
	scoreOutput.innerHTML = parseInt(score);
}

//END GAME

tetris.end = function(){
	$('#restart_game').modal('show');
	//clear interval to stop drop and, therefore, spawning
	clearInterval(gravity);
	$('#restart').click(function(){
		location.reload();
	});
	$('#no_restart').click(function(){
		$('#restart_game').modal('hide');
	});
}

//READY TO PLAY
$(document).ready(function(){
	tetris.drawPlayField();
	tetris.fillCells(tetris.currentCoor, tetris.hexColor(tetris.currentShape));
	printScore(0);
	
	//USING THE ARROW KEYS

	//use jQuery keydown method to tell document what to do when specific keys are pressed
	//parameter e represents keydown event
	$(document).keydown (function(e){
		//just for development to see what the key codes are, not 
		console.log(e.keyCode);
		//if right arrow pressed, move right
		if (e.keyCode === 39){
			tetris.move('right');
		} else if (e.keyCode === 37){
			//if left arrow is down, move left
			tetris.move('left');
		} else if (e.keyCode === 38){
			tetris.rotate();
		} else if (e.keyCode === 40){
			tetris.drop();
		}
	});
	
	gravity = setInterval(function(){
		tetris.drop();
		}, 500);
	
})