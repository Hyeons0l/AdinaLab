const orbs = ['sun', 'moon', 'star'];
const keyList = ['q', 'w', 'e', 'r', 'conj'];

// 별읽기 바탕 이미지 로드
const circleImage = new Image();
circleImage.src = './assets/Wcircle.png';
const arrowImage = new Image();
arrowImage.src = './assets/sidearrow.png';
const celesImage = [];
celesImage[0] = new Image();
celesImage[0].src = './assets/sun.png';
celesImage[1] = new Image();
celesImage[1].src = './assets/moon.png';
celesImage[2] = new Image();
celesImage[2].src = './assets/star.png';

// 정사각형 이미지들 로드
const skillImages = [];
skillImages[0] = new Image();
skillImages[0].src = './assets/Adina_Q.webp';
skillImages[1] = new Image();
skillImages[1].src = './assets/Adina_W.webp';
skillImages[2] = new Image();
skillImages[2].src = './assets/Adina_E.webp';
skillImages[3] = new Image();
skillImages[3].src = './assets/Adina_R.webp';

const CskillImages = [];
CskillImages[0] = new Image();
CskillImages[0].src = './assets/Adina_QC.webp';
CskillImages[1] = new Image();
CskillImages[1].src = './assets/Adina_WC.webp';
CskillImages[2] = new Image();
CskillImages[2].src = './assets/Adina_EC.webp';
CskillImages[3] = new Image();
CskillImages[3].src = './assets/Adina_R.webp';

const nonExistSFX = ["sunr","moonr","starr"];
const skillSFX = Array.from(Array(3), () => new Array(5));
for (let i = 0; i < 3; i++) {
	for (let j = 0; j < 5; j++) {
		let fileName = orbs[i] + keyList[j]
		if (!nonExistSFX.includes(fileName)){
			skillSFX[i][j] = new Audio();
			skillSFX[i][j].src = './assets/sfx/' + fileName + '.wav'
		}
	}
}
const rSFX = [];
rSFX[0] = new Audio();
rSFX[0].src = './assets/sfx/r.wav'
rSFX[1] = new Audio();
rSFX[1].src = './assets/sfx/conjr.wav'

const tickSFX = new Audio();
tickSFX.src = './assets/sfx/tick.wav'

const deathSFX = new Audio();
deathSFX.src ='./assets/sfx/gameover.wav'

const voiceList = ['start1','start2','start3','conq','conw','cone','die1','die2','die3'];
const voiceLines = [];
for (let i = 0; i < 9; i++) {
	voiceLines[i] = new Audio()
	voiceLines[i].src = './assets/voice/' + voiceList[i] + '.mkv'
}
// 리소스 로드가 모두 완료된 후 실행

var celestialSlots = [];
var keySlots = [];
let score = 0;

let timeLimit = 3;
let isConjDone = false;
let isReadingStar;
let duringGame = false;
let interval; //타이머 표기에 사용

window.addEventListener('DOMContentLoaded', function () {
	volumeProgress()
	/*document.querySelector(".timeBar").addEventListener("animationend", function (e) { //체력바 애니메이션 종료시 게임 오버
		clearInterval(interval);
		gameOver();})*/
	document.querySelector(".start").addEventListener('click', function () {
		bootGame();
	})
	document.querySelector(".restart").addEventListener('click', function () {
		resetGame();
		bootGame();
	})
	document.getElementById("reset").addEventListener('click', function () { //통일성없는똥같은코드
		clearInterval(interval);
		gameOver();
		resetGame();
		bootGame();
	})
});

window.addEventListener("keydown", (e) => {
	if (e.key == 'r' && celestialSlots[1] != undefined && duringGame ) {
		changeSlot(e.key);
		updateGame(); 
	} else if (keyList.includes(e.key) && !isReadingStar && duringGame) {
		useSlot(e.key);
		updateGame(); 
	}
});

function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function playSound(soundElement) {
	const soundType = soundElement.src;
	if (soundType.includes('voice') && !document.getElementById("novoice").checked) {
		return;
	} else if (soundType.includes('sfx') && !document.getElementById("nosfx").checked) {
		return;
	}
	soundElement.volume = document.getElementById("volume").value / 100;
	soundElement.play();
}

