"use strict";

class Timer {

  constructor(prefs)
  {
    this.onStart = null;
    this.onTick = null;
    this.onTimeIsUp = null;
    this.onStop = null;

    this.st = null;
    this.prefs = prefs;

    this.tid = null;

    this.isRunning = false;
  }

  toggle()
  {
    if (this.isRunning == true)
    {
      this.stop();
    }
    else
    {
      this.start();
    }
  }

  start()
  {
    this.isRunning = true;
    this.onStart();

    this.st = this.prefs.time * 60 * 1000 + 1000; // 1 Tick extra so we hear the time for the first minute
    this.tick();
  }

  tick()
  {
    this.timeout(1).then(() =>
    {
      this.st = this.st - 1000;

      var t = new Date(this.st);
      var tm = t.getMinutes();
      var ts = t.getSeconds();

      this.onTick(tm, ts, this.prefs.finalMinuteMode, false);

      if (this.st > 0)
      {
        this.tick();
      }
      else
      {
        this.onTimeIsUp();
        this.tickOverrun();
      }
    });
  }

  tickOverrun()
  {
    this.timeout(1).then(() =>
    {
      this.st = this.st + 1000;

      var t = new Date(this.st);
      var tm = t.getMinutes();
      var ts = t.getSeconds();

      this.onTick(tm, ts, this.prefs.finalMinuteMode, true);
      this.tickOverrun();
    });
  }

  stop()
  {
    this.isRunning = false;

    if (this.tid !== null)
    {
      clearTimeout(this.tid);
      this.tid = null;
    }

    this.st = 0;
    this.onStop(this.prefs.time);
  }

  timeout(s)
  {
    return new Promise((resolve) =>
    {
      this.tid = setTimeout(resolve, (s * 1000));
    });
  }
}
