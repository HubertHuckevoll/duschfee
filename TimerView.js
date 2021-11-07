class TimerView
{
  constructor()
  {
    this.squeak = null;
  }

  show()
  {
    document.getElementById('prefsSceneLink').className = "tab";
    document.getElementById('timerSceneLink').className = "tab timerSceneLinkActive";

    document.getElementById('prefsScene').style.display = "none";
    document.getElementById('timerScene').style.display = "block";
  }

  draw(time)
  {
    if (this.squeak != null)
    {
      this.squeak.stop();
      this.squeak = null;
    }

    time = time * 60 * 1000;
    var t = new Date(time);
    var tm = t.getMinutes();
    var ts = t.getSeconds();
    if (tm.toString().length < 2) tm = "0" + tm.toString();
    if (ts.toString().length < 2) ts = "0" + ts.toString();

    document.getElementById('time').style.color = 'white';
    document.getElementById('tm').textContent = tm;
    document.getElementById('ts').textContent = ts;

    document.getElementById('startStop').className = "startButton";
  }

  onStart()
  {
    document.getElementById('startStop').className = "stopButton";
  }

  tick(tm, ts, finalMinuteMode, timerOverrun)
  {
    var s = new Speech();

    if (ts == 0)
    {
      if (tm > 1)
      {
        s.speak(tm.toString() + ' Minutes');
      }
      else if (tm === 1)
      {
        s.speak('One Minute');
      }
    }

    if ((tm == 0) && (ts <= 60) && (ts >= 0) && (!timerOverrun))
    {
      switch(finalMinuteMode)
      {
        case 'beep':
          if (this.squeak == null)
          {
            this.squeak = new Squeak();
          }
          this.squeak.beep();
        break;

        case 'countdown':
          s.speak(ts);
        break;
      }
    }

    if (tm.toString().length < 2) tm = "0" + tm.toString();
    if (ts.toString().length < 2) ts = "0" + ts.toString();

    var tc = 'white';
    if (timerOverrun) tc = 'red';

    document.getElementById('time').style.color = tc;
    document.getElementById('tm').textContent = tm;
    document.getElementById('ts').textContent = ts;
  }

  timeIsUp()
  {
    this.squeak = new Squeak();
    this.squeak.start();
  }

}
