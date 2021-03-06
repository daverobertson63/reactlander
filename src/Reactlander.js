/*
 Copyright (c) 2010, Jason Brown
 Copyright (c) 2016 chriz001 https://github.com/chriz001/Reacteroids
 Copyright (c) 2017 Dave Robertson 
 
 Permission is hereby granted, free of charge, to any person
 obtaining a copy of this software and associated documentation
 files (the "Software"), to deal in the Software without
 restriction, including without limitation the rights to use,
 copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the
 Software is furnished to do so, subject to the following
 conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 OTHER DEALINGS IN THE SOFTWARE.

*/

import React, { Component } from 'react';
import Utilities from './Utilities';
import Vector from './Vector';
import Lander from './Lander';
import Terrain from './Terrain';
import Sky from './Sky';

import { randomNumBetweenExcluding } from './helpers'

const KEY = {
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  DOWN: 40,
  A: 65,
  D: 68,
  W: 87,
  X: 88,
  R: 82,
  SPACE: 32
};

export class Reactlander extends Component {

  constructor() {
    super();
    this.state = {
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      },
      context: null,
      keys: {
        left: 0,
        right: 0,
        up: 0,
        down: 0,
        space: 0,
        reset: 0
      },

      currentScore: 0,
      topScore: localStorage['topscore'] || 0,
      inGame: false,

      gravity: 2.2,
      zoom: 1,
      zx: 0,
      zy: 0,
      beginGame: false
    }

    // Current message stack to be rendered - not implemented yet
    this.messages = [];

    this.utilities = new Utilities();
    this.newlines = [];
    this.expLines = [];

    this.curTime = (new Date()).getTime();
    this.deltaTime = (this.curTime - this.lastTime) / 100;
    this.lastTime = this.curTime;

    this.power = Math.pow(2, Math.ceil(Math.log(this.state.screen.width) / (Math.log(2))));

