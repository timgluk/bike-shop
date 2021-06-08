async function getResponse() {
  const response = await fetch('/assets/products/products.json');
  const products = await response.json();
  const block = document.querySelector('.section-grid-items');

  const arrBasket = JSON.parse(localStorage.getItem('arrBasket')) ?? [];

  products.forEach((product) => {
    function createColorName() {
      const checks = document.querySelectorAll('.modal-box__input');

      checks.forEach((check) => {
        if (check.checked === true) {
          const span = document.querySelector('.modal-box__text_color');
          span.innerText = `Цвет: ${check.getAttribute('dataColor')}`;
        }
      });
    }

    function addModal() {
      const modalBox = document.querySelector('.modal-box');
      modalBox.style.display = 'flex';

      const content = document.createElement('div');
      content.className = 'modal-box__content';
      modalBox.prepend(content);

      const imageBox = document.createElement('div');
      imageBox.className = 'modal-box__image-box';
      content.prepend(imageBox);

      const image = new Image();
      image.className = 'modal-box__image';
      image.src = `/assets/products/${product.picture}`;
      imageBox.prepend(image);

      const features = document.createElement('div');
      features.className = 'modal-box__features';
      imageBox.after(features);

      const title = document.createElement('h2');
      title.className = 'modal-box__title';
      title.innerHTML = product.name;
      features.prepend(title);

      const priceBox = document.createElement('div');
      priceBox.className = 'modal-box__price-box';
      title.after(priceBox);

      const price = document.createElement('span');
      price.className = 'modal-box__price';
      if (product.discount === 0) {
        price.innerHTML = ` RUB ${product.price}.00`;
        price.id = 'price';
        priceBox.prepend(price);
      } else {
        price.id = 'price';
        price.className = 'modal-box__price modal-box__price-through';
        price.innerHTML = ` RUB ${product.price}.00`;
        const discountPrice = document.createElement('span');
        discountPrice.className = 'modal-box__price';
        discountPrice.innerHTML += ` RUB ${Math.round(product.price * (1 - product.discount / 100))}.00`;
        priceBox.prepend(price);
        priceBox.append(discountPrice);
      }

      const vendor = document.createElement('span');
      vendor.className = 'modal-box__vendor';
      vendor.innerHTML = `Артикул: ${product.code}`;
      priceBox.after(vendor);

      if (product.sizes.length >= 1) {
        const sizeBox = document.createElement('div');
        sizeBox.className = 'modal-box__size-box';
        sizeBox.innerHTML = '<span class="modal-box__text">Размер</span>';
        const select = document.createElement('select');
        select.className = 'modal-box__select';
        select.name = 'size';
        sizeBox.append(select);
        const option = document.createElement('option');
        const arr = product.sizes;
        for (let i = 0; i < arr.length; i++) {
          option.innerHTML = arr[i];
          select.append(option.cloneNode(true));
        }
        vendor.after(sizeBox);
      }

      if (product.colors.length >= 1) {
        const colorsBox = document.createElement('div');
        colorsBox.className = 'modal-box__box-color';

        const spanColor = document.createElement('span');
        spanColor.className = 'modal-box__text modal-box__text_color';
        colorsBox.prepend(spanColor);

        const arrColors = product.colors;

        for (let i = 0; i < arrColors.length; i++) {
          const label = document.createElement('label');
          const checked = (i === 0) ? 'checked' : '';
          label.className = 'modal-box__label';
          label.innerHTML = `<input class="modal-box__input" ${checked} dataColor="${arrColors[i].name}" name="color" value="${arrColors[i].value}" type="radio">
          <span class="modal-box__input__border" style="background-color: ${arrColors[i].value}"></span>`;
          colorsBox.append(label.cloneNode(true));
        }
        features.append(colorsBox);
      }
      createColorName();

      const amount = document.createElement('div');
      amount.className = 'modal-box__amount';
      features.append(amount);

      const amountText = document.createElement('span');
      amountText.className = 'modal-box__text';
      amountText.innerHTML = 'Количество';
      amount.prepend(amountText);

      const counter = document.createElement('input');
      Object.assign(counter, {
        className: 'modal-box__counter',
        type: 'number',
        pattern: '[0-9]*',
        max: '99',
        min: '1',
        value: 1,
      });
      amount.append(counter);

      const button = document.createElement('input');
      Object.assign(button, {
        className: 'modal-box__button',
        type: 'submit',
        value: 'Добавить в корзину',
      });
      amount.after(button);

      const link = document.createElement('a');
      link.className = 'modal-box__link';
      link.innerHTML = 'Смотреть подробную информацию';
      link.href = `product.html?code=${product.code}`;
      button.after(link);

      const close = document.createElement('button');
      close.className = 'modal-box__close';
      close.innerHTML = '<span class="material-icons">close</span>';
      features.after(close);
      close.addEventListener('click', () => {content.remove(); modalBox.style.display = ''; });

      button.addEventListener('click', getFormValues);
    }
    document.addEventListener('click', createColorName);



    if (product.discount === 0) {
      const itemBox = document.createElement('div');
      itemBox.className = 'section-grid-items__item';
      block.append(itemBox);

      const linkBox = document.createElement('div');
      linkBox.className = 'section-grid-items__link-box';
      itemBox.append(linkBox);

      const linkImage = document.createElement('a');
      linkImage.className = 'section-grid-items__link';
      linkImage.href = `product.html?code=${product.code}`;
      linkBox.append(linkImage);

      const image = new Image();
      image.src = `/assets/products/${product.picture}`;
      image.className = 'section-grid-items__img';
      linkImage.append(image);

      const popUp = document.createElement('a');
      popUp.className = 'section-grid-items__pop-up';
      popUp.innerHTML = 'Быстрый просмотр';
      linkImage.after(popUp);

      const name = document.createElement('h2');
      name.className = 'section-grid-items__title';
      name.innerHTML = `${product.name}`;
      linkBox.after(name);

      const price = document.createElement('span');
      price.className = 'section-grid-items__price';
      price.innerHTML = `RUB ${product.price}.00`;
      name.after(price);

      linkImage.addEventListener('mouseenter', e => { popUp.style.display = 'block'; });
      linkBox.addEventListener('mouseleave', e => { popUp.style.display = 'none'; });

      popUp.addEventListener('click', addModal);
    } else {
      const itemBox = document.createElement('div');
      itemBox.className = 'section-grid-items__item';
      block.append(itemBox);

      const discount = document.createElement('span');
      discount.className = 'section-grid-items__item__discount';
      discount.innerHTML = `СКИДКА ${product.discount}%`;
      itemBox.append(discount);

      const linkBox = document.createElement('div');
      linkBox.className = 'section-grid-items__link-box';
      discount.after(linkBox);

      const linkImage = document.createElement('a');
      linkImage.className = 'section-grid-items__link';
      linkImage.href = `product.html?code=${product.code}`;
      linkBox.append(linkImage);

      const image = new Image();
      image.src = `/assets/products/${product.picture}`;
      image.className = 'section-grid-items__img';
      linkImage.append(image);

      const popUp = document.createElement('a');
      popUp.className = 'section-grid-items__pop-up';
      popUp.innerHTML = 'Быстрый просмотр';
      linkImage.after(popUp);

      const name = document.createElement('h2');
      name.className = 'section-grid-items__title';
      name.innerHTML = `${product.name}`;
      linkBox.after(name);

      const boxPrice = document.createElement('div');
      boxPrice.className = 'section-grid-items__box-price';
      name.after(boxPrice);

      const lineThrough = document.createElement('span');
      lineThrough.className = 'section-grid-items__price line-through';
      lineThrough.innerHTML = `RUB ${product.price}.00`;
      boxPrice.prepend(lineThrough);

      const price = document.createElement('span');
      price.className = 'section-grid-items__price';
      price.innerHTML = `RUB ${Math.round(product.price * (1 - product.discount / 100))}.00`;
      boxPrice.append(price);

      linkImage.addEventListener('mouseenter', e => { popUp.style.display = 'block'; });
      linkBox.addEventListener('mouseleave', e => { popUp.style.display = ''; });
      popUp.addEventListener('click', addModal);
    }
  });
}

getResponse();

function getFormValues(event) {
  event.preventDefault();
  const obj = {};
  const sizeValue = document.querySelector('.modal-box__select');
  const vendor = document.querySelector('.modal-box__vendor').innerHTML;
  const [vendorName, vendorNumber] = vendor.split(' ');
  const img = document.querySelector('.modal-box__image');
  const title = document.querySelector('.modal-box__title');
  const price = document.getElementById('price');
  const color = [...document.querySelectorAll('.modal-box__input')];
  obj.price = +price.innerText.replace(/[a-z\s]/gi, '');
  obj.title = title.innerText;
  obj.img = img.src;
  obj.vendor = +vendorNumber;
  obj.size = sizeValue == null ? null : sizeValue.value;
  obj.color = color.length === 0 ? null : color.filter((elem) => elem.checked === true)[0].getAttribute('dataColor');
  obj.number = +document.querySelector('.modal-box__counter').value;

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

// Выводим кол-во товаров в корзине

const arrBasket = JSON.parse(localStorage.getItem('arrBasket')) ?? [];

document.addEventListener('DOMContentLoaded', () => {
  const basketValue = document.querySelector('.header__svg__text');
  basketValue.innerHTML = arrBasket.reduce((accumulator, numberValue) => {
    return accumulator + numberValue.number;
  }, 0);
});

// Подсвечиваем текущий раздел в меню

document.addEventListener('DOMContentLoaded', () => {
  const urlPage = window.location.pathname.split('/')[1];
  if (urlPage === 'store.html') {
    const item = document.querySelector('.header__menu__item__link_store');
    item.style.cssText = 'color: rgb(185, 152, 103)';
  }
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
