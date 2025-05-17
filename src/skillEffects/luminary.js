function luminary(pressedKey) {
  const luminaryElement = document.createElement('img');

  if (pressedKey =='conj_q') {
    luminaryElement.src = QskillEffect[3];
  } else if (celestialSlots[1] == 'sun') {
    luminaryElement.src = QskillEffect[0]; 
  } else if (celestialSlots[1] == 'moon') {
    luminaryElement.src = QskillEffect[1];
  } else if (celestialSlots[1] == 'star') {
    luminaryElement.src = QskillEffect[2];
  }
  
  luminaryElement.classList.add('luminary');
  
  const spritesElement = document.querySelector('.sprites');
  spritesElement.appendChild(luminaryElement);

  luminaryElement.addEventListener('animationend', () => {
    luminaryElement.remove();
  });
  
}



















  /*if (conj && !isConjDone) { //코드 재활용 c
    if  (celestialSlots[1] == 'sun') {
      luminaryElement.innerText = 'Qsun';}
    else if (celestialSlots[1] == 'moon') {
      luminaryElement.innerText = 'Qmoon'; }
    else if (celestialSlots[1] == 'star') {
      luminaryElement.innerText = 'Qstar';
	} else {
		luminaryElement.innerText = 'Qconj';}
  }*/