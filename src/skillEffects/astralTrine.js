function astralTrine(pressedKey) {
  const astralTrineElement = document.createElement('img');

  if (pressedKey == 'conj_w') {
    astralTrineElement.src = WskillEffect[3];
  } else if (celestialSlots[1] == 'sun') {
    astralTrineElement.src = WskillEffect[0];
  } else if (celestialSlots[1] == 'moon') {
    astralTrineElement.src = WskillEffect[1];
  } else if (celestialSlots[1] == 'star') {
    astralTrineElement.src = WskillEffect[2];
  }


  astralTrineElement.classList.add('astralTrine');

  const spritesElement = document.querySelector('.sprites');
  spritesElement.appendChild(astralTrineElement);
  
  sleep(1000).then(() => {
    astralTrineElement.remove();
  });
}