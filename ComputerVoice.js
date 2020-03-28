/*
  This is a wrapper class to more easily use Web Speech Recognition & Synthesis
  While already simple, this will initialize and clean things up.
*/
class ComputerVoice{

  constructor(voiceIndex = 1, rate = 1, pitch = 1, volume = 1){
    this.hasSynthesis = 'speechSynthesis' in window
    this.hasRecognition = 'webkitSpeechRecognition' in window

    //Initialize Synthesis
    if(this.hasSynthesis){
      this.voices = []
      this.voiceSettings = {
        rate: rate,
        pitch: pitch,
        volume: volume,
        index: voiceIndex
      }
      this.adjustVoiceSettings(voiceIndex, volume, rate, pitch)

      this.populateVoiceList().then( data => {
        this.voices = data
      })

    }
    else
      console.log('Speech Synthesis is not supported in this browser')

    //Initialize Recognition
    if(this.hasRecognition){
      this.recognition = new webkitSpeechRecognition()
      this.recognition.continuous = true
    }
    else
      console.log('Speech Recognition is not supported in this browser')
  }


  // get the built in list of voices
  populateVoiceList(){
    return new Promise( (resolve, reject) => {
      let data = speechSynthesis.getVoices()
      if(data.length === 0)
        setTimeout(() => {resolve( this.populateVoiceList())}, 150)
      else
        resolve(data)
    })
  }


  //Start listening to audio
  startRecognition(buttonId){
    this.recognition.start()
    if(buttonId){
      document.getElementById(buttonId).disabled = true
    }
  }


  //Stop listening to audio
  stopRecognition(buttonId){
    this.recognition.stop()
    if(buttonId){
      document.getElementById(buttonId).disabled = false
    }
  }


  //If async results are desired.....
  getRecognitionResult = () => new Promise((resolve, reject) =>{

    computerPerson.recognition.onresult = (event) => {
      if( !computerPerson.recognition.continuous)
        this.stopRecognition()

      let recognized = {
        text: event.results[event.resultIndex][0].transcript.toLowerCase().trim(),
        confidence: event.results[event.resultIndex][0].confidence
      }
      console.log(recognized)
      resolve(recognized)
    }

  })

  //Adjust the voice parameters
  adjustVoiceSettings(index = 1, volume=1, rate=1, pitch=1){
    this.voiceSettings.index = index
    this.voiceSettings.volume = volume; // 0 to 1
    this.voiceSettings.rate = rate; // 0.1 to 10
    this.voiceSettings.pitch = pitch; //0 to 2
  }


  //Start speech synthesis
  speak(string){
    let speaker = new SpeechSynthesisUtterance()
    speaker.text = string

    speaker.voice = this.voices[this.voiceSettings.index]
    speaker.voice.pitch = this.voiceSettings.pitch
    speaker.voice.rate = this.voiceSettings.rate
    speaker.voice.volume = this.voiceSettings.volume



    window.speechSynthesis.speak(speaker)
    speaker.onstart = () => {
      let event = new CustomEvent('Speaking', {detail: string})
      document.dispatchEvent(event)
    }

    speaker.onend = () => {
      let event = new CustomEvent('DoneSpeaking', {detail: string})
      document.dispatchEvent(event)
    }

  }


  //Stop all speech Synthesis
  stopSpeaking(){
    window.speechSynthesis.cancel()
  }

}
