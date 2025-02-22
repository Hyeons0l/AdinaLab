/**
 * 과제) 각 스킬별 conj 조건에 맞게 이펙트 변경
 * 
 * 오늘 할 것
 * 1. 
 */

function luminary(pressedKey) {
  const luminaryElement = document.createElement('div');

 if (pressedKey =='conj_q') {
      luminaryElement.innerText = 'Qconj';
  } else if (celestialSlots[1] == 'sun') {
      luminaryElement.innerText = 'Qsun'; 
  } else if (celestialSlots[1] == 'moon') {
    luminaryElement.innerText = 'Qmoon'; 
  } else if (celestialSlots[1] == 'star') {
    luminaryElement.innerText = 'Qstar';
  }
  // }
  luminaryElement.classList.add('luminary');

  // if (conj && !isConjDone) { //코드 재활용 c
  //   if  (celestialSlots[1] == 'sun') {
  //     luminaryElement.innerText = 'Qsun';}
  //   else if (celestialSlots[1] == 'moon') {
  //     luminaryElement.innerText = 'Qmoon'; }
  //   else if (celestialSlots[1] == 'star') {
  //     luminaryElement.innerText = 'Qstar';
	// } else {
	// 	luminaryElement.innerText = 'Qconj';}
  // }

  const spritesElement = document.querySelector('.sprites');
  spritesElement.appendChild(luminaryElement);

  luminaryElement.addEventListener('animationend', () => {
    luminaryElement.remove();
  });
}