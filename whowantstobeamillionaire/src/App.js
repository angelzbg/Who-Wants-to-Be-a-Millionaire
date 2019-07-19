import React from 'react';
import logo from './logo.svg';
import './App.css';

class App extends React.Component {

  constructor(){
    super()
    this.state = {
      gameState: 0, // 0 =  not started, 1 = started, 2 = ended
      round: 0,
      question: "",
      rightAnswer: "",
      answers: [],
      rightAnswerIndex: 999,
      selectedAnswer: 999,
      isAnswerSelected: false,
      difficulty: "",
      category: "",
      jokerInfo: ["A)", "B)", "C)", "D)"],
      jokerAvailable: [false, false, false],
      isJokerInUse: false,
      jokerMessage: "",
      buttonsVisibility: [true, true, true, true],
      moneyByRound: [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000]
    }

    this.startGame = this.startGame.bind(this)
    this.nextQuestion = this.nextQuestion.bind(this)
    this.shuffleQuestions = this.shuffleQuestions.bind(this)
    this.selectAnswer = this.selectAnswer.bind(this)
    this.useJoker = this.useJoker.bind(this)
  } // end constructor()

  render(){

    let buttonsStyle = {
      width: "45vw",
      height: "6vw",
      backgroundColor: "#c4ebf9",
      fontSize: "1.5vw"
    }

    return (
      <div className="App">
        <header className="App-header">
          Who Wants to Be a Millionaire?
          <img src={logo} className="App-logo" alt="logo" />

          {
            this.state.gameState === 1
            ?
            <div>
              {
                this.state.jokerAvailable[0]
                ?
                <button onClick={() => this.useJoker(0)}>50/50</button>
                :
                this.props.textOrHtml
              }

              {
                this.state.jokerAvailable[1]
                ?
                <button onClick={() => this.useJoker(1)}>Audience</button>
                :
                this.props.textOrHtml
              }

              {
                this.state.jokerAvailable[2]
                ?
                <button onClick={() => this.useJoker(2)}>Friend</button>
                :
                this.props.textOrHtml
              }
            </div>
            :
            this.props.textOrHtml
          }

        </header>
        {
          this.state.gameState !== 0 ?
          <div>

            <h3 style={{color: "black"}}>Category: <b>{this.state.category} ({this.state.difficulty})</b></h3>
            <h2>{this.state.question}</h2>
            <h4 style={{color: "#242424"}}>A question for {this.state.moneyByRound[this.state.round-1]}$</h4>

            {
              this.state.gameState === 1 && this.state.isJokerInUse
              ?
                <h5>{this.state.jokerMessage}</h5>
              :
              this.props.textOrHtml
            }

            {
              this.state.buttonsVisibility[0] ? 
              <button style={buttonsStyle} onClick={() => this.selectAnswer(0)}>A) {this.state.answers[0]}</button>
              : this.props.textOrHtml
            }

            {
              this.state.buttonsVisibility[1] ? 
              <button style={buttonsStyle} onClick={() => this.selectAnswer(1)}>B) {this.state.answers[1]}</button>
              : this.props.textOrHtml
            }
            <br/>

            {
              this.state.buttonsVisibility[2] ? 
              <button style={buttonsStyle} onClick={() => this.selectAnswer(2)}>C) {this.state.answers[2]}</button>
              : this.props.textOrHtml
            }

