app.factory('speech', function() {

  var speech = {
    pitch:  1,
		rate:   1.5,
		vol:    1,
		lang:   "de-DE",

    speak: function(txt)
    {
      if(window.speechSynthesis != 'undefined')
      {
				var ssu = new SpeechSynthesisUtterance(txt);
				var voices = window.speechSynthesis.getVoices();
        ssu.voice = voices[10];
        ssu.voiceURI = "native";
        ssu.lang = "de-DE";
				ssu.pitch = 1;
				ssu.rate = 1.5;
				ssu.volume = 1;
				window.speechSynthesis.speak(ssu);
        ssu = null;
      }
    }
  }

  return speech;
});
