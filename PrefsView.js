/**
 * Prefs View
 */

class PrefsView
{

  show()
  {
    document.getElementById('timerSceneLink').className = "tab";
    document.getElementById('prefsSceneLink').className = "tab prefsSceneLinkActive";

    document.getElementById('timerScene').style.display = "none";
    document.getElementById('prefsScene').style.display = "block";
  }

  draw(prefs)
  {
    document.getElementById('prefTime').setAttribute('min', prefs.minTime);
    document.getElementById('prefTime').setAttribute('max', prefs.maxTime);
    document.getElementById('prefTime').setAttribute('value', prefs.time);
    document.getElementById('prefTime').setAttribute('step', '1');

    //document.getElementById('prefStartup').checked = prefs.startOnLaunch;

    document.getElementById('prefFinalMinuteMode').value = prefs.finalMinuteMode;
  }

};