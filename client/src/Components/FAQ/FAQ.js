import React, { Component } from 'react';
import './FAQ.css'
class FAQ extends Component {

    constructor(props) {
        super(props);
        this.state = {
            question: this.props.question,
            answer: this.props.answer,
            showAnswer: false
        }
        this.answerText = this.props.fund ?<div className="answer-text">We rely on donations. Please consider donating to <a href='https://www.paypal.me/parekharyaman' target='_blank'>Sync In via PayPal</a></div> : <div className="answer-text">{this.state.answer}</div>;
        this.answerToShow = <p></p>;
    }

    onClick = () => {
        let showAnswer = this.state.showAnswer;
        showAnswer = !showAnswer;
        this.setState({showAnswer: showAnswer});
        /*if (this.state.showAnswer) {
            this.answerToShow = this.answerText
        } else {
            this.answerText = <p></p>;
        }*/
    }

    render() {
        return (
            <div className='question-container'>
                <div className="question-text" onClick={this.onClick} >{this.state.question}</div>
                {this.state.showAnswer && 
                    this.answerText
                }
            </div>
        );
    }
}

export default FAQ;
