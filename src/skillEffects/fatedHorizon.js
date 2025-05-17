function fatedHorizon(pressedKey) {
const fatedHorizonElement = document.createElement('img');

   if (pressedKey == 'conj_e') {
    fatedHorizonElement.src = EskillEffect[3];
  } else if (celestialSlots[1] == 'sun') {
    fatedHorizonElement.src = EskillEffect[0];
  } else if (celestialSlots[1] == 'moon') {
    fatedHorizonElement.src = EskillEffect[1];
  } else if (celestialSlots[1] == 'star') {
    fatedHorizonElement.src = EskillEffect[2];
  }

  fatedHorizonElement.classList.add('fatedHorizon');
  
    const spritesElement = document.querySelector('.sprites');
    spritesElement.appendChild(fatedHorizonElement);
  
    sleep(1000).then(() => {
      fatedHorizonElement.remove();
    });
  }