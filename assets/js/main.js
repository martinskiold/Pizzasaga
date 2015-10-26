//Körs när alla element är inladdade
$(function(){

	//Hämtar spelplan
	var canvas = $('#gameCanvas')[0];
	//Hämtar spelplanens kontext
	var context = canvas.getContext("2d");

	//Hämtar fönsterstorlek
	var screenWidth=$(window).width();
	var screenHeight=$(window).height()-50;

	//Skapar spelplan utefter fönsterstorlek
	canvas.width=screenWidth;
	canvas.height=screenHeight;


// Bakgrundsbild (svg)
var bgImage = new Image();
bgImage.src = "assets/img/background.svg";

// Bild till spelkaraktär 1 (svg)
var charSvg = new Image();
charSvg.src = "assets/img/character.svg";

// Bild till spelkaraktär 2 (png)
var charPng = new Image();
charPng.src = "assets/img/character.png";

// Pizzabild (svg)
var pizzaImg = new Image();
pizzaImg.src = "assets/img/pizza.svg";


// Spelare 1
var player1 = {
	//Spelarens hastighet per sekund
	speed: 256
};

// Spelare 2
var player2 = {
	//Spelarens hastighet per sekund
	speed: 256
};

// Storleksfaktor för respektive spelare
var player1Size = screenWidth/30;
var player2Size = screenWidth/30;

// Hållare till pizza
var pizza = {};

// Spelarnas poäng
var player1Score = 0;
var player2Score = 0;

// Gränsen då en spelare vinner
var UPPERLIMIT = 20;

// Hanterar nedtryckta knappar
var keysDown = {};

// Eventlyssnare för nedtryckning av knappar
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

// Eventlyssnare för avtryckning av knappar
addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Flyttar pizzan
var respawn = function () {
	// Flyttar pizzan någonstans inom spelplanens gränser
	pizza.x = 32 + (Math.random() * (canvas.width - 64));
	pizza.y = 32 + (Math.random() * (canvas.height - 64));
};

// Initierar spelet och dess variabler
var initiate = function (){
	// Spelare 1 får en position till höger på spelplanen
	player1.x = canvas.width - player1Size - 20;
	player1.y = (canvas.height / 2) - player1Size;

	// Spelare 2 får en position till vänster på spelplanen
	player2.x = 20;
	player2.y = (canvas.height / 2) - player2Size;

	// Pizzan skapas med en randomiserad position
	pizza.x = 32 + (Math.random() * (canvas.width - 64));
	pizza.y = 32 + (Math.random() * (canvas.height - 64));
}

// Återställer spelet
var reset = function(){
	// Återställer pizastorlekar
	player1Size = screenWidth/30;
	player2Size = screenWidth/30;

	// Återställer spelarnas poäng
	player1Score = 0;
	player2Score = 0;
}

// Uppdaterar spelarnas positioner och hastighet utifrån skärmstorleken
var update = function (modifier) {
	
	// Olika hastigheter beroende på skärmstorleken
	var screenSizeModifier;
	if(screenWidth>2500){
		screenSizeModifier = 5;
	}else if(screenWidth>1500){
		screenSizeModifier = 3;
	}else if(screenWidth>1000){
		screenSizeModifier = 2;
	}else if(screenWidth>600){
		screenSizeModifier = 1.3;
	}else{
		screenSizeModifier = 0.7;
	}

	// Spelare 1 knappar
	if (38 in keysDown) { // Spelare navigerar uppåt

		//Edge detection på spelplanens övre sida
		if(player1.y>0){
			// Flyttar spelarens position uppåt med en hastighet variabel av skärmstorleken
			player1.y -= player1.speed * modifier * screenSizeModifier;
		}
	}
	if (40 in keysDown) { // Spelare navigerar nedåt

		//Edge detection på spelplanens nedre sida
		if(player1.y+player1Size<canvas.height){
			// Flyttar spelarens position nedåt
			player1.y += player1.speed * modifier * screenSizeModifier;
		}
		
	}
	if (37 in keysDown) { // Spelare navigerar vänster

		//Edge detection på spelplanens vänstra sida
		if(player1.x>0){
			// Flyttar spelarens position åt vänster
			player1.x -= player1.speed * modifier * screenSizeModifier;
		}
	}
	if (39 in keysDown) { // Spelare navigerar höger

		//Edge detection på spelplanens högra sida
		if(player1.x+player1Size<canvas.width){
			// Flyttar spelarens position åt höger
			player1.x += player1.speed * modifier * screenSizeModifier;
		}
		
	}

	// Spelare 2 knappar
	if (87 in keysDown) { // Spelare navigerar uppåt
		if(player2.y>0){
			player2.y -= player2.speed * modifier * screenSizeModifier;
		}
	}
	if (83 in keysDown) { // Spelare navigerar nedåt
		if(player2.y+player2Size<canvas.height){
			player2.y += player2.speed * modifier * screenSizeModifier;
		}
	}
	if (65 in keysDown) { // Spelare navigerar vänster
		if(player2.x>0){
			player2.x -= player2.speed * modifier * screenSizeModifier;
		}
	}
	if (68 in keysDown) { // Spelare navigerar höger
		if(player2.x+player2Size<canvas.width){
			player2.x += player2.speed * modifier * screenSizeModifier;
		}
	}

	// Kollar ifall spelare 1 rör vid pizzan
	if (
		player1.x <= (pizza.x + screenWidth/20)
		&& pizza.x <= (player1.x + player1Size)
		&& player1.y <= (pizza.y + screenWidth/20)
		&& pizza.y <= (player1.y + player1Size)
	) {

		// Ifall spelare 1 rör vid pizzan: ljudet resettas, poäng ökas, storlek ökas och vinnande poäng kollas. Pizzan respawnar.
		$('#audio_eating').trigger('pause');
	 	$('#audio_eating').prop('currentTime',0);
		$('#audio_eating').trigger('play');

		// Poäng ökas
		++player1Score;

		// Storlek ökas
		player1Size = player1Size*1.1;

		// Kollar ifall spelare 1 har vunnit
		if(player1Score==20 && player2Score<20){

			//Renderar meddelandetext för vinnaren.
			$('#txt_gameresult').text("Player 1 wins!");
			$('#txt_feedback').text("The Vector Graphics-character wins and we can recognize that the image quality of the winning character has been maintained even though the image has been scaled. The image sharpness is not lost and no aliasing or anti-aliasing has been introduced.");
			$('#resultWrapper').show('slow');

		}

		// Flyttar pizzan
		respawn();
	}

	// Kollar ifall spelare 2 rör vid pizzan
	if (
		player2.x <= (pizza.x + screenWidth/20)
		&& pizza.x <= (player2.x + player2Size)
		&& player2.y <= (pizza.y + screenWidth/20)
		&& pizza.y <= (player2.y + player2Size)
	) {

		// Ifall spelare 2 rör vid pizzan: ljudet resettas, poäng ökas, storlek ökas och vinnande poäng kollas. Pizzan respawnar.
		$('#audio_eating').trigger('pause');
		$('#audio_eating').prop('currentTime',0);
		$('#audio_eating').trigger('play');

		++player2Score;

		player2Size = player2Size*1.1;

		if(player2Score==20 && player1Score<20){

			$('#txt_gameresult').text("Player 2 wins!");
			$('#txt_feedback').text("The Bitmap character wins and its getting clearer that the image quality is struggling as the image is being scaled. Even though new pixels has been created, the old resolution is still showing through, and there is also an added mixture of aliasing and anti-aliasing. The image has lost its sharpness.");
			$('#resultWrapper').show('slow');

		}

		respawn();
	}
};

// Eventlyssnare för klick av "Restart"-länken i vinnarmeddelandet.
$('#resultWrapper a').click(function(){

	// Spelet resettas.
	reset();

	// Nya spelet initieras.
	initiate();

	// Gömmer meddelande-popup.
	$('#resultWrapper').hide('slow');

});

// Eventlyssnare för klick av instruktions-länken.
$('#instr_link').click(function(){

	// Öppnar meddelande för instruktioner
	$('#instructionWrapper').toggle('slow');

	$('#game_instructions_header').text("Game Instructions");
	$('#game_instructions').html("This game consists of 2 hungry players with one goal: Eat pizza ASAP. <br/>Player 1 starts at right whilst Player 2 starts at left. A pizza is eaten by walking onto the pizza. <br/><br/>Player 1 controls: Arrow keys <br/> Player 2 controls: W A S D <br/><br/> First player to eat 20 pizzas wins the game. Let the games begin!");

});

// Eventlyssnare för klick av stängningslänk i instruktionsmeddelandet.
$('#instructionWrapper a').click(function(){

	// Gömmer meddelande-popup.
	$('#instructionWrapper').hide('slow');

});



// Renderar spelare med tillhörande positioner och pizza med tillhörande position.
var render = function () {
		// Ritar bakgrund på Canvas.
		context.drawImage(bgImage, 0, 0, screenWidth,screenHeight);

		// Ritar spelare 1 på Canvas.
		context.drawImage(charSvg,player1.x,player1.y,player1Size,player1Size);

		// Ritar spelare 2 på Canvas.
		context.drawImage(charPng,player2.x,player2.y,player2Size,player2Size);

		// Ritar pizza på Canvas.
		context.drawImage(pizzaImg,pizza.x,pizza.y,screenWidth/20,screenWidth/20);

			// Skriver ut varje spelares poäng
			context.fillStyle = "rgb(250, 250, 250)";
			context.font = "24px Helvetica";
			context.textBaseline = "top";

			// Skriver ut spelare 1:s poäng till höger.
			context.fillText("Player 1: " + player1Score, canvas.width-150, 32);

			// Skriver ut spelare 2:s poäng till vänster.
			context.fillText("Player 2: " + player2Score, 32, 32);
};


// Spelets loopfunktion.
var main = function () {

	//Tidpunkten just nu.
	var now = Date.now();

	//Tidsskillnaden. (För att kunna beräkna rätt mängd förflyttning i x-led och y-led med tanke på spelarnas hastigheter)
	var delta = now - then;

	//Uppdatera position med tanke på tidsskillnaden från förra förflyttning.
	update(delta / 1000);

	//Rendera spelobjekt.
	render();

	//Nu blir då - eftersom tiden från senaste förflyttning ska börja räknas.
	then = now;

	//Begär om en ny skärm att få rendera på. (icke-krävande variant av en while-loop.)
	requestAnimationFrame(main);
};


//--------"MAIN-METODEN"--------
// Hämtar fönstret.
var w = window;

// Hämtar hanteraren för webbläsaren och hämtar dennes reglerade while-loop.
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Skapar första tidsreferens.
var then = Date.now();

// initierar spelet
initiate();

// Kör spelets main-metod.
main();


});
