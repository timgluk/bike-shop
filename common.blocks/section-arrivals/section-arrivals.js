async function getResponse() {
  const response = await fetch('/assets/products/products.json');
  let product = await response.json();
  product = product.slice(-3);

  const block = document.querySelector('.section-arrivals__items');
  let key;

  for (key in product) {
    block.innerHTML += 
      `<a class="section-arrivals__link" href="product.html?code=${product[key].code}">
      <img class="section-arrivals__img" src="/assets/products/${product[key].picture}">
      </a>`;
  }
}

getResponse();

const arrBasket = JSON.parse(localStorage.getItem('arrBasket')) ?? [];

document.addEventListener('DOMContentLoaded', () => {
  const basketValue = document.querySelector('.header__svg__text');
  basketValue.innerHTML = arrBasket.reduce((accumulator, numberValue) => {
    return accumulator + numberValue.number;
    }, 0);
});

document.addEventListener('DOMContentLoaded', () => {
  const urlPage = window.location.pathname.split('/')[1];
  if (urlPage === 'index.html') {
    const item = document.querySelector('.header__menu__item__link_main');
    item.style.cssText = 'color: rgb(185, 152, 103)';
  }

  const basketModalCloseButton = document.querySelector('.basket-modal__content__button-close');

  const basketModalLink = document.querySelector('.header__basket__link');
  basketModalLink.addEventListener('click', function(event) {
    event.preventDefault();
    const visually = document.querySelector('.basket-modal');
    visually.style.display = 'flex';
    basketModalCloseButton.style.animation = "rotate 1s";
  });

  basketModalCloseButton.addEventListener('click', function() {
    const visually = document.querySelector('.basket-modal');

    visually.style.display = 'none';
  });

  const sumNumberValue = document.querySelector('.basket-modal__content__sum');

  let totalSum = 0;

  for (let i = 0; i < arrBasket.length; i++) {
    const productBox = document.createElement('div');
    productBox.className = 'basket-modal__content__item';
    document.querySelector('.basket-modal__content__item-box').append(productBox);

    const img = new Image();
    img.className = 'basket-modal__content__img';
    img.src = arrBasket[i].img;
    productBox.prepend(img);

    const divBox = document.createElement('div');
    divBox.className = 'basket-modal__content__details-box';
    img.after(divBox);

    const title = document.createElement('h3');
    title.className = 'basket-modal__content__title-in-box';
    title.innerHTML = arrBasket[i].title;
    divBox.prepend(title);

    const counterBox = document.createElement('div');
    counterBox.className = 'basket-modal__content__counter-box';

    const buttonMinus = document.createElement('button');
    buttonMinus.className = 'basket-modal__content__button-minus';
    buttonMinus.innerHTML = '-';

    const price = document.createElement('span');

    counterBox.prepend(buttonMinus);

    const counter = document.createElement('input');
    Object.assign(counter, {
      className: 'basket-modal__content__counter',
      type: 'number',
      pattern: '[0-9]*',
      max: '99',
      min: '1',
      value: arrBasket[i].number,
    });

    totalSum += arrBasket[i].price * counter.value;

    buttonMinus.onclick = function() {
      this.nextElementSibling.stepDown();
      arrBasket[i].number = +counter.value;
      localStorage.setItem('arrBasket', JSON.stringify(arrBasket));
      if (counter.value > 1) {
      totalSum -= arrBasket[i].price;
      }; 
      sumNumberValue.innerHTML = `RUB ${totalSum}.00`;
      console.log(arrBasket);
      console.log(totalSum);
    };

    buttonMinus.after(counter);

    const buttonPlus = document.createElement('button');
    buttonPlus.className = 'basket-modal__content__button-plus';
    buttonPlus.innerHTML = '+';

    buttonPlus.onclick = function() {
      this.previousElementSibling.stepUp();
      arrBasket[i].number = +counter.value;
      localStorage.setItem('arrBasket', JSON.stringify(arrBasket));
      totalSum += arrBasket[i].price;
      sumNumberValue.innerHTML = `RUB ${totalSum}.00`;
      console.log(arrBasket);
      console.log(totalSum);
    };

    counter.after(buttonPlus);

    price.className = 'basket-modal__content__price';
    price.innerHTML = `RUB ${arrBasket[i].price}.00`;
    title.after(price);

    price.after(counterBox);

    const buttonDell = document.createElement('button');
    buttonDell.className = 'basket-modal__content__button-del';
    buttonDell.innerHTML = '<span class="material-icons md-18">close</span>';
    divBox.after(buttonDell);

    productBox.addEventListener('mouseenter', e => { buttonDell.style.opacity = 1; });
    productBox.addEventListener('mouseleave', e => { buttonDell.style.opacity = 0; });

    buttonDell.addEventListener('click', () => {
      arrBasket.splice(productBox.remove(), 1);
      localStorage.setItem('arrBasket', JSON.stringify(arrBasket));
      sumNumberValue.innerHTML = `RUB ${totalSum}.00`;
    });
  }
  console.log(totalSum);

  sumNumberValue.innerHTML = `RUB ${totalSum}.00`;

  const div = document.querySelector('.basket-modal__content__item-box');
  const clickInput = div.querySelectorAll('input');
  clickInput.forEach((elem) => elem.addEventListener('click', () => {
    sumNumberValue.innerHTML = `RUB ${totalSum}.00`;
    console.log(totalSum);
  }));
});


// Логика меню адаптива

document.addEventListener('DOMContentLoaded', () => {
  const navButton = document.querySelector('.header__menu-burger');
  navButton.innerHTML = `<span class="material-icons md-36">menu</span>`;
  console.log(navButton.innerText);

  const navList = document.querySelector('.header__menu-list');
  navButton.addEventListener('click', function (e) {
    if (navButton.innerText === 'menu') {
      navButton.innerHTML = `<span class="material-icons md-36">close</span>`;
      navList.style.display = 'flex';
    } else {
      navButton.innerHTML = `<span class="material-icons md-36">menu</span>`;
      navList.style.display = 'none';
    }
  });
});