function volumeProgress() {
	const sElement = document.getElementById("volume")
	const sValue = sElement.value;
  sElement.style.background = `linear-gradient(to right, #0EB4FC ${sValue}%, #ccc ${sValue}%)`;
}

function resetGame() {
	celestialSlots = [];
	keySlots = [];
	score = 0;
	timeLimit = 3;
	isConjDone = false;
	document.querySelector(".scoreText").innerText = score;
	document.querySelector(".timeBar").classList.remove("running");
	document.querySelector("#conjUI img").src= "./assets/conjUI.png"
	document.querySelector(".portrait img").src = "./assets/Adina_portrait.png";
	resetIcons();
}

function bootGame() {
	document.getElementById("reset").style.display = "none";
	document.querySelector(".gameMessage").classList.remove("gameOver");
	document.querySelector(".gameMessage").classList.add("gameStart");
	duringGame = true;
	isReadingStar = true;
	playSound(voiceLines[getRandomInt(0,3)]);
	fillSlot(6, function () {
		restartTimer();
		isReadingStar = false;
		document.getElementById("reset").style.display = "inline-block";
	})
}

function drawShapes() {
	for (let i = 0; i < 6; i++) {
		const fileName = 'c' + (i + 1);
		const updatingSRC = document.getElementById(fileName);
		if (i < celestialSlots.length) {
			let c = celestialSlots.map(item => orbs.indexOf(item));
			updatingSRC.src = celesImage[c[i]].src;
		} else {
			updatingSRC.src = circleImage.src;
		}

	}
}


async function fillSlot(amount, callback) { //칸 채우기. 하드코딩 마렵네
	let queuedSlots = [];
	queuedSlots = JSON.parse(JSON.stringify(celestialSlots));
	for (let i = 0; i < amount; i++) {
		//불가능한 천체 목록 제작
		let indexi = queuedSlots.length; //채워야하는칸 = 길이
		let occurrences = {};
		let checkedOrb = [];
		let availableOrb = [];
		checkedOrb.push(queuedSlots[indexi - 1]); //연속된 칸에 같은천체가 올수없음
		if (indexi >= 3 && queuedSlots[indexi - 3] == queuedSlots[indexi - 1]) {
			checkedOrb.push(queuedSlots[indexi - 2]);
		}
		queuedSlots.forEach(item => {
			occurrences[item] = (occurrences[item] || 0) + 1;
		});
		queuedSlots.forEach(item => { //한 천체가 2개 이상 나올수 없음
			if (occurrences[item] >= 2 && !checkedOrb.includes(item)) {
				checkedOrb.push(item);
			}
		});
		availableOrb = orbs.filter(item => !checkedOrb.includes(item)); //일단 가능한 천체 목록 생성
		if (indexi == 4) { // 그런데 6번칸에는 1,2번칸과 다른 천체가 들어가야만 함.
			if (!queuedSlots.includes(queuedSlots[0])) { //... 그러므로 저장(1번)칸에 있는 천체는 적어도 5번칸에는 반드시 나와야 함.
				availableOrb = queuedSlots[0]
			} else if (!queuedSlots.includes(queuedSlots[1])) { // 혹은 2번칸에 있는 천체도 적어도 5번칸에선 나와야 함.
				availableOrb = queuedSlots[1]
			}
		}
		//천체 선정
		const randomOrbIndex = getRandomInt(0, availableOrb.length);
		const randomOrb = availableOrb[randomOrbIndex];
		queuedSlots.push(randomOrb);
	}
	if (celestialSlots[0] != undefined){ // 큐와 실제 슬롯 동기화
			queuedSlots.splice(0,1);
	}
	for (let i = 0; i < amount; i++) { //생성된 천체 채우기
		celestialSlots.push(queuedSlots[i]);
		drawShapes();
		await sleep(600);
	}
	callback();
}


function isConjuncted() { // 컨정션 확인
	if (celestialSlots[1] == celestialSlots[2] && celestialSlots[1] != undefined) {
		return true;
	} else {
		return false;
	}
}


