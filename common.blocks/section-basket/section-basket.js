const arrBasket = JSON.parse(localStorage.getItem('arrBasket')) ?? [];
console.log(arrBasket);

function addItemsInBasket() {
  const basketNumber = document.querySelector('.header__svg__text');
  basketNumber.innerHTML = arrBasket.reduce((accumulator, numberValue) => {
    return accumulator + numberValue.number;
  }, 0);
}

for (let i = 0; i < arrBasket.length; i++) {
  const productBox = document.createElement('div');
  productBox.className = 'section-basket__product__product-details';
  productBox.innerHTML = `
  <img class="section-basket__product__product-details__img" src="${arrBasket[i].img}" alt="#">
  <div class="section-basket__product__product-details__description">
    <h3 class="section-basket__product__product-details__description__title">${arrBasket[i].title}</h3>
    <span class="section-basket__product__product-details__description__price">RUB ${arrBasket[i].price}.00</span>
  </div>`;

  document.querySelector('.section-basket__product__title').after(productBox);

  if (arrBasket[i].size != null) {
    const size = document.createElement('span');
    size.className = 'section-basket__product__product-details__description__size';
    size.innerText = `Размер: ${arrBasket[i].size}`;
    document.querySelector('.section-basket__product__product-details__description__price').after(size);
  }

  if (arrBasket[i].color != null) {
    const color = document.createElement('span');
    color.className = 'section-basket__product__product-details__description__color';
    color.innerText = `Цвет: ${arrBasket[i].color}`;
    document.querySelector('.section-basket__product__product-details__description').append(color);
  }

  const counter = document.createElement('input');
  Object.assign(counter, {
    className: 'section-basket__product__product-details__counter',
    type: 'number',
    pattern: '[0-9]*',
    max: '99',
    min: '1',
    value: arrBasket[i].number,
  });

  document.querySelector('.section-basket__product__product-details__description').after(counter);

  const price = document.createElement('span');
  price.className = 'section-basket__product__product-details__price';
  price.innerText = `RUB ${arrBasket[i].price * counter.value}.00`;
  counter.after(price);

  const buttonDell = document.createElement('input');
  buttonDell.className = 'section-basket__product__product-details__button';
  buttonDell.type = 'button';
  buttonDell.id = 'button';
  price.after(buttonDell);

  const label = document.createElement('label');
  label.setAttribute('for', 'button');
  label.className = 'section-basket__product__product-details__label';
  label.innerHTML = `<svg class="section-basket__product__product-details__description__delete__svg" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor">
                    <path fill-rule="evenodd" d="M11.077 0L12 .923 6.923 6 12 11.077l-.923.923L6 6.923.923 12 0 11.077 5.076 6 0 .923.923 0 6 5.077 11.077 0z"></path>
                    </svg>`;
  buttonDell.after(label);

  const spanStyle = document.createElement('span');
  spanStyle.className = 'section-basket__product__product-details__label__span-style';
  label.prepend(spanStyle);

  buttonDell.addEventListener('click', () => {
    arrBasket.splice(productBox.remove(), 1);
    localStorage.setItem('arrBasket', JSON.stringify(arrBasket));
    addItemsInBasket();
  });

  counter.onclick = () => {
    price.innerText = `RUB ${arrBasket[i].price * counter.value}.00`;
    arrBasket[i].number = +counter.value;
    localStorage.setItem('arrBasket', JSON.stringify(arrBasket));
    addItemsInBasket();
  };
}

addItemsInBasket();

function addValues() {
  const allPrices = document.querySelectorAll('.section-basket__product__product-details__price');
  let totalSum = 0;
  for (let i = 0; i < allPrices.length; i++) {
    totalSum += +allPrices[i].innerText.replace(/[a-z\s]/gi, '');
  }
  console.log(totalSum);
  return totalSum;
}

const sumNumberValue = document.querySelector('.order-details__box-sum__sum-number');
sumNumberValue.innerHTML = `${addValues()}.00`;
const totalSum = document.querySelector('.order-details__box-sum__total-sum');
totalSum.innerHTML = `${addValues()}.00`;

const div = document.querySelector('.section-basket__product');
const clickInput = div.querySelectorAll('input');
clickInput.forEach((elem) => elem.addEventListener('click', () => {
  sumNumberValue.innerHTML = `${addValues()}.00`;
  totalSum.innerHTML = `${addValues()}.00`;
}));

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