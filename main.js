var tbl;
var preTbl;
var status = 0;
var timer;
var score = 0;
const ROW_COUNT = 24;
const COLUMN_COUNT = 10;
const BLOCK_COLOR = [
	"Chocolate",
	"Crimson",
	"DarkBlue",
	"DarkOliveGreen",
	"DarkViolet",
	"DeepPink",
	"GoldenRod"
];

var board;

function prepareBoard() {
	board = new Array(ROW_COUNT);
	for (var i = 0; i < ROW_COUNT; i++) {
		board[i] = new Array(COLUMN_COUNT);
	}
	for (var i = 0; i < ROW_COUNT; i++) {
		for (var j = 0; j < COLUMN_COUNT; j++) {
			board[i][j] = 0;
		}
	}
}

var activeBlock;
var activeBlockType = 0;
var nextBlock;
var nextBlockType = 0;
var previewBlock;
var previewBlockType = 0;
function generateBlock() {
	var block = new Array(5);

	var t = (Math.floor(Math.random() * 20) + 1) % 7;
	switch (t) {
		case 0:
			{
				block[0] = {
					x: 0,
					y: 4
				};
				block[1] = {
					x: 1,
					y: 4
				};
				block[2] = {
					x: 0,
					y: 5
				};
				block[3] = {
					x: 1,
					y: 5
				};
				block[4] = {
					type: 0
				};
				break;
			}
		case 1:
			{
				block[0] = {
					x: 0,
					y: 3
				};
				block[1] = {
					x: 0,
					y: 4
				};
				block[2] = {
					x: 0,
					y: 5
				};
				block[3] = {
					x: 0,
					y: 6
				};
				block[4] = {
					type: 1
				};
				break;
			}
		case 2:
			{
				block[0] = {
					x: 0,
					y: 5
				};
				block[1] = {
					x: 1,
					y: 4
				};
				block[2] = {
					x: 1,
					y: 5
				};
				block[3] = {
					x: 2,
					y: 4
				};
				block[4] = {
					type: 2
				};
				break;
			}
		case 3:
			{
				block[0] = {
					x: 0,
					y: 4
				};
				block[1] = {
					x: 1,
					y: 4
				};
				block[2] = {
					x: 1,
					y: 5
				};
				block[3] = {
					x: 2,
					y: 5
				};
				block[4] = {
					type: 3
				};
				break;
			}
		case 4:
			{
				block[0] = {
					x: 0,
					y: 4
				};
				block[1] = {
					x: 1,
					y: 4
				};
				block[2] = {
					x: 1,
					y: 5
				};
				block[3] = {
					x: 1,
					y: 6
				};
				block[4] = {
					type: 4
				};
				break;
			}
		case 5:
			{
				block[0] = {
					x: 0,
					y: 4
				};
				block[1] = {
					x: 1,
					y: 4
				};
				block[2] = {
					x: 2,
					y: 4
				};
				block[3] = {
					x: 2,
					y: 5
				};
				block[4] = {
					type: 5
				};
				break;
			}
		case 6:
			{
				block[0] = {
					x: 0,
					y: 5
				};
				block[1] = {
					x: 1,
					y: 4
				};
				block[2] = {
					x: 1,
					y: 5
				};
				block[3] = {
					x: 1,
					y: 6
				};
				block[4] = {
					type: 6
				};
				break;
			}
	}
	return block;
}
function moveDown() {
	if (checkBottomBorder()) {
		erase();
		for (var i = 0; i < 4; i++) {
			activeBlock[i].x = activeBlock[i].x + 1;
		}
		paint();
	} else {
		clearInterval(timer);
		updateBoard();
		var lines = deleteLine();
		if (lines != 0) {
			if (lines == 2) {
				lines = 3;
			} else if (lines == 3) {
				lines = 6;
			} else if (lines == 4) {
				lines = COLUMN_COUNT;
			}
			score = score + lines;
			updateScore();
			eraseBoard();
			paintBoard();
		}
		erasePreview();
		if (!validateBlock(nextBlock)) {
			paintBoard();
			swal("GAME OVER!!!");
			status = 2;
			beginButton = document.getElementById("beginButton");
			beginButton.disabled = false;
			return;
		};
		activeBlock = nextBlock;
		nextBlock = generateBlock();
		previewBlock = copyBlock(nextBlock);
		paint();
		applyPreview();
		paintPreview();
		timer = setInterval(moveDown, 1000)
	}
}
function validateBlock(block) {
	if (!block) {
		return false;
	}
	for (var i = 0; i < 4; i++) {
		if (!isCellValid(block[i].x, block[i].y)) {
			return false;
		}
	}
	return true;
}

function moveLeft() {
	if (checkLeftBorder()) {
		erase();
		for (var i = 0; i < 4; i++) {
			activeBlock[i].y = activeBlock[i].y - 1;
		}
		paint();
	}
}
function moveRight() {
	if (checkRightBorder()) {
		erase();
		for (var i = 0; i < 4; i++) {
			activeBlock[i].y = activeBlock[i].y + 1;
		}
		paint();
	}
}
function rotate() {
	var tmpBlock = copyBlock(activeBlock);
	var cx = Math.round((tmpBlock[0].x + tmpBlock[1].x + tmpBlock[2].x + tmpBlock[3].x) / 4);
	var cy = Math.round((tmpBlock[0].y + tmpBlock[1].y + tmpBlock[2].y + tmpBlock[3].y) / 4);
	for (var i = 0; i < 4; i++) {
		tmpBlock[i].x = cx + cy - activeBlock[i].y;
		tmpBlock[i].y = cy - cx + activeBlock[i].x;
	}
	for (var i = 0; i < 4; i++) {
		if (!isCellValid(tmpBlock[i].x, tmpBlock[i].y)) {
			return;
		}
	}
	erase();
	for (var i = 0; i < 4; i++) {
		activeBlock[i].x = tmpBlock[i].x;
		activeBlock[i].y = tmpBlock[i].y;
	}
	paint();
}
function checkLeftBorder() {
	for (var i = 0; i < 4; i++) {
		if (activeBlock[i].y == 0) {
			return false;
		}
		if (!isCellValid(activeBlock[i].x, activeBlock[i].y - 1)) {
			return false;
		}
	}
	return true;
}
function checkRightBorder() {
	for (var i = 0; i < 4; i++) {
		if (activeBlock[i].y == 9) {
			return false;
		}
		if (!isCellValid(activeBlock[i].x, activeBlock[i].y + 1)) {
			return false;
		}
	}
	return true;
}
function checkBottomBorder() {
	for (var i = 0; i < 4; i++) {
		if (activeBlock[i].x == (ROW_COUNT - 1)) {
			return false;
		}
		if (!isCellValid(activeBlock[i].x + 1, activeBlock[i].y)) {
			return false;
		}
	}
	return true;
}
function isCellValid(x, y) {
	if (x > (ROW_COUNT - 1) || x < 0 || y > 9 || y < 0) {
		return false;
	}
	console.log("boardX: " + x + ", boardY: " + y);
	if (board[x][y] == 1) {
		return false;
	}
	return true;
}
function erase() {
	for (var i = 0; i < 4; i++) {
		tbl.rows[activeBlock[i].x].cells[activeBlock[i].y].style.backgroundColor = "white";
	}
}
function paint() {
	for (var i = 0; i < 4; i++) {
		tbl.rows[activeBlock[i].x].cells[activeBlock[i].y].style.backgroundColor = BLOCK_COLOR[activeBlock[4].type];
	}
}

function paintPreview() {
	for (var i = 0; i < 4; i++) {
		preTbl.rows[previewBlock[i].x].cells[previewBlock[i].y].style.backgroundColor = BLOCK_COLOR[previewBlock[4].type];
	}
}

function erasePreview() {
	for (var i = 0; i < 4; i++) {
		preTbl.rows[previewBlock[i].x].cells[previewBlock[i].y].style.backgroundColor = "white";
	}
}

function updateBoard() {
	for (var i = 0; i < 4; i++) {
		board[activeBlock[i].x][activeBlock[i].y] = 1;
	}
}

function deleteLine() {
	var lines = 0;
	for (var i = 0; i < ROW_COUNT; i++) {
		var j = 0;
		for (; j < 10; j++) {
			if (board[i][j] == 0) {
				break;
			}
		}
		if (j == 10) {
			lines++;
			if (i != 0) {
				for (var k = i - 1; k >= 0; k--) {
					board[k + 1] = board[k];
				}
			}
			board[0] = generateBlankLine();
		}
	}
	return lines;
}

function eraseBoard() {
	for (var i = 0; i < 24; i++) {
		for (var j = 0; j < 10; j++) {
			tbl.rows[i].cells[j].style.backgroundColor = "white";
		}
	}
}

function paintBoard() {
	for (var i = 0; i < ROW_COUNT; i++) {
		for (var j = 0; j < COLUMN_COUNT; j++) {
			if (board[i][j] == 1) {
				tbl.rows[i].cells[j].style.backgroundColor = "DimGray";
			}
		}
	}
}

function generateBlankLine() {
	var line = new Array(COLUMN_COUNT);
	for (var i = 0; i < COLUMN_COUNT; i++) {
		line[i] = 0;
	}
	return line;
}

function updateScore() {
	document.getElementById("score").innerText = " " + score;
}

function keyControl() {
	if (status != 1) {
		return;
	}
	var code = event.keyCode;
	switch (code) {
		case 37:
			{
				moveLeft();
				break;
			}
		case 38:
			{
				rotate();
				break;
			}
		case 39:
			{
				moveRight();
				break;
			}
		case 40:
			{
				moveDown();
				break;
			}
		case 32:
			{
				clearInterval(timer);
				timer = setInterval(moveDown, 0);
				setTimeout(function() {
					clearInterval(timer);
					timer = setInterval(moveDown, 1000);
				}, 200);
			}
	}
}

function copyBlock(old) {
	var o = new Array(5);
	for (var i = 0; i < 4; i++) {
		o[i] = {
			x: 0,
			y: 0
		};
	}
	o[4] = {
		type: 0
	}
	for (var i = 0; i < 4; i++) {
		o[i].x = old[i].x;
		o[i].y = old[i].y;
	}
	o[4].type = old[4].type;
	return o;
}

function applyPreview() {
	var t = 100;
	for (var i = 0; i < 4; i++) {
		if (previewBlock[i].y < t) {
			t = previewBlock[i].y;
		}
	}
	for (var i = 0; i < 4; i++) {
		previewBlock[i].y -= t;
	}

}

function pause(e) {
	if (e.value === "Pause") {
		e.value = "Resume";
		e.className = "btn btn-large btn-warning";
		clearInterval(timer);
	} else {
		e.value = "Pause";
		e.className = "btn btn-large btn-success";
		timer = setInterval(moveDown, 1000);
	}
}

function begin(e) {
	prepareBoard();
	e.disabled = true;
	document.getElementById("pauseButton").disabled = false;
	status = 1;
	tbl = document.getElementById("board");
	eraseBoard();
	preTbl = document.getElementById("preBoard");
	activeBlock = generateBlock();
	nextBlock = generateBlock();
	previewBlock = copyBlock(nextBlock);
	applyPreview();
	paint();
	paintPreview();
	timer = setInterval(moveDown, 1000);
}
document.onkeydown = keyControl;
keyControl;