function useSlot(pressedKey) {
	if (pressedKey == 'q' || pressedKey == 'w' || pressedKey == 'e') {
		document.getElementById("conjUI").src = "./assets/conjUI.png"
		const conj = isConjuncted();
		const ableConjCheck = document.getElementsByName("noc");
		const ableConj = [];
		for (i=0; i<ableConjCheck.length; i++) { //체크박스 확인
			if (ableConjCheck[i].checked == true) {
				ableConj.push(ableConjCheck[i].value);
			}
		}
		let pressedKeySFX;

		if (conj && !isConjDone && keyList.indexOf(pressedKey) == orbs.indexOf(celestialSlots[1])) { //컨정션 확인
			if (!ableConj.includes(pressedKey)) { //체크박스로 비활성화된 컨정션 확인
				vibrateSkill(pressedKey);
				const chk = document.querySelector("[for='"+ document.querySelector("[value='"+pressedKey+"']").id +"']" ) // 이건 좀;
				chk.classList.add("yellowHighlight");
				playSound(tickSFX);
				setTimeout(function () {
					chk.classList.remove("yellowHighlight");
				}, 500);
				return;
			}
			celestialSlots.splice(1, 1);
			playSound(voiceLines[3 + keyList.indexOf(pressedKey)])
			document.querySelector("#conjUI img").src= "./assets/conjUI.png"
			pressedKey = 'conj_' + pressedKey;
			isConjDone = true;
		}
		if (keySlots.includes(pressedKey) && !document.getElementById("nolock").checked) { // 중복 확인
			vibrateSkill(pressedKey);
			return;
		}
		if (conj) {
			pressedKeySFX = 'conj'
		} else {
			pressedKeySFX = pressedKey
		}
		playSound(skillSFX[orbs.indexOf(celestialSlots[1])][keyList.indexOf(pressedKeySFX)]);
		keySlots.push(pressedKey);
		celestialSlots.splice(1, 1);
		addScore();
	} else if (pressedKey == 'r') {
		
	}
}

function changeSlot(pressedKey) {
	let tmp = celestialSlots[0];
	celestialSlots[0] = celestialSlots[1]
	celestialSlots[1] = tmp;
	keySlots.push(pressedKey);
	if (+(isConjuncted()&&!isConjDone)){
		document.querySelector("#conjUI img").src = "./assets/CconjUI.png"
		playSound(rSFX[1]);
	} else {
		document.querySelector("#conjUI img").src= "./assets/conjUI.png"
		playSound(rSFX[0]);
	}
}

function addScore() {
	if (!document.getElementById("notimer").checked) {
		score++;
		document.querySelector(".scoreText").innerText = score*10;
	}
}


function restartTimer() {
	const timer = document.querySelector(".timeBar");
	let timeNow = 0;
	if (document.getElementById("notimer").checked) { //타이머 체크
		return;
	}
	timer.classList.remove("running");
	timeLimit = (timeLimit -0.6) * 0.9 + 0.6
	timeNow = timeLimit * 10
	if (interval != undefined) {
		clearInterval(interval);
	}
	interval = setInterval(() => {timeNow--;
		if (timeNow <= 0) {
			 gameOver(); 
			 clearInterval(interval);
			return;
		}
		document.querySelector(".timeText").innerText = Math.floor(timeNow)/10 + ' / ' + Math.floor(timeLimit*10)/10;
		}, 100);
	void timer.offsetWidth;
	timer.classList.add("running");
	timer.style.animationPlayState = "running";
	timer.style.animationDuration = (timeLimit + 's');
}

function resetIcons() {

	const c = document.querySelectorAll(".scool img");
	const s = document.querySelectorAll(".s img")

	for (i = 0; i < s.length; i++) {
		s[i].src = skillImages[i].src
	}
	for (let i = 0; i < c.length; i++) {
		c[i].style.visibility = "hidden";
	}
}

function vibrateSkill(skill) {
	document.getElementById(skill).classList.add("vibration");
	document.getElementById(skill + 'x').classList.add("vibration");
	playSound(tickSFX);
	setTimeout(function () {
		document.getElementById(skill).classList.remove("vibration");
		document.getElementById(skill + 'x').classList.remove("vibration");
	}, 300);
}

function updateGame() {
	const conj = isConjuncted();
	const c = document.querySelectorAll(".scool img");
	const s = document.querySelectorAll(".s img")
	const cooltimer = document.getElementById("cooltimer")
	const conjuctedShape = orbs.indexOf(celestialSlots[1]);

	for (i = 0; i < keySlots.length; i++) { // 사용된 아이콘 x처리
		if (keySlots[i] != 'r' && !document.getElementById("nolock").checked ){
			try{
				document.getElementById(keySlots[i] + "x").style.visibility = "visible";
			} catch{}
		}
	}

	for (i = 0; i < s.length; i++) {
		s[i].src = skillImages[i].src
	}

	if (conj && !isConjDone) { // 컨정션시 아이콘 변경
		s[conjuctedShape].src = CskillImages[conjuctedShape].src;
		c[conjuctedShape].style.visibility = "hidden";
	} 

	if (!isReadingStar && celestialSlots.length == 1) { // 별읽기
		isReadingStar = true;
		isConjDone = false;
		keySlots = [];
		for (let i = 0; i < c.length; i++) {
			c[i].style.visibility = "visible";
		}
		document.querySelector(".timeBar").style.animationPlayState = "paused";
		document.getElementById("reset").style.display = "none";
		clearInterval(interval);
		fillSlot(5, function () {
			for (let i = 0; i < c.length; i++) {
				c[i].style.visibility = "hidden";
			}
			restartTimer();
			isReadingStar = false;
			document.getElementById("reset").style.display = "inline-block";
		});
	}
	drawShapes();
}

function gameOver() {
	if (document.getElementById("notimer").checked == true) {
		return;
	}
	playSound(deathSFX);
	playSound(voiceLines[getRandomInt(6,9)]);
	duringGame = false;
	document.querySelector(".gameMessage").classList.remove("gameStart");
	document.querySelector(".gameMessage").classList.add("gameOver");
	document.querySelector(".scoreResult").innerText = '점수:' + score*10;
	document.querySelector(".portrait img").src = "./assets/Adina_wat.png";
}

/*

const numCircles = 7;
const circleRadius = 60;
const circleSpacing = 5;

const numSquares = 4;
const squareSize = 80;
const squareSpacing = 10;


function drawShapes() { // 버튼 셋업과 좌표 선정
	const canvasWidth = canvas.width;
	const canvasCenter = canvasWidth / 2;
	const totalWidthC = (numCircles * circleRadius * 2) + ((numCircles - 1) * circleSpacing);
	const totalWidthS = (numSquares * squareSize) + ((numSquares - 1) * squareSpacing);

	// 바탕원
	for (let i = 0; i < numCircles; i++) {
		const startX = (canvasWidth - totalWidthC) / 2;
		const x = startX + (i * (circleRadius * 2 + circleSpacing) + circleRadius);
		const y = canvas.height * 0.45;
		// 화살표
		if (i == 1) {
			ctx.drawImage(arrowImage, x - circleRadius, y - circleRadius, circleRadius * 2, circleRadius * 2)
		} else {
			ctx.drawImage(circleImage, x - circleRadius, y - circleRadius, circleRadius * 2, circleRadius * 2);
		}
	}
	// 별자리
	for (let i = 0, indexi = 0; i < celestialSlots.length + 1; i++, indexi++) {
		if (i == 1) {
			i++;
		}
		const startX = (canvasWidth - totalWidthC) / 2;
		const x = startX + (i * (circleRadius * 2 + circleSpacing) + circleRadius);
		const y = canvas.height * 0.45;
		let c = celestialSlots.map(item => orbs.indexOf(item));
		try {
			ctx.drawImage(celesImage[c[indexi]], x - circleRadius, y - circleRadius, circleRadius * 2, circleRadius * 2);
		} catch {
			break;
		}

	}

	// 하단 스킬 이미지
	for (let i = 0; i < numSquares; i++) {
		const startX = (canvasWidth - totalWidthS) / 2;
		const x = startX + (i * (squareSize + squareSpacing));
		const y = canvas.height * 0.8 - (squareSize / 2);
		ctx.drawImage(skillImages[i], x, y, squareSize, squareSize);
	}

	//상단 버튼 목록
	for (let i = 0; i < keySlots.length; i++) {
		const x = 100 + ((i + 1) * (squareSize + squareSpacing));
		const y = canvas.height * 0.2 - (squareSize / 2);
		ctx.drawImage(skillImages[keyList.indexOf(keySlots[i])], x, y, squareSize, squareSize);
	}
}
*/