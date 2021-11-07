"use strict";

class Speech
{
  
  constructor()
  {
  	this.lang = "en-US";
  }
  
  speak(txt)
  {
    if (window.speechSynthesis != 'undefined')
    {
      var ssu = new SpeechSynthesisUtterance(txt);
      ssu.lang = this.lang;
      window.speechSynthesis.speak(ssu);
      ssu = null;
    }
  }

}
