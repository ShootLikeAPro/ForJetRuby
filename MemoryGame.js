import React, { Component } from "react";
import _ from "lodash";
import "./MemoryGame.css";
//requires lodash, react, reactDOM
//установите через npm install lodash

const uniqueCards = [
  "red",
  "green",
  "blue",
  "yellow",
  "violet",
  "pink",
  "lightblue",
  "black"
];
const numCardsToMatch = 2;

class MemoryGame extends React.Component {
  constructor() {
    super();
    this.shuffleCards = this.shuffleCards.bind(this);
    this.pickCard = this.pickCard.bind(this);
    this.addWin = this.addWin.bind(this);

    this.ignoreCardClicks = false;

    this.state = {
      cards: [],
      gamesWon: 0,
      selectedCards: [],
      gameOver: 1
    };
  }

  multiplyCards(cards, multiplier) {
    let loopTimes = multiplier - 1;
    let multiplied = cards;
    for (var i = 0; i < loopTimes; i++) {
      multiplied = _.concat(multiplied, cards);
    }

    return multiplied;
  }

  shuffleCards() {
    let multipliedCards = this.multiplyCards(uniqueCards, numCardsToMatch);
    let shuffled = _.shuffle(multipliedCards);

    
    let cards = shuffled.map(function(val) {
      return {
        type: val,
        position: "unselected"
      };
    });
    

    this.setState({
      cards: cards,
      gameOver: 0
    });
  }

  changeAllPositionsOfSelected(allCards, selectedCards, newPosition) {
    for (var v of selectedCards) {
      allCards[v].position = newPosition;
    }
    return allCards;
  }

  addWin() {
    let newGamesWon = this.state.gamesWon + 1;
    this.setState({ gamesWon: newGamesWon, gameOver: 1 });
  }

  selectedHasSameAttribute(allCards, selectedCards, attribute) {
    
    let eq = allCards[selectedCards[0]][attribute];
    for (var v of selectedCards) {
      if (allCards[v][attribute] !== eq) {
        return false;
      }
    }
    return true;
  }

  checkForMatch(curCards, curSelectedCards) {
    
    if (this.selectedHasSameAttribute(curCards, curSelectedCards, "type")) {
      curCards = this.changeAllPositionsOfSelected(
        curCards,
        curSelectedCards,
        "removed"
      );
      

      let winTest = _.reduce(
        curCards,
        function(result, value, key) {
          

          if (result === value.position) {
            return result;
          } else {
            return false;
          }
          
        },
        curCards[0].position
      );

      
      if (winTest !== false) {
        this.addWin();
      }
    } else {
      curCards = this.changeAllPositionsOfSelected(
        curCards,
        curSelectedCards,
        "unselected"
      );
    }

    
    return curCards;
  }

  pickCard(index) {
    

    if (this.ignoreCardClicks !== true) {
      let curSelectedCards = _.concat(this.state.selectedCards, index);
      let curCards = this.state.cards;

      

      curCards[curSelectedCards[curSelectedCards.length - 1]].position =
        "selected";

      if (curSelectedCards.length === numCardsToMatch) {
        this.setState({
          
          cards: curCards
        });

        let _this = this; 
        this.ignoreCardClicks = true;

        let pauseGame = setTimeout(function() {
          curCards = _this.checkForMatch(curCards, curSelectedCards);
          curSelectedCards = [];

          _this.ignoreCardClicks = false;

          _this.setState({
            selectedCards: curSelectedCards,
            cards: curCards
          });
        }, 750);
      } else {
        curCards[curSelectedCards[0]].position = "selected";

        this.setState({
          selectedCards: curSelectedCards,
          cards: curCards
        });
      }
    }
  }

  render() {
    let clickEvent = this.pickCard;
    let cardIndex = 0;
    return (
      <div className="memory-app">
        <HomeScreen
          gameOver={this.state.gameOver}
          gamesWon={this.state.gamesWon}
          clickEvent={this.shuffleCards}
        />
        <div className="cards">
          {this.state.cards.map(function(thisCard) {
            return (
              <Card
                index={cardIndex++}
                clickEvent={clickEvent}
                position={thisCard.position}
                type={thisCard.type}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

class Card extends React.Component {
  constructor() {
    super();
    this.clickMe = this.clickMe.bind(this);
  }
  clickMe() {
    
    if (this.props.position === "unselected") {
      this.props.clickEvent(this.props.index);
    } else {
      console.log("cant click me! my position is " + this.props.position);
    }
  }

  render() {
    return (
      <div
        data-index={this.props.index}
        data-cardtype={this.props.type}
        onClick={this.clickMe}
        className={
          "card card--" + this.props.type + " card--" + this.props.position
        }
      >
        <div className="card__inner">
          <div className="card__face card__front" />
          <div className="card__face card__back" />
        </div>
      </div>
    );
  }
}

class HomeScreen extends React.Component {
  constructor() {
    super();
    this.clickMe = this.clickMe.bind(this);
  }
  clickMe() {
    this.props.clickEvent(this.props.clickEvent);
  }
  render() {
    return (
      <div
        className={
          this.props.gameOver
            ? "homescreen homescreen--visible"
            : "homescreen homescreen--hidden"
        }
      >
        <div className="homescreen__box">
          <h1 className="homescreen__title">JetRuby Challenge</h1>
          <div className="homescreen__stats">
            Games Won:{" "}
            <strong className="homescreen__number">
              {this.props.gamesWon}
            </strong>
          </div>
          <button
            className="homescreen__shuffle-button "
            onClick={this.clickMe}
          >
            Start!
          </button>
        </div>
      </div>
    );
  }
}

export default MemoryGame;