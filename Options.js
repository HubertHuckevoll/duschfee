"use strict";

class Options
{
  constructor()
  {
    this.onLoad = null;
    this.onSave = null;

    this.prefs = {
      startOnLaunch: true,
      time: 8,
      minTime: 1,
      maxTime: 30,
      finalMinuteMode: 'nothing' // 'nothing', 'beep', 'countdown'
    };
  }

  setPref(prop, val)
  {
    this.prefs[prop] = val;
    this.save();
  }

  getPref(prop)
  {
    return this.prefs[prop];
  }

  getPrefs()
  {
    return this.prefs;
  }

  setTime(timeVal)
  {
    var t = parseInt(timeVal);
    if (t > this.prefs.maxTime) t = this.prefs.maxTime;
    if (t < this.prefs.minTime) t = this.prefs.minTime;

    this.setPref('time', t.toString());
  }

  incTime()
  {
    var t = parseInt(this.prefs.time) + 1;
    this.setTime(t);
  }

  decTime()
  {
    var t = parseInt(this.prefs.time) - 1;
    this.setTime(t);
  }

  load()
  {
    var p = localStorage.getItem('duschfee');

    if (p !== null)
    {
      this.prefs = JSON.parse(p);
    }

    if (this.onLoad != null)
    {
      this.onLoad(this.prefs);
    }
  }

  save()
  {
    localStorage.setItem('duschfee', JSON.stringify(this.prefs));
    if (this.onSave != null)
    {
      this.onSave(this.prefs);
    }
  }
}