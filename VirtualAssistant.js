class VirtualAssistant {

  constructor(name, activate_phrase, commands){
    this.name = name
    this.activate_phrase = activate_phrase
    //VoiceIndex, rate, pitch, volume
    this.voice = new ComputerVoice(5, 1, 1, 1)

    this.state = 'OFF'
    //States: off, sleeping, activated, searching

    //A list of the commands your assistant can complete
    this.commands = commands

    this.inputs = []


    //voice input handler...
    this.voice.recognition.onresult = (event) => {

      let data = event.results[event.resultIndex][0].transcript.toLowerCase().trim()
      this.inputs.push(data)
      console.log(data)

      switch(this.state){
        case 'SLEEPING':
          this.sleeping()
          break;

        case 'ACTIVATED':
          this.activated()
          break;

        case 'SEARCHING':
          this.voice.speak('Hold on, I\m still completing your last command')
          break
        default:
          console.log("something is wrong...")
      }
    }

  }


  //Start your assistant (let them listen for your phrase)
  startAssisting(){
    if(this.state == 'OFF' ){
      this.state = 'SLEEPING'
      this.voice.startRecognition()
    }
  }


  //Stop your assistant from listening to you
  stopAssisting(){
    if(this.state != 'OFF'){
      this.state = 'OFF'
      this.voice.stopRecognition()
    }
  }

  stopTalking(){
    //this.state = 'SLEEPING'
    this.voice.stopSpeaking()
  }


  //Listen to command, if it is our activation phrase then wake up
  sleeping(){
    if(this.lastInput() == this.activate_phrase.toLowerCase()){
      this.voice.speak(`Hello, I am ${this.name}, how may I help you?`)
      this.state = 'ACTIVATED'
    }
  }

  //Check if the next command is approved...
  //Approved based on what your assistant can do...
  activated(){
    let foundCommand = false
    for(let i = 0; i < this.commands.length; i++){

      if(this.lastInput() == this.commands[i].text.toLowerCase().trim()){
        this.commands[i].action(this.lastInput())
        this.state = 'SLEEPING'
        foundCommand = true
        break;
      }
    }

    if(this.lastInput() == 'go to sleep'){

      this.voice.speak('Okay, I need a nap.')
      this.state = 'SLEEPING'
      foundCommand = true
    }else if(!foundCommand){

      this.voice.speak('Sorry I haven\'t been programmed to do that.')
      this.voice.speak('I can complete the following commands: ')

      for(let i = 0; i < this.commands.length; i++){
        this.voice.speak(this.commands[i].text)
      }
      this.voice.speak('I am going to sleep now')

      this.state = 'SLEEPING'
    }

  }

  lastInput(){
    return this.inputs[this.inputs.length - 1]
  }

}
