"use strict";

class Squeak
{
  constructor()
  {
    this.isSqueaking = false;
    this.osci = null;
    this.audioCtx = new AudioContext();
    this.gainNode = this.audioCtx.createGain();
    this.gainNode.connect(this.audioCtx.destination);
  }

  getRandomVal(min, max)
  {
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    return num;
  }

  start()
  {
    this.osci = this.audioCtx.createOscillator();
    this.osci.connect(this.gainNode);
    this.osci.type = "sine"; // sine, square, sawtooth, triangle ?
    this.osci.frequency.value = this.getRandomVal(900, 1500); // value in hertz
    this.isSqueaking = true;
    this.osci.start();
    let duration = this.getRandomVal(5, 500);

    this.timeout(duration).then(() =>
    {
      this.osci.stop();
      if (this.isSqueaking === true) this.start();
    });
  }

  stop()
  {
    this.osci.stop();
    this.isSqueaking = false;
  }

  beep()
  {
    this.osci = this.audioCtx.createOscillator();
    this.osci.connect(this.gainNode);
    this.osci.type = "sine"; // sine, square, sawtooth, triangle ?
    this.osci.frequency.value = 1000; // value in hertz

    let currentTime = this.audioCtx.currentTime;
    this.osci.start(currentTime);
    this.osci.stop(currentTime + .1);
  }

  timeout(s)
  {
    return new Promise((resolve) =>
    {
      setTimeout(resolve, s);
    });
  }

}
