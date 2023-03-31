(() => {
  let cardState = [];
  const cardClickState = {
    counterClick: 0,
    counterSeccess: 0,
    firstClickCard: '',
    lastClickCard: '',
    squareCollection: [],
  };
  let timeouId = 1;

  function createForm() {
    const form = document.createElement('form');
    const input = document.createElement('input');
    const button = document.createElement('button');

    form.classList.add('container');
    input.classList.add('input');
    input.placeholder = 'Введи размер поля';
    button.classList.add('btn');
    button.innerText = 'Начать игру';

    form.append(input, button);

    return {
      form,
      input,
      button,
    };
  }

  function createArrayRandomPairNumber(arraySize) {
    const arrayPairNumber = [];
    const countNumber = arraySize / 2;

    for (let i = 0; i < countNumber; i++) {
      arrayPairNumber.push(i + 1);
      arrayPairNumber.push(i + 1);
    }
    for (let i = arrayPairNumber.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arrayPairNumber[i], arrayPairNumber[j]] = [arrayPairNumber[j], arrayPairNumber[i]];
    }

    arrayPairNumber.forEach((e, i) => {
      cardState[i] = e;
    });

    return arrayPairNumber;
  }

  const retryGame = () => {
    cardClickState.squareCollection.childNodes.forEach((e) => {
      e.classList.remove('is-open', 'is-selected', 'is-success');
    });
    cardClickState.counterClick = 0;
    cardClickState.counterSeccess = 0;
    cardClickState.firstClickCard = '';
    cardClickState.lastClickCard = '';
    cardState = [];

    createArrayRandomPairNumber(cardClickState.squareCollection.childNodes.length);
    timeouId = setTimeout(retryGame, 60000);
  };

  function createWinContainer() {
    const container = document.createElement('div');
    const textMassage = document.createElement('span');
    const button = document.createElement('button');

    container.classList.add('container', 'win-massage');
    textMassage.classList.add('text');
    textMassage.textContent = 'Победа';
    button.classList.add('btn');
    button.textContent = 'Еще разок?';

    button.addEventListener('click', () => {
      cardClickState.squareCollection.childNodes.forEach(() => {
        retryGame();
        container.remove();
      });
    });

    container.append(textMassage, button);

    return {
      container,
      button,
    };
  }

  function addWinContainer(HTMLComponent) {
    const winContainer = createWinContainer();
    HTMLComponent.append(winContainer.container);
  }

  function toggleCard(card) {
    card.classList.toggle('is-open');
    card.classList.toggle('is-selected');
  }

  function seccessCard(firstClickCard, lastClickCard) {
    firstClickCard.classList.add('is-success');
    lastClickCard.classList.add('is-success');
  }

  function isEqualCard(firstClickCardId, lastClickCardId) {
    return cardState[firstClickCardId] === cardState[lastClickCardId];
  }

  function removeTextContent(card) {
    card.textContent = '';
  }

  function createCard(id, HTMLComponent) {
    const card = document.createElement('li');

    card.classList.add('card');
    card.id = id;

    card.addEventListener('click', () => {
      if (!card.classList.value.includes('is-open')) {
        toggleCard(card);
        card.textContent = cardState[+card.id];

        if (cardClickState.counterClick === 0) {
          cardClickState.firstClickCard = card;
        } else {
          cardClickState.lastClickCard = card;
        }

        if (cardClickState.counterClick > 0) {
          if (isEqualCard(+cardClickState.firstClickCard.id, +cardClickState.lastClickCard.id)) {
            seccessCard(cardClickState.firstClickCard, cardClickState.lastClickCard);
            cardClickState.counterSeccess++;

            if (cardClickState.counterSeccess === cardState.length / 2) {
              addWinContainer(HTMLComponent);
              clearTimeout(timeouId);
            }
          } else {
            setTimeout(toggleCard, 400, cardClickState.lastClickCard);
            setTimeout(toggleCard, 400, cardClickState.firstClickCard);
            setTimeout(removeTextContent, 400, cardClickState.lastClickCard);
            setTimeout(removeTextContent, 400, cardClickState.firstClickCard);
          }

          cardClickState.counterClick = 0;
          cardClickState.firstClickCard = '';
          cardClickState.lastClickCard = '';
        } else cardClickState.counterClick++;
      }
    });

    return card;
  }

  function createGameSquare() {
    const list = document.createElement('ul');

    list.classList.add('list');

    return list;
  }

  function createGameApp(appId = 'app') {
    const components = {
      header: createForm(),
      square: createGameSquare(),
    };

    document.addEventListener('DOMContentLoaded', () => {
      const appContainer = document.getElementById(appId);

      appContainer.append(components.header.form, components.square);

      components.header.form.addEventListener('submit', (e) => {
        e.preventDefault();

        cardClickState.counterClick = 0;
        cardClickState.counterSeccess = 0;
        cardClickState.firstClickCard = '';
        cardClickState.lastClickCard = '';
        cardState = [];

        const inputValue = components.header.input.value;

        components.square.classList.remove('square__2x2', 'square__4x4', 'square__6x6', 'square__8x8', 'square__10x10');

        while (components.square.firstChild) {
          components.square.removeChild(components.square.firstChild);
        }

        if (Number(inputValue) % 2 === 0
        && Number(inputValue) >= 2
        && Number(inputValue) <= 10) {
          const arrayPairNumber = createArrayRandomPairNumber(
            (inputValue * inputValue),
          );
          components.square.classList.add(`square__${inputValue}x${inputValue}`);
          for (let i = 0; i < arrayPairNumber.length; i++) {
            components.square.append(createCard(i, appContainer));
          }
          cardClickState.squareCollection = components.square;
        } else {
          alert('Введи четное число от 2 до 10!');
          components.header.input.value = '4';
          return;
        }
        components.header.input.value = '';
        timeouId = setTimeout(retryGame, 60000);
        appContainer.querySelector('.win-massage').remove();
      });
    });
  }
  createGameApp();
})();
