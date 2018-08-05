var main;
var difficultyLevel;
var firstCard;
var time;
var moves;
var cardsToMatch;
var cardTimeout = undefined;
var gameTimer = undefined;
var animationsToPlay = 0;
            
            
window.onload = function() {
	document.getElementById("btnEnter").onclick = enterGame;
	document.getElementById("btnSaveName").onclick = saveName;
	document.getElementById("btnLevel1").onclick = prepareGame;
	document.getElementById("btnLevel2").onclick = prepareGame;
	document.getElementById("btnNewGame").onclick = newGame;
	document.getElementById("cards").onclick = cardSelected;
	document.getElementById("btnPlayAgain").onclick = playAgain;
	document.getElementById("btnExit").onclick = exitMemory;
}
            
function enterGame() {
    main = document.getElementById("pagesContainer");	
    main.className = "sec_name";
}
            
function saveName() {
    var input = document.querySelector("#name");
    if (input.value.length == 0) {
    var alert = document.getElementById("name");
    alert.className = "alert"; 
    return;
    }

    var span = document.getElementById("new_name");
    span.textContent = input.value;
    main.className = "sec_begin";
    
    span = document.getElementById("score_name");
    itspan.textContent = input.value;
}
            
            
function prepareGame(event) {
    difficultyLevel = parseInt(event.target.dataset.level);		// pobieram liczbę par kart, więc stopień trudności
    document.getElementById("cards").className = "difficulty" + difficultyLevel;
    
    var n;
    var i;
    n = difficultyLevel;
    time = 0;
    moves = 0;
    cardsToMatch = difficultyLevel;
    firstCard = undefined;
				
    if (cardTimeout != undefined) {
        window.clearTimeout(cardTimeout);	
        cardTimeout = undefined;
    }
    
    if (gameTimer != undefined) {
        window.clearInterval(gameTimer);
        gameTimer = undefined;
    }
				
    var cardDeck = [];
    while(n > 0) {
        cardDeck.push(n);
        cardDeck.push(n);
        n--;
        }
    
    var shuffle = [];
    while(cardDeck.length > 0) {
        i = Math.floor(Math.random() * cardDeck.length);
        shuffle.push(cardDeck[i]);
        cardDeck.splice(i, 1);
        }
    
    var cardsList = document.getElementById("cards");
    cardsList.innerHTML = "";
				
    
    // elementy tablicy są numerowane od zera
    for (i = 0; i < shuffle.length; i++) {
        var newCard = document.createElement("img");
        newCard.setAttribute("src", "images/pair" + shuffle[i] + ".png");
                             
        var span = document.createElement("span");
        span.setAttribute("data-pair", shuffle[i]);
        
        span.appendChild(newCard);			// wkładam obrazek do karty żeby zakryć rewers
        cardsList.appendChild(span);		// kładę kartę na stole
		}
    
    // w tym momencie time = 0 i moves = 0
    showScore();
    
    // i na koniec pokazujemy ekran gry
    playGame();
}
			
			
function playGame() {
    main.className = "sec_cards";
	}			
            
            
function newGame() {
    main.className = "sec_begin";
}
            
function playAgain() {
    main.className = "sec_begin";
}
            
function exitMemory() {
    main.className = "sec_exit";
}
			
function updateTimer() {
    time++;
    showScore();
}
            
function showScore() {
    var value = document.querySelector("#gameMoves .value");
    value.innerHTML = moves;
    
    value = document.querySelector("#gameTime .value");
    value.innerHTML = time;
    
    value = document.querySelector("#scoreMoves .value");
    value.innerHTML = moves;
    
    value = document.querySelector("#scoreTime .value");
    value.innerHTML = time;
}

            
function cardSelected(event) {
    var card = undefined;
    
    if (event.target.tagName.toLowerCase() == 'img') {
        card = event.target.parentNode;		// rodzicem IMG jest SPAN
    } else {
        if (event.target.tagName.toLowerCase() == 'span') {
            card = event.target;			// nie kliknieto na obrazek tylko na "kartę"
        } else {
            return;		
        }
    }
    
    if ((firstCard == card) || (cardTimeout != undefined)) {
        return;
    }
	
	if (animationsToPlay > 0) {
		// animacja nadal trwa
		return;
	}
    
    if (firstCard == undefined) {
        firstCard = card;
        firstCard.className = "awers";
        
        if (gameTimer == undefined) {
            gameTimer = window.setInterval(updateTimer, 1000);		// zmieniamy wartość stopera co sekundę
        }
    } else {
        // pierwsza karta już została wybrana, więc to jest druga
        card.className = "awers";
        cardTimeout = window.setTimeout(areCardsTheSame, 250, card);
        moves++;
        showScore();
    }
}

function areCardsTheSame(secondCard) {
    window.clearTimeout(cardTimeout);
    cardTimeout = undefined;
    
    if (firstCard.dataset.pair == secondCard.dataset.pair) {
        firstCard.style.visibility = "hidden";
        secondCard.style.visibility = "hidden";
        cardsToMatch--;
    } else {
        var img = firstCard.children[0];
		
		animationsToPlay = 2;
		
        img.addEventListener("animationend", hideCardsAnimationListener, false);
        
        img = secondCard.children[0];
        img.addEventListener("animationend", hideCardsAnimationListener, false);
        
        firstCard.className = "rewers";
        secondCard.className = "rewers";
    }
    
    firstCard = undefined;
    
    if (cardsToMatch == 1) {
        window.clearInterval(gameTimer);
        gameTimer = undefined;
        
        // skoro została ostatnia para to już wiadomo że są tylko dwie karty z ostatniej pary
        // więc nie ma sensu zmuszać gracza do przejścia przez jeszcze jedną turę
        main.className = "sec_score"; 
        
        // dzisiejsza data
        var date = new Date();
        var day = date.getDate();
        var month = date.getMonth() + 1;	// miesiące są numerowane od 0
        
        if (day < 10) {
            day = '0' + day;
        }
        
        if (month < 10) {
            month = '0' + month;
        }
        
        var today = date.getFullYear() + '-' + month + '-' + day;
        document.querySelector("#scoreDate .value").innerHTML = today;
    }
}


function hideCardsAnimationListener(event) {
    event.target.parentNode.className = "";
	animationsToPlay--;
}

 (function(d, s, id) {
		  var js, fjs = d.getElementsByTagName(s)[0];
		  if (d.getElementById(id)) return;
		  js = d.createElement(s); js.id = id;
		  js.src = 'https://connect.facebook.net/pl_PL/sdk.js#xfbml=1&version=v3.1';
		  fjs.parentNode.insertBefore(js, fjs);
		}(document, 'script', 'facebook-jssdk'));
	
	
window.twttr = (function(d, s, id) {
		  var js, fjs = d.getElementsByTagName(s)[0],
			t = window.twttr || {};
		  if (d.getElementById(id)) return t;
		  js = d.createElement(s);
		  js.id = id;
		  js.src = "https://platform.twitter.com/widgets.js";
		  fjs.parentNode.insertBefore(js, fjs);

		  t._e = [];
		  t.ready = function(f) {
	