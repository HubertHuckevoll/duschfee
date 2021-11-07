"use strict";

class Duschfee
{
  constructor()
  {
    this.timer = null;
    this.options = null,
    this.nSleep = null;
    this.wakeLockEnabled = false;
    this.fTabs = null;
    this.fSlider = null;

    this.tV = null;
    this.pV = null;
  }

  init()
  {
    // install our service worker - we are basically an "offline only" app
    if ('serviceWorker' in navigator)
    {
      navigator.serviceWorker.register('/duschfee/DuschfeeSW.js');
    }

    // initiate custom elements
    window.customElements.define('formo-slider', FormoSlider);
    window.customElements.define('formo-tabbox', FormoTabbox);

    this.tV = new TimerView();
    this.pV = new PrefsView();

    this.nSleep = new NoSleep();
    this.options = new Options();

    // On Tab Change
    document.getElementById('navTabs').addEventListener("formoTabChange", this.onTabChange.bind(this));

    // Timer Scene
    document.getElementById("startStop").addEventListener("click", this.toggleTimer.bind(this));

    // Prefs Scene
    document.getElementById("prefTime").addEventListener("formoSliderChange", this.prefTime.bind(this));
    document.getElementById("prefFinalMinuteMode").addEventListener("change", this.prefFinalMinuteMode.bind(this));

    // Stop on device movement
    window.ondeviceorientation = this.orientationChanged.bind(this);

    // Load Options
    this.options.onLoad = this.optionsLoaded.bind(this);
    this.options.load();
  }

  optionsLoaded(prefs)
  {
    this.tV.draw(prefs.time); // make sure we init the ui with the current shower time
    this.pV.draw(prefs);

    this.timer = new Timer(prefs);
    this.timer.onStart = this.tV.onStart;
    this.timer.onTick = this.tV.tick;
    this.timer.onTimeIsUp = this.tV.timeIsUp;
    this.timer.onStop = this.tV.draw;
  }

  onTabChange(ev)
  {
    var nTabName = ev.detail.nTab.getAttribute('tab');
    if ((nTabName == 'prefsTab') || (nTabName == 'aboutTab'))
    {
      this.timer.stop();
    }
  }

  toggleTimer()
  {
    if (this.wakeLockEnabled === false)
    {
      this.nSleep.enable(); // keep the screen on!
      this.wakeLockEnabled = true;
    }
    else
    {
      // this is also called in orientationChanged
      this.nSleep.disable(); // allow the screen to turn off.
      this.wakeLockEnabled = false;
    }

    this.timer.toggle();
  }

  orientationChanged(ev)
  {
    var lage = parseInt(ev.beta);
    if (lage > 150)
    {
      this.timer.stop();
      this.nSleep.disable(); // allow the screen to turn off.
      this.wakeLockEnabled = false;
    }
  }

  prefTime(ev)
  {
    this.options.setTime(ev.detail.value);
    this.options.load();
  }

  prefFinalMinuteMode(ev)
  {
    var e = document.getElementById('prefFinalMinuteMode');
    var val = e.options[e.selectedIndex].value;
    this.options.setPref('finalMinuteMode', val);
    this.options.load();
  }

};

var app = new Duschfee();
window.addEventListener("DOMContentLoaded", app.init.bind(app));
