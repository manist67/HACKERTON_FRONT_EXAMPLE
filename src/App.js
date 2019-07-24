import React from 'react';
import Axios from 'axios';
import './App.css';

class App extends React.Component {
  state = {
    result: 0,
    op1: 0,
    op2: 0,
    log: []
  }
  
  constructor(props) {
    super(props);

    this.changeOp1 = this.changeOp1.bind(this);
    this.changeOp2 = this.changeOp2.bind(this);
  }

  componentDidMount() {
    this.getInitDataInServer();
  }

  async getInitDataInServer() {
    const { log } = this.state;
    let server;

    try {
      server = await Axios.get('http://localhost:8080/math')

    } catch(e) {
      console.log(e);
      alert("서버에서 데이터를 불러올 수 없습니다!");
      return;
    }
    server.data.forEach(value => {
      log.push(value.expression + " = " + value.result);
    });

    this.setState({log});
  }

  changeOp1(event) {
    this.setState({op1: event.target.value})
  }
    
  changeOp2(event) {
    console.log(event.target.value);
    this.setState({op2: event.target.value});
  }

  calculate (url) {
    return async () => {
        const { op1, op2, log } = this.state;
        try {
          this.validator(op1, op2);
        } catch (e) {
          alert("입력값을 확인해주세요!");
          return;
        }
    
        let server;
        try {
          server = await Axios.post(url, {
            op1, op2
          });
    
        } catch(e) {
          console.log(e);
          alert("서버를 확인해주세요!");
          return;
        }
        
        log.push(server.data.expression + " = " + server.data.result);
        this.setState({result: server.data.result, log});
    }
  }
  
  validator(op1, op2) {
    parseFloat(op1);
    parseFloat(op2);
  }
  
  render() {
    return (
      <div className="App">
        <div className="calculator-wrapper">
          <p>
            <label htmlFor="result">계산 결과</label>
            <input type="text" id="result" readOnly={true} value={this.state.result}/>
          </p>
          <p>
            <label htmlFor="op1">입력값 1</label>
            <input type="text" id="op1" className="op1" value={this.state.op1} onChange={this.changeOp1}/>
          </p>
          <p>
            <label htmlFor="op2">입력값 2</label>
            <input type="text" id="op2" className="op2" value={this.state.op2} onChange={this.changeOp2}/>
          </p>
          <div className="handler-wrapper">
            <button onClick={this.calculate("http://localhost:8080/math/add")}>+</button>
            <button onClick={this.calculate("http://localhost:8080/math/minus")}>-</button>
            <button onClick={this.calculate("http://localhost:8080/math/multiply")}>*</button>
            <button onClick={this.calculate("http://localhost:8080/math/divide")}>/</button>
            <button onClick={this.calculate("http://localhost:8080/math/moduler")}>%</button>
          </div>
        </div>
        <div className="log">
          <p className="log-label">
            계산 로그
          </p>
          {this.state.log.map((value, idx) => {
              return (
                <p key={`log-${idx}`}>{value}</p>
              )
          })}
        </div>
      </div>
    );
  }
}

export default App;
