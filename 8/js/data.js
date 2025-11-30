import { getRandomInteger, getRandomArrayElement, createIdGenerator } from './util.js';

const PHOTOS_COUNT = 25;
const MIN_LIKES = 15;
const MAX_LIKES = 200;
const MIN_COMMENTS = 0;
const MAX_COMMENTS = 30;
const AVATAR_COUNT = 6;

const DESCRIPTIONS = [
  'Отличный день для фотографии!',
  'Закат просто волшебный',
  'Момент, который стоит запомнить',
  'Природа в своем великолепии',
  'Городские огни ночью',
  'Путешествие мечты',
  'Тишина и спокойствие',
  'Яркие краски лета',
  'Зимняя сказка',
  'Уличное искусство',
  'Архитектурный шедевр',
  'Морской бриз',
  'Горные вершины',
  'Лесная тропинка',
  'Кофейный момент',
  'Книга и уютный плед',
  'Фестиваль красок',
  'Исторический памятник',
  'Современный мегаполис',
  'Деревенский пейзаж',
  'Невероятный восход',
  'Макро-мир',
  'Черно-белая классика',
  'Эксперимент с ракурсом',
  'Эмоции в кадре'
];

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const NAMES = [
  'Артём', 'Мария', 'Дмитрий', 'Анна', 'Сергей', 'Ольга',
  'Иван', 'Елена', 'Алексей', 'Наталья', 'Павел', 'Светлана',
  'Михаил', 'Татьяна', 'Андрей', 'Юлия', 'Николай', 'Екатерина',
  'Владимир', 'Ирина', 'Роман', 'Людмила', 'Виктор', 'Марина'
];

const generatePhotoId = createIdGenerator();
const generateCommentId = createIdGenerator();

const createComment = () => ({
  id: generateCommentId(),
  avatar: `img/avatar-${getRandomInteger(1, AVATAR_COUNT)}.svg`,
  message: getRandomArrayElement(MESSAGES),
  name: getRandomArrayElement(NAMES)
});

const createPhotoDescription = () => ({
  id: generatePhotoId(),
  url: `photos/${getRandomInteger(1, PHOTOS_COUNT)}.jpg`,
  description: getRandomArrayElement(DESCRIPTIONS),
  likes: getRandomInteger(MIN_LIKES, MAX_LIKES),
  comments: Array.from(
    { length: getRandomInteger(MIN_COMMENTS, MAX_COMMENTS) },
    createComment
  )
});

export const generatePhotos = () =>
  Array.from({ length: PHOTOS_COUNT }, createPhotoDescription);
