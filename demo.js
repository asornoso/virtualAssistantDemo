let fetchDog = function(data){

    fetch('https://dog.ceo/api/breeds/image/random').then( (response) => {
      return response.json()
    }).then( (json) => {
    	console.log(json);
      myAssistant.voice.speak('I have fetched you a cool picture of a dog.')
      document.getElementById('displayImages').innerHTML = `<img src='${json.message}''/>`
      myAssistant.voice.speak('That was a lot of work, I\'m going to sleep now.')
    }).catch( (err) => {
    	console.warn(err);
      myAssistant.voice.speak('Uh oh, something went wrong.')
      myAssistant.voice.speak('That was a lot of work, I\'m going to sleep now.')
    });

}

let fetchCat = function(data){
  fetch('https://api.thecatapi.com/v1/images/search').then( (response) => {
    return response.json()
  }).then( (json) => {
    console.log(json);
    myAssistant.voice.speak('I have fetched you a cool picture of a cat.')
    document.getElementById('displayImages').innerHTML = `<img src='${json[0].url}'/>`
    myAssistant.voice.speak('That was a lot of work, I\'m going to sleep now.')
  }).catch( (err) => {
    console.warn(err);
    myAssistant.voice.speak('Uh oh, something went wrong.')
    myAssistant.voice.speak('That was a lot of work, I\'m going to sleep now.')
  });
}

let openFortnite = function(data){
  myAssistant.voice.speak('Sorry who plays fortnite anymore')
}

let tellJoke = function(data){
  fetch('https://icanhazdadjoke.com/slack').then( (response) => {
    return response.json()
  }).then( (json) => {
    console.log(json);
    myAssistant.voice.speak(json.attachments[0].text)
  }).catch( (err) => {
    console.warn(err);
    myAssistant.voice.speak('Uh oh, something went wrong.')
    myAssistant.voice.speak('That was a lot of work, I\'m going to sleep now.')
  })
  // let jokes = [
  //   'joke 1',
  //   'joke 2',
  //   'joke 3'
  // ]
  // myAssistant.voice.speak(jokes[Math.floor(Math.random()*jokes.length)])
}

let commands = [
  {
    text: 'show me a dog',
    action: fetchDog
  },
  {
    text: 'show me a cat',
    action: fetchCat
  },
  {
    text: 'play fortnite',
    action: openFortnite
  },
  {
    text: 'Tell me a joke',
    action: tellJoke
  }
]

let myAssistant = new VirtualAssistant("Demo","okay demo", commands)
myAssistant.voice.adjustVoiceSettings(4, 0.5, 0.95, 0.95)

document.getElementById('startButton').onclick= () => {
  myAssistant.startAssisting()
  console.log('starting your virtual assistant')
}

document.getElementById('stopButton').onclick= () => {
  myAssistant.stopAssisting()
  console.log('Turning off your virtual assistant')
}

document.getElementById('cancelButton').onclick = () => {
  myAssistant.stopTalking()
  console.log('cancelled all talking by your virtual assistant')
}


document.addEventListener('Speaking', (e) => {

  let animatedElement = document.getElementById('animate')
  animatedElement.innerHTML = e.detail
  animatedElement.classList.remove('removeAnimation')
  animatedElement.classList.add('animation')
  animatedElement.style.color = '#FFF'

})



document.addEventListener('DoneSpeaking', (e) => {

  let animatedElement = document.getElementById('animate')
  animatedElement.classList.remove('animation')
  animatedElement.classList.add('removeAnimation')
  animatedElement.style.color = '#00458B'

})