            {
              this.state.buttonsVisibility[3] ? 
              <button style={buttonsStyle} onClick={() => this.selectAnswer(3)}>D) {this.state.answers[3]}</button>
              : this.props.textOrHtml
            }
            <br/>

            {
              this.state.gameState === 2 && this.state.rightAnswerIndex !== this.state.selectedAnswer && this.state.round === 1
              ?
              <div><br/>You won 0$</div>
              :
              this.props.textOrHtml
            }
            
            {
              this.state.gameState === 2 && this.state.rightAnswerIndex !== this.state.selectedAnswer && this.state.round > 1
              ?
              <div><br/>You won <font style={{color: "green", fontSize: "3vmin"}}>{this.state.moneyByRound[this.state.round-2]}$</font></div>
              :
              this.props.textOrHtml
            }

            {
              this.state.gameState === 2 && this.state.rightAnswerIndex === this.state.selectedAnswer
              ?
              <div><br/>You won <font style={{color: "green", fontSize: "4vmin"}}>{this.state.moneyByRound[this.state.round-1]}$</font></div>
              :
              this.props.textOrHtml
            }

            {
              this.state.gameState === 1 && this.state.round <= 15 && this.state.isAnswerSelected
              ?
              <div><br/><button style={{width: "20vmin", height: "5vmin", fontSize: "2vmin"}} onClick={this.nextQuestion}>Next Question</button></div>
              :
              this.props.textOrHtml
            }

          </div>
          :
          this.props.textOrHtml
        }

        <br/>

        {
          this.state.gameState !== 1 ? <button style={{width: "20vmin", height: "5vmin", fontSize: "2vmin"}} onClick={this.startGame}>NEW GAME</button> : this.props.textOrHtml
        }
  
      </div>
    )
  } // end render()

  startGame(){
    this.setState({
      gameState: 1, // started
      jokerAvailable: [true, true, true],
      rightAnswerIndex: 999,
      selectedAnswer: 999,
      isAnswerSelected: false,
      round: 0
    })

    this.nextQuestion()
  } // end startGame()

  nextQuestion(){
    let round = this.state.round
    let apiURL = ""
    if(round < 5) {
      apiURL = "https://opentdb.com/api.php?amount=1&difficulty=easy&type=multiple"
    } else if(round < 10) {
      apiURL = "https://opentdb.com/api.php?amount=1&difficulty=medium&type=multiple"
    } else {
      apiURL = "https://opentdb.com/api.php?amount=1&difficulty=hard&type=multiple"
    }

    fetch(apiURL)
      .then(response => response.json())
      .then(data => this.setState({
        rightAnswer: data.results[0].correct_answer,
        answers: data.results[0].incorrect_answers,
        question: data.results[0].question,
        difficulty: data.results[0].difficulty,
        category: data.results[0].category,
        rightAnswerIndex: 999,
        selectedAnswer: 999,
        isAnswerSelected: false,
        round: this.state.round+1,
        isJokerInUse: false,
        jokerMessage: "",
        buttonsVisibility: [true, true, true, true]
      }))
      .then(this.shuffleQuestions)
  } // end nextQuestion()
  
  shuffleQuestions(){
    const randomNumber = Math.floor(Math.random() * 4) + 1
    let shuffledAnswers = this.state.answers
    shuffledAnswers.splice(randomNumber-1, 0, this.state.rightAnswer)
    this.setState({
      rightAnswerIndex: randomNumber-1,
      answers: shuffledAnswers
    })
    console.log("Right answer: " + this.state.rightAnswer/* + "\nIndex: " + this.state.rightAnswerIndex*/)
  } // end shuffleQuestions()

  selectAnswer(index){
    if(!this.state.isAnswerSelected && this.state.gameState === 1 && this.state.round <= 15){
      if(this.state.rightAnswerIndex === index){
        this.setState({
          totalMoney: this.state.totalMoney + this.state.moneyByRound[this.state.round-1],
          selectedAnswer: index,
          isAnswerSelected: true
        })
        if(this.state.round === 15){
          this.setState({
            gameState: 2
          })
        }
      } else {
        this.setState({
          selectedAnswer: index,
          gameState: 2,
          isAnswerSelected: true
        })
      }
    }
  } // end selectedAnswer()

  useJoker(jokerIndex){
    this.state.jokerAvailable.splice(jokerIndex, 1, false) // премахваме жокера
    this.setState({isJokerInUse: true})

    if(jokerIndex === 0){ // 50/50
      switch(this.state.rightAnswerIndex){ // премахваме 2 грешни отговора
        case 1:
        case 2:
          this.state.buttonsVisibility.splice(0, 1, false)
          this.state.buttonsVisibility.splice(3, 1, false)
          break
        default: // 0 и 3 - първи и четвърти въпрос
          this.state.buttonsVisibility.splice(1, 1, false)
          this.state.buttonsVisibility.splice(2, 1, false)
      }
    } else {
      let message = ""
      if(jokerIndex === 1){ // audience (трябва да даде верен отговор до 70% вярност каквото и да значи това)
        const randomNumber = Math.floor(Math.random() * 100) + 1
        message = "The audience think the right answer is "
        if(randomNumber <= 70){
          this.setState({jokerMessage: message + this.state.jokerInfo[this.state.rightAnswerIndex]})
        } else {
          const randomIndex = Math.floor(Math.random() * 4)
          this.setState({jokerMessage: message + this.state.jokerInfo[randomIndex]})
        }
      } else if(jokerIndex === 2){ // friend - дава случаен отговор, без да му пука, понеже е приятел :D
        const randomIndex = Math.floor(Math.random() * 4)
        message = "Your friend thinks the right answer is "
        this.setState({jokerMessage: message + this.state.jokerInfo[randomIndex]})
      }
    }
  }
} // end App{}

export default App;