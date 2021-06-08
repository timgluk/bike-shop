function createColorName() {
  const checks = document.querySelectorAll('.section-product__form__box-color__input');

  checks.forEach((check) => {
    if (check.checked === true) {
      const span = document.querySelector('.section-product__box-size__title__color');
      span.innerText = `Цвет: ${check.getAttribute('dataColor')}`;
    }
  });
}

async function getResponse() {
  let products = await fetch('/assets/products/products.json');
  products = await products.json();

  const code = +window.location.search.split('=')[1];
  const product = products.find((item) => item.code === code);

  const img = document.querySelector('.section-product__img');
  img.src = `/assets/products/${product.picture}`;

  const title = document.querySelector('.section-product__title');
  title.innerText = product.name;

  const vendor = document.querySelector('.section-product__vendor');
  vendor.innerText = `Артикул: ${product.code}`;

  const price = document.querySelector('.section-product__price');
  if (product.discount === 0) {
    price.innerText = ` RUB ${product.price}.00`;
    price.id = 'price';
  } else {
    price.id = 'price';
    price.className = 'section-product__price section-grid-items__price-through';
    price.innerText = ` RUB ${product.price}.00`;
    const discountPrice = document.createElement('span');
    discountPrice.className = 'section-product__price';
    discountPrice.innerText += ` RUB ${Math.round(product.price * (1 - product.discount / 100))}.00`;
    price.after(discountPrice);
  }

  const description = document.querySelector('.section-product__description');
  description.innerText = product.description;

  if (product.sizes.length >= 1) {
    const sizeBox = document.createElement('div');
    sizeBox.className = 'section-product__form__box-size';
    sizeBox.innerHTML = '<span class="section-product__box-size__title">Размер</span>';
    const select = document.createElement('select');
    select.className = 'section-product__select';
    select.name = 'size';
    sizeBox.append(select);
    const option = document.createElement('option');
    const arr = product.sizes;
    for (let i = 0; i < arr.length; i++) {
      option.innerHTML = arr[i];
      select.append(option.cloneNode(true));
    }
    document.querySelector('.section-product__form').prepend(sizeBox);
  }

  if (product.colors.length >= 1) {
    const colorsBox = document.createElement('div');
    colorsBox.className = 'section-product__box-color';

    const spanColor = document.createElement('span');
    spanColor.className = 'section-product__box-size__title__color section-product__box-size__title';
    colorsBox.prepend(spanColor);

    const arrColors = product.colors;

    for (let i = 0; i < arrColors.length; i++) {
      const label = document.createElement('label');
      const checked = (i === 0) ? 'checked' : '';
      label.className = 'section-product__form__box-color__label';
      label.innerHTML = `<input class="section-product__form__box-color__input" ${checked} dataColor="${arrColors[i].name}" name="color" value="${arrColors[i].value}" type="radio">
      <span class="section-product__form__box-color__input__border" style="background-color: ${arrColors[i].value}"></span>`;
      colorsBox.append(label.cloneNode(true));
    }

    document.querySelector('.section-product__amount').before(colorsBox);

    createColorName();
  }
}

document.addEventListener('click', createColorName);

getResponse();

const arrBasket = JSON.parse(localStorage.getItem('arrBasket')) ?? [];

function getFormValues(event) {
  event.preventDefault();
  const obj = {};
  const sizeValue = document.querySelector('.section-product__select');
  const vendor = document.querySelector('.section-product__vendor').innerHTML;
  const [vendorName, vendorNumber] = vendor.split(' ');
  const img = document.querySelector('.section-product__img');
  const title = document.querySelector('.section-product__title');
  const price = document.getElementById('price');
  const color = [...document.querySelectorAll('.section-product__form__box-color__input')];
  obj.price = +price.innerText.replace(/[a-z\s]/gi, '');
  obj.title = title.innerText;
  obj.img = img.src;
  obj.vendor = +vendorNumber;
  obj.size = sizeValue == null ? null : sizeValue.value;
  obj.color = color.length === 0 ? null : color.filter((elem) => elem.checked === true)[0].getAttribute('dataColor');
  obj.number = +document.forms[0].number.value;

  let flag = false;

  for (let i = 0; i < arrBasket.length; i++) {
    if (arrBasket[i].vendor === obj.vendor
      && arrBasket[i].size === obj.size
      && arrBasket[i].color === obj.color) {
      arrBasket[i].number += obj.number;
      flag = true;
      break;
    }
  }

  if (flag === false) {
    arrBasket.push(obj);
  }
  localStorage.setItem('arrBasket', JSON.stringify(arrBasket));

  const basketValue = document.querySelector('.header__svg__text');
  basketValue.innerHTML = arrBasket.reduce((accumulator, numberValue) => {
    return accumulator + numberValue.number;
    }, 0);

  console.log(arrBasket);
  console.log(obj);
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.section-product__form');
  form.addEventListener('submit', getFormValues);
  const basketValue = document.querySelector('.header__svg__text');
  basketValue.innerHTML = arrBasket.reduce((accumulator, numberValue) => {
    return accumulator + numberValue.number;
    }, 0);
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

//Модальное окно корзины
document.addEventListener('DOMContentLoaded', () => {
  const basketModalCloseButton = document.querySelector('.basket-modal__content__button-close');

  const basketModalLink = document.querySelector('.header__svg__link');
  basketModalLink.addEventListener('click', function(event) {
    if ( window.innerWidth > 768 ) {
      event.preventDefault();
      const visually = document.querySelector('.basket-modal');
      visually.style.display = 'flex';
      basketModalCloseButton.style.animation = "rotate 1s"; 
    } else {
      basketModalLink.href = '/basket.html';
    }
  });

  basketModalCloseButton.addEventListener('click', function() {
    const visually = document.querySelector('.basket-modal');

    visually.style.display = 'none';
  });

  const sumNumberValue = document.querySelector('.basket-modal__content__sum');

  // Функция общей суммы
  function getSumTotal() {
    const total = arrBasket.map(item => item.price * item.number).reduce(function (sum, current) {
    return sum + current;
    }, 0);
    return total;
  };
  console.log(getSumTotal);

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

    counter.addEventListener('keydown', function(e) {
      if (e.code === 'Enter') {
        arrBasket[i].number = counter.value;
        sumNumberValue.innerHTML = `RUB ${getSumTotal()}.00`;
        console.log(getSumTotal);
      }
    });

    buttonMinus.onclick = function() {
      this.nextElementSibling.stepDown();
      arrBasket[i].number = +counter.value;
      localStorage.setItem('arrBasket', JSON.stringify(arrBasket));
      sumNumberValue.innerHTML = `RUB ${getSumTotal()}.00`;
      console.log(arrBasket);
      console.log(getSumTotal);
    };

    buttonMinus.after(counter);

    const buttonPlus = document.createElement('button');
    buttonPlus.className = 'basket-modal__content__button-plus';
    buttonPlus.innerHTML = '+';

    buttonPlus.onclick = function() {
      this.previousElementSibling.stepUp();
      arrBasket[i].number = +counter.value;
      localStorage.setItem('arrBasket', JSON.stringify(arrBasket));
      sumNumberValue.innerHTML = `RUB ${getSumTotal()}.00`;
      console.log(arrBasket);
      console.log(getSumTotal);
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
      sumNumberValue.innerHTML = `RUB ${getSumTotal()}.00`;
    });
  }

  sumNumberValue.innerHTML = `RUB ${getSumTotal()}.00`;
});
