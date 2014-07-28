app.factory('dAudio', function() {

  var audio = {

    audioElement: null,

    play: function()
    {
      audio.audioElement = document.querySelector('#audioPlayer');
      audio.audioElement.volume = 1;
      audio.audioElement.loop = true;
      audio.audioElement.src = './sound/alarm.ogg';

      audio.audioElement.addEventListener('canplay', function() {
        audio.audioElement.play();
      }, false);

      document.body.appendChild(audio.audioElement);
      audio.audioElement.play();

    },

    stop: function()
    {
      if (audio.audioElement != null) {
        audio.audioElement.pause();
        audio.audioElement.currentTime = 0;
        audio.audioElement.src = './sound/silence.ogg';
      }
    }
  };

  return audio;
});
