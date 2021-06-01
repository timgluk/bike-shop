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