import React, { Component } from 'react';
import { render } from 'react-dom';
import {Motion, StaggeredMotion, TransitionMotion, spring} from 'react-motion';
import Hello from './Hello';
import './style.css';
import Animated from 'animated/lib/targets/react-dom';
import Easing from 'animated/lib/Easing';
import { VelocityComponent } from 'velocity-react';

const VelocityLetter = ({ letter }) => (
  <VelocityComponent
    runOnMount
    animation={{ opacity: 1, marginTop: 0 }} // 重写值，下面的 style 为初始值
    duration={500}
  >
    <p style={styles.letter}>{letter}</p > 
  </VelocityComponent>
)

class App extends Component {
  constructor() {
    super();
    this.state = {
      name: 'React',
      height: 38, 
      items: [{key: 'a', size: 0}, {key: 'c', size: 100}], 
      letters: [],
    };
  }

  componentDidMount() {
    this.setState({
      items: [{key: 'a', size: 100}], // remove c.
    });
  }

  animatedValue = new Animated.Value(0);

  animated = () => { // Animated
    this.animatedValue.setValue(0);

    Animated.timing( // 所谓的配置对象
      this.animatedValue,
      {
        toValue: 1,
        duration: 1000,
        easing: Easing.elastic(1),
      }
    ).start();
  }

  willLeave = () => {
    // triggered when c's gone. Keeping c until its width/height reach 0.
    return {width: spring(0), height: spring(0)};
  }

  animate = () => {
    this.setState((state) => ({ height: state.height === 245 ? 38 : 245 }));
  }

  onChange = (e) => { // velocity
    const letters = e.target.value.split('');
    const arr = [];

    letters.forEach((l, i) => {
      arr.push(<VelocityLetter letter={l} />)
    });
    this.setState({ letters: arr });
  }

  render() {
    const marginLeft = this.animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [-120, 0],
    });
    return (
      <div>
        <Hello name={this.state.name} />
        <p>
          Start editing to see some magic happen :)
        </p >
        <div className='showTransition'>transition 小试牛刀</div><div></div>
        <div className='animationBorderTest'>
          TestBorder
        </div>
        <div className='transition styleClass'>
          <div>CSS transition</div>
          <div>CSS transition</div>
          <div>CSS transition</div>
          <div>CSS transition</div>
          <div>CSS transition</div>
        </div>
        <div className='transitionTransformTest'>
          Z
        </div>
        <div className="App">
          <div style={styles.button} onClick={this.animate}>React Motion Animate</div>
          <Motion
            style={{ height: spring(this.state.height, {stiffness: 100, damping: 100}) }} // presets
            // 如果把我们要设置动画的物体想象成弹簧，stiffness相当于弹簧的强度，其影响的是弹簧回弹的速度，
            // 相同damping情况下，stiffness越大，回弹速度越快；
            // damping是弹簧的减震性，其影响的是弹簧的回弹次数，相同stiffness情况下，damping越大，回弹次数越少
          >
            {
              ({ height }) => // 回调函数
              <div style={Object.assign({}, styles.menu, { height } )}>
                <p style={styles.selection}>Selection 1</p >
                <p style={styles.selection}>Selection 2</p >
                <p style={styles.selection}>Selection 3</p >
                <p style={styles.selection}>Selection 4</p >
                <p style={styles.selection}>Selection 5</p >
                <p style={styles.selection}>Selection 6</p >
              </div>
            }
          </Motion>
        </div>
        <StaggeredMotion // 联动 （浅蓝色）
          defaultStyles={[{h: 0}, {h: 0}, {h: 0}]} // 初始值
          styles={prevInterpolatedStyles => prevInterpolatedStyles.map((_, i) => {
            return i === 0
              ? {h: spring(100, {stiffness: 50, damping: 10})} // ⬅️调节速度和回弹
              : {h: spring(prevInterpolatedStyles[i - 1].h)}
          })}>
          {interpolatingStyles =>
            <div style={{position: 'relative', overflow: 'hidden'}}>
              {interpolatingStyles.map((style, i) => // 回调函数
                <div key={i} style={{border: '1px solid', height: style.h, margin: '15px 15px 15px 0',
                width: 100, float: 'left', background: '#8DD4FD'}} />)
              }
            </div>
          }
        </StaggeredMotion>
        <TransitionMotion // 进出场（深蓝色）
          willLeave={this.willLeave} 
          styles={this.state.items.map(item => ({
            key: item.key,
            style: {width: spring(item.size), height: spring(item.size)},
          }))}>
          {interpolatedStyles =>
            // first render: a, b, c. Second: still a, b, c! Only last one's a, b. 
            <div>
              {interpolatedStyles.map(config => {
                return <div key={config.key} style={{...config.style, border: '1px solid',
                background: '#4788CC', marginTop: 10}} />
              })}
            </div>
          }
        </TransitionMotion>

        <div style={{marginTop: 20}} >
          <div style={styles.button} onClick={this.animated}>Animated</div>
          <Animated.div
            style={{ opacity: this.animatedValue, marginLeft }}
          >
            <p>Thanks for your submission!</p >
          </Animated.div>
        </div>

        <div className="App">
          <div className="container">
            <input onChange={this.onChange} style={styles.input} />
            <div style={styles.letters}>
              {
                this.state.letters
              }
            </div>
          </div>
        </div>
        <svg version="1.1" style={{height: 500, width: 500}}>
          <path id="lineAB" d="M 100 350 l 150 -300" stroke="#e24e30"
          stroke-width="3" fill="none" />
          <path id="lineBC" d="M 250 50 l 150 300" stroke="#e24e30"
          stroke-width="3" fill="none" />
          <path d="M 175 200 l 150 0" stroke="#9CDCFA" stroke-width="3" fill="none" />
          <path id="circle" d="M 100 350 q 150 -300 300 0" stroke="#104870" stroke-width="3" fill="none" />
          <g stroke="black" stroke-width="3" fill="black">
            <circle id="pointA" cx="100" cy="350" r="3" />
            <circle id="pointB" cx="250" cy="50" r="3" />
            <circle id="pointC" cx="400" cy="350" r="3" />
          </g>
          <g font-size="30" font="sans-serif" fill="black" stroke="none"
          text-anchor="middle">
            <text x="100" y="350" dx="-30">A</text>
            <text x="250" y="50" dy="-10">B</text>
            <text x="400" y="350" dx="30">C</text>
          </g>
        </svg>
      </div>
    );
  }
}

const styles = {
  menu: {
    marginTop: 20,
    width: 300,
    border: '2px solid #ddd',
    overflow: 'hidden',
  },
  button: {
    display: 'flex',
    width: 200,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    border: 'none',
    borderRadius: 4,
    backgroundColor: '#ffc107',
    cursor: 'pointer',
  },
  selection: {
    margin: 0,
    padding: 10,
    borderBottom: '1px solid #ededed',
  },
  input: {
    marginBottom: 20,
    padding: 8,
    width: 200,
    height: 40,
    fontSize: 22,
    backgroundColor: '#ddd',
    border: 'none',
    outline: 'none',
  },
  letters: {
    display: 'flex',
    height: 140,
  },
  letter: {
    marginTop: 100,
    fontSize: 22,
    whiteSpace: 'pre',
    opacity: 0,
  }
}

render(<App />, document.getElementById('root'));