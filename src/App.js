import React, { Component } from 'react';
import './App.css';

import Axios from 'axios';
import Pusher from 'pusher-js'

class App extends Component {
  componentDidMount () {
    const pusher = new Pusher('a8ee0fa5cc66b88f3a48', {
      cluster: 'us2',
      forceTLS: true
    });
    let component = this
    const channel = pusher.subscribe('my-channel');
    channel.bind('new-transaction', (data) => {
      let t = data.transaction
      let messages = document.getElementById(`messages${t.lotId}`)
      messages.innerHTML += `<div id="transaction${t.id}">${t.participant} is pushing</div>`
    });
    channel.bind('transaction-canceled', (data) => {
      console.log('pusher transaction-canceled', data)
      document.getElementById(`transaction${data.transaction.id}`).innerHTML = ''
    });
    channel.bind('adquisition-confirmed', (data) => {
      console.log('pusher adquisition-confirmed', data)
      // bloquear el boton de adquirir
      let t = data.transaction
      document.getElementById(`btn${t.lotId}`).disabled = true
      // borrar lista de pusheantes
      // agregar mensaje de quien es el ganador de ese lote
      document.getElementById(`messages${t.lotId}`).innerHTML = `Comprada por ${t.participant}`
    });
  }
  startBid(lotId) {
    console.log('started', lotId)
    this.countFromFive(`timer${lotId}`)
    Axios.post('http://localhost:4000/transactions', {
      participant: document.getElementById('me').value,
      lotId: lotId
    }).then(response => { 
      document.getElementById(`myTransaction${lotId}`).value = response.data.transaction.id
      console.log('post transaction', response) 
    }).catch(err => { console.log(err) })
  }
  cancelBid(lotId) {
    console.log('canceled', lotId)
    let transactionId = document.getElementById(`myTransaction${lotId}`).value
    console.log(transactionId)
    Axios.delete(`http://localhost:4000/transactions/${transactionId}`)
    .then(response => { console.log('delete transaction', response) })
    .catch(err => { console.log(err) })
  }
  countFromFive (timerId) {
    let count = 5
    document.getElementById(timerId).innerHTML = count
    let interval = setInterval(() => {
      count--
      document.getElementById(timerId).innerHTML = count
    }, 1000)
    setTimeout(() => {
      clearInterval(interval)
      document.getElementById(timerId).innerHTML = ''
    }, 5000)
  }
  render() {
    return (
      <div className="App">
        <div>quien eres? <input id="me" type="text"/></div>
        <div className="lote">
          Lote 1 
          <button id="btn1" onMouseDown={this.startBid.bind(this, 1)} onMouseUp={this.cancelBid.bind(this, 1)}>Adquirir</button>
          <div id="timer1"></div>
          <div id="messages1"></div>
          <input id="myTransaction1" type="text" hidden/>
        </div>
        <div className="lote">
          Lote 2 
          <button id="btn2" onMouseDown={this.startBid.bind(this, 2)} onMouseUp={this.cancelBid.bind(this, 2)}>Adquirir</button>
          <div id="timer2"></div>
          <div id="messages2"></div>
          <input id="myTransaction2" type="text" hidden/>
        </div>
        <div className="lote">
          Lote 3 
          <button id="btn3" onMouseDown={this.startBid.bind(this, 3)} onMouseUp={this.cancelBid.bind(this, 3)}>Adquirir</button>
          <div id="timer3"></div>
          <div id="messages3"></div>
          <input id="myTransaction3" type="text" hidden/>
        </div>
        <div className="lote">
          Lote 4 
          <button id="btn4" onMouseDown={this.startBid.bind(this, 4)} onMouseUp={this.cancelBid.bind(this, 4)}>Adquirir</button>
          <div id="timer4"></div>
          <div id="messages4"></div>
          <input id="myTransaction4" type="text" hidden/>
        </div>
        <div className="lote">
          Lote 5 
          <button id="btn5" onMouseDown={this.startBid.bind(this, 5)} onMouseUp={this.cancelBid.bind(this, 5)}>Adquirir</button>
          <div id="timer5"></div>
          <div id="messages5"></div>
          <input id="myTransaction5" type="text" hidden/>
        </div>
      </div>
    );
  }
}

export default App;