    this.lander = [];
    this.terrain = [];
    this.sky = [];


  }

  handleResize(value, e) {
    this.setState({
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      }
    });
  }

  handleKeys(value, e) {

    let keys = this.state.keys;

    if (e.keyCode === KEY.LEFT || e.keyCode === KEY.A) keys.left = value;
    if (e.keyCode === KEY.RIGHT || e.keyCode === KEY.D) keys.right = value;
    if (e.keyCode === KEY.UP || e.keyCode === KEY.W) keys.up = value;
    if (e.keyCode === KEY.DOWN || e.keyCode === KEY.X) keys.down = value;
    if (e.keyCode === KEY.R) keys.reset = value;

    if (e.keyCode === KEY.SPACE) keys.space = value;
    this.setState({
      keys: keys
    });
  }

  componentDidMount() {
    window.addEventListener('keyup', this.handleKeys.bind(this, false));
    window.addEventListener('keydown', this.handleKeys.bind(this, true));
    window.addEventListener('resize', this.handleResize.bind(this, false));

    const context = this.refs.canvas.getContext('2d');
    this.setState({ context: context });
    console.log('component did mount: ' + context);
    // Mark the game as started - we gp straight into it
    this.startGame();
    requestAnimationFrame(() => { this.update() });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleKeys);
    window.removeEventListener('resize', this.handleKeys);
    window.removeEventListener('resize', this.handleResize);
  }

  // Main update - will upate all game elements
  update() {

    const context = this.state.context;
    const keys = this.state.keys;

    // The game has completed - crash or whatever - so terminate the update loop 
    if (!this.state.inGame)
    {
      console.log('Update Loop Terminated');
      return;
    }
    // Controls - reset the lander - keep the same terrain and off we go.
    if (keys.reset) {
      this.lander.reset(this.state);
    }

    this.curTime = (new Date()).getTime();
    this.deltaTime = (this.curTime - this.lastTime) / 100;
    this.lastTime = this.curTime;

    context.save();

    context.scale(this.state.screen.ratio, this.state.screen.ratio);

    // Draw and update the terrain
    this.terrain.draw(this.state);

    // Update the lander postion and so on 
    this.lander.update(this.state, this.deltaTime);
    // Draw the lander in its current state
    this.lander.draw(context);
    // Update the sky
    this.sky.draw(this.state);

    if (this.lander.checkCrashed()) {
      this.lander.reset(this.state);
      this.gameOver();
      return;
    }

    if (this.lander.checkLanded()) {
      this.state.currentScore = this.lander.getScore();
      console.log(this.state.currentScore);
      this.gameOver();
      return;
    }

    // Render messages
    for (var  i = 0; i < this.messages.length; i++) {
      this.messages[i].render(this.state.context);
    }

    context.restore();

    // Next frame
    requestAnimationFrame(() => { this.update() });
  }

  addScore(points) {
    if (this.state.inGame) {
      this.setState({
        currentScore: this.state.currentScore + points,
      });
    }
  }

  // Start game - create the objects needed 
  startGame() {

    console.log("Starting a new game");

    this.setState({
      inGame: true,
      currentScore: 0,
    });

    this.terrain = new Terrain(this.state, this.state.screen.width, this.state.screen.height, this.power);
    this.sky = new Sky(this.state.screen.width, this.terrain);
    this.lander = new Lander(this.width, this.height, this.terrain);
    
    requestAnimationFrame(() => {this.update()});

  }

  gameOver() {

    //this.terrain.reset();

    this.setState({
      inGame: false,
    });
  console.log("CurrentScore in GameOver: " + this.state.currentScore);
    this.terrain = null;
    this.lander=null;
    this.sky=null;

    // Replace top score
    if (this.state.currentScore > this.state.topScore) {
      this.setState({
        topScore: this.state.currentScore,
      });
      localStorage['topscore'] = this.state.currentScore;
    }
  }



  // Render will be called when there is a change of state
  render() {

    //console.log("React Render called to display");
    let endgame;
    let message;

    
    if (this.state.currentScore <= 0) {
      message = 'No points';
    } else if (this.state.currentScore >= this.state.topScore) {
      message = 'Top score with ' + this.state.currentScore ;
    } else {
      
      message = this.state.currentScore + ' Points'
    }
    
    if (!this.state.inGame) {
      endgame = (
        <div className="endgame">
          <p>Lunar Lander Game over!</p>
          <p>{message}</p>
          <button
            onClick={this.startGame.bind(this)}>
            try again?
          </button>
        </div>
      )
    }

    return (
      <div>
        { endgame }
        <span className="score current-score" >Lander Telemetry</span>  
        <span className="score top-score" >Top Score: {this.state.topScore}</span>
        <span className="controls" >
          Use [A][S][W][D] or [←][↑][↓][→] to MOVE<br/>
          Use [SPACE] to BOOST
        </span>
        <canvas ref="canvas"
          width={this.state.screen.width * this.state.screen.ratio}
          height={this.state.screen.height * this.state.screen.ratio}
        />
      </div>
    );
  }
}


// Helper canvas function for rendering bitmap fonts http://random.abrahamjoffe.com.au
CanvasRenderingContext2D.prototype.drawString = function (s, f, x, y) {
  y = Math.round(y);
  var z = x = Math.round(x), t, i, j;
  if (!f.f) {
    f.f = [t = 0], i = 0, j = f.w.length;
    while (++i < j) f.f[i] = t += f.w[i - 1];
  }
  s = s.split(''), i = 0, j = s.length;
  while (i < j) if ((t = f.c.indexOf(s[i++])) >= 0)
    this.drawImage(f, f.f[t], 0, f.w[t], f.height, x, y, f.w[t], f.height), x += f.w[t];
  else if (s[i - 1] == '\n') x = z, y += f.h;
}

var arial12 = new Image();
arial12.src = 'data:image/png;base64,' +
  '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' +
  'SGGknosAAAAASUVORK5CYII='; // paste your data url string here
arial12.c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789!@#$%^&*()-=[]\\;\',./_+{}|:"<>?`~';
arial12.w = [9, 9, 8, 9, 9, 4, 9, 8, 4, 3, 8, 3, 13, 8, 9, 9, 9, 5, 8, 4, 8, 7, 11, 7, 7, 7, 11, 11, 12, 12, 11, 10, 12, 11, 3, 8, 11, 9, 13, 11, 12, 11, 12, 11, 11, 9, 11, 11, 15, 11, 9, 9, 4, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 5, 16, 9, 9, 14, 7, 11, 6, 5, 5, 5, 9, 4, 4, 4, 4, 3, 4, 4, 4, 9, 9, 5, 5, 3, 4, 6, 9, 9, 9, 5, 9];
arial12.h = 19;

