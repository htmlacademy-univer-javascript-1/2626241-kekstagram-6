const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];

const createIdGenerator = () => {
  let lastGeneratedId = 0;
  return () => ++lastGeneratedId;
};

const isEscapeKey = (evt) => evt.key === 'Escape';

export {
  getRandomInteger,
  getRandomArrayElement,
  createIdGenerator,
  isEscapeKey
}; 
