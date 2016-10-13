/* CONSTANTS */

const GAMEBOARD = [ "start", 
    "red", "purple", "yellow", "blue", "orange", "green", "red", "purple", "plumpy", "yellow", 
    "blue", "orange", "green", "red", "purple", "yellow", "blue", "mint", "orange", "green", 
    "red", "purple", "yellow", "blue", "orange", "green", "red", "purple", "yellow", "blue", 
    "orange", "green", "red", "purple", "yellow", "blue", "orange", "green", "red", "purple", 
    "yellow", "blue", "jolly", "orange", "green", "red", "purple", "yellow", "blue", "orange", 
    "green", "red", "purple", "yellow", "blue", "orange", "green", "red", "purple", "yellow", 
    "blue", "orange", "green", "red", "purple", "yellow", "blue", "orange", "nut", "green", 
    "red", "purple", "yellow", "blue", "orange", "green", "red", "purple", "yellow", "blue", 
    "orange", "green", "red", "purple", "yellow", "blue", "orange", "green", "red", "lolly", 
    "purple", "yellow", "blue", "orange", "green", "red", "frostine", "purple", "yellow", "blue", 
    "orange", "green", "red", "purple", "yellow", "blue", "orange", "green", "red", "purple", 
    "yellow", "blue", "orange", "green", "red", "purple", "yellow", "blue", "orange", "green", 
    "red", "purple", "yellow", "blue", "orange", "green", "red", "purple", "yellow", "blue", 
    "orange", "green", "red", "purple" ]

const SHORTCUTS = { 5 : 59, 34 : 47 };
const PENALTIES = [ 48, 80, 121 ];
const MASTER_DECK = [ "red", "red", "red", "red", "red", "red", 
               "red red", "red red", "red red", "red red", 
               "orange", "orange", "orange", "orange", "orange", "orange", 
               "orange orange", "orange orange", "orange orange", 
               "yellow", "yellow", "yellow", "yellow", "yellow", "yellow", 
               "yellow yellow", "yellow yellow", "yellow yellow", "yellow yellow", 
               "green", "green", "green", "green", "green", "green", 
               "green green", "green green", "green green", 
               "blue", "blue", "blue", "blue", "blue", "blue", 
               "blue blue", "blue blue", "blue blue", "blue blue", 
               "purple", "purple", "purple", "purple", "purple", "purple", 
               "purple purple", "purple purple", "purple purple", "purple purple", 
               "plumpy", "mint", "jolly", "nut", "lolly", "frostine" ];

/* GLOBAL VARIABLES */
var players = []; // 2-4 players
var deck = [];
var discards = [];

function addPlayer(color, name) {
    var player = { "name" : name, "color" : color, "space" : 0, "stuck?" : false };
    return player;
}

/* Gameplay */

function play() {
    initializeGame();
    
    var endofgame = false;
    var current_player = 0;
    
    while (!endofgame) {
        takeTurn(current_player);
        
        if (isGameOver(current_player)) {
            endofgame = true;
        } else {
            current_player = ( current_player + 1 ) % players.length;
        }
    }
    
    $('#' + players[current_player]["color"] + "-crown").removeClass('hide');
    $('#messages p').text( players[current_player]["name"] + " wins!" );
}

function initializeGame() {
    deck = shuffle(MASTER_DECK.slice());
    players = [];
    $('.winner img').each(function() {
        $(this).addClass('hide');
    });
    $('.player-name').each(function() {
        if( !$(this).parent().hasClass( 'hide' ) ) {
            players.push( addPlayer( $(this).attr("name"), $(this).val() ) );
        }
    });
    
    // Randomize turn order
    players = shuffle(players);
}

function isGameOver(player) {
    // If the player has reached the end of the board
    if (players[player]["space"] == GAMEBOARD.length - 1) {
        return true;
    }
    return false;
}

function drawCard() {
    // If the deck is not empty
    if (deck.length > 0) {
        return deck.shift();
    } else {
        deck = shuffle(MASTER_DECK.slice());
        discards = [];
        return deck.shift();
    }
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle
  while (0 !== currentIndex) {

    // Pick an element
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function takeTurn( player_id ) {
    card = drawCard(); // draw a card
    discards.push( card );
    // move player
    var moves = [];
    
    if (card.indexOf(" ") === -1 ) {
        moves.push(card);
    } else {
        moves = card.split(" ");
    }
    var newSpace = players[player_id]["space"];
    // Check if the player is able to move based on their draw
    if ( !players[player_id]["stuck?"] || ( players[player_id]["stuck?"] && unstuck(players[player_id]["space"], moves[0], player_id)) ) {
        players[player_id]["stuck?"] = false;
        for (var i = 0; i < moves.length; i++) {
            newSpace = getNewSpace(newSpace, moves[i]);
            players[player_id]["space"] = newSpace;
        }
        
        // If the space is a shortcut, move to the end of the shortcut
        if ( players[player_id]["space"] in SHORTCUTS ) {
            players[player_id]["space"] = SHORTCUTS[players[player_id]["space"]];
        // If the space is a penalty, change stuck? to true
        } else if ( PENALTIES.indexOf(players[player_id]["space"]) > -1 ) {
            players[player_id]["stuck?"] = true;
        }
    } else {
        
    }
}

function unstuck(space, card, player_id) {
    // If the card drawn matches the penalty space, return true
    if (GAMEBOARD[space] == card) {
        return true;
    } else {
        return false;
    }
}

function getNewSpace(oldSpace, move) {
    if ( ["red", "orange", "yellow", "green", "blue", "purple"].indexOf(move) > -1 ) {
        checkForSpace = oldSpace + 1;
        foundNewSpace = false;
        while (!foundNewSpace) {
            // if the space being checked is the correct color
            if ( GAMEBOARD[checkForSpace] == move ) {
                foundNewSpace = true;
                return checkForSpace;
            // if you reach the end without finding a space to move to, move to the last space instead
            } else if ( checkForSpace >= GAMEBOARD.length - 1) {
                return checkForSpace;
            // no match, check the next space
            } else {
                checkForSpace += 1;
            }
        }
    } else {
        return GAMEBOARD.indexOf(move);
    }
}