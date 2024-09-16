  class AudioVisualizer {
    constructor( audioContext, processFrame, processError ) {
      this.audioContext = audioContext;
      this.processFrame = processFrame;
      this.connectStream = this.connectStream.bind( this );
      navigator.mediaDevices.getUserMedia( { audio: true, video: false } )
        .then( this.connectStream )
        .catch( ( error ) => {
          if ( processError ) {
            processError( error );
          }
        } );
    }
  
    connectStream( stream ) {
      this.analyser = this.audioContext.createAnalyser();
      const source = this.audioContext.createMediaStreamSource( stream );
      source.connect( this.analyser );
      this.analyser.smoothingTimeConstant = 0.5;
      this.analyser.fftSize = 32;
  
      this.initRenderLoop( this.analyser );
    }
  
    initRenderLoop() {
      const frequencyData = new Uint8Array( this.analyser.frequencyBinCount );
      const processFrame = this.processFrame || ( () => {} );
  
      const renderFrame = () => {
        this.analyser.getByteFrequencyData( frequencyData );
        processFrame( frequencyData );
  
        requestAnimationFrame( renderFrame );
      };
      requestAnimationFrame( renderFrame );
    }
  }
  
  const visualMainElement = document.querySelector( 'main' );
  const micValuesElement = document.getElementById('mic-values');
  const body = document.querySelector('main');


  const visualValueCount = 16;
  let visualElements;
  const createDOMElements = () => {
    let i;
    for ( i = 0; i < visualValueCount; ++i ) {
      const elm = document.createElement( 'div' );
      visualMainElement.appendChild( elm );
    }
  
    visualElements = document.querySelectorAll( 'main div' );
  };
  createDOMElements();
  
  const init = () => {
    // Creating initial DOM elements
    const audioContext = new AudioContext();
    const initDOM = () => {
      visualMainElement.innerHTML = '';
      createDOMElements();
    };
    initDOM();
  
    const dataMap = { 0: 15, 1: 10, 2: 8, 3: 9, 4: 6, 5: 5, 6: 2, 7: 1, 8: 0, 9: 4, 10: 3, 11: 7, 12: 11, 13: 12, 14: 13, 15: 14 };

    let max_val = 0;
    const audio = new Audio('audio.mp3'); // Preload audio file
    const body = document.querySelector('body'); // Cache the body element reference
    
    const processFrame = (data) => {
      const values = Object.values(data);
      const currentValue = values[dataMap[12]]; // Extract the relevant value once
    
      if (currentValue > max_val) {
        max_val = currentValue;
        micValuesElement.innerHTML = `Max: ${max_val}`;
      }
    
      if (currentValue > 30) {
        if (!audio.isPlaying) {
          audio.play();
          audio.isPlaying = true;
        }
        if (body.style.backgroundColor !== "#ff0000") {
          body.style.backgroundColor = "#ff0000"; 
        }
      } else {
        audio.isPlaying = false;
        if (body.style.backgroundColor !== "#000") {
          body.style.backgroundColor = "#000";
        }
      }
    };
  
    const processError = () => {
      visualMainElement.classList.add( 'error' );
      visualMainElement.innerText = 'Please allow access to your microphone in order to see this demo.\nNothing bad is going to happen... hopefully :P';
    }
  
    const a = new AudioVisualizer( audioContext, processFrame, processError );
  };
