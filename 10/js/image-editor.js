import noUiSlider from '/vendor/nouislider/nouislider.mjs';

const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;

const uploadForm = document.querySelector('.img-upload__form');
const scaleControlValue = uploadForm.querySelector('.scale__control--value');
const scaleControlSmaller = uploadForm.querySelector('.scale__control--smaller');
const scaleControlBigger = uploadForm.querySelector('.scale__control--bigger');
const imagePreview = uploadForm.querySelector('.img-upload__preview img');
const effectsList = uploadForm.querySelector('.effects__list');
const effectLevel = uploadForm.querySelector('.img-upload__effect-level');
const effectLevelValue = uploadForm.querySelector('.effect-level__value');
const effectLevelSlider = uploadForm.querySelector('.effect-level__slider');

let currentScale = SCALE_DEFAULT;
let currentEffect = 'none';

// Настройки эффектов
const effects = {
  none: {
    min: 0,
    max: 100,
    step: 1,
    unit: '',
  },
  chrome: {
    filter: 'grayscale',
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
  },
  sepia: {
    filter: 'sepia',
    min: 0,
    max: 1,
    step: 0.1,
    unit: '',
  },
  marvin: {
    filter: 'invert',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
  },
  phobos: {
    filter: 'blur',
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px',
  },
  heat: {
    filter: 'brightness',
    min: 1,
    max: 3,
    step: 0.1,
    unit: '',
  },
};

// Функции для работы с масштабом
const updateScale = (value) => {
  currentScale = value;
  scaleControlValue.value = `${value}%`;
  imagePreview.style.transform = `scale(${value / 100})`;
};

const onScaleControlSmallerClick = () => {
  const newValue = Math.max(currentScale - SCALE_STEP, SCALE_MIN);
  updateScale(newValue);
};

const onScaleControlBiggerClick = () => {
  const newValue = Math.min(currentScale + SCALE_STEP, SCALE_MAX);
  updateScale(newValue);
};

// Функции для работы с эффектами
const createSlider = () => {
  noUiSlider.create(effectLevelSlider, {
    range: {
      min: 0,
      max: 100,
    },
    start: 100,
    step: 1,
    connect: 'lower',
    format: {
      to: (value) => Number.isInteger(value) ? value : value.toFixed(1),
      from: (value) => parseFloat(value),
    },
  });
};

const updateSlider = (effect) => {
  if (effect === 'none') {
    effectLevel.classList.add('hidden');
    imagePreview.style.filter = 'none';
    effectLevelValue.value = '';
    return;
  }

  const { min, max, step } = effects[effect];
  effectLevelSlider.noUiSlider.updateOptions({
    range: { min, max },
    start: max,
    step,
  });

  effectLevel.classList.remove('hidden');
};

const onSliderUpdate = () => {
  if (currentEffect === 'none') {
    return;
  }

  const sliderValue = effectLevelSlider.noUiSlider.get();
  const { filter, unit } = effects[currentEffect];

  effectLevelValue.value = sliderValue;
  imagePreview.style.filter = `${filter}(${sliderValue}${unit})`;
};

const onEffectsListChange = (evt) => {
  if (evt.target.type === 'radio') {
    currentEffect = evt.target.value;
    updateSlider(currentEffect);

    if (currentEffect !== 'none') {
      effectLevelSlider.noUiSlider.set(effects[currentEffect].max);
    }
  }
};

// Сброс настроек
const resetImageEditor = () => {
  updateScale(SCALE_DEFAULT);
  currentEffect = 'none';

  // Сбрасываем эффекты
  effectsList.querySelector('#effect-none').checked = true;
  imagePreview.style.filter = 'none';
  effectLevel.classList.add('hidden');
  effectLevelValue.value = '';
};

// Инициализация
const initImageEditor = () => {
  // Инициализация масштаба
  updateScale(SCALE_DEFAULT);
  scaleControlSmaller.addEventListener('click', onScaleControlSmallerClick);
  scaleControlBigger.addEventListener('click', onScaleControlBiggerClick);

  // Инициализация слайдера
  createSlider();
  effectLevelSlider.noUiSlider.on('update', onSliderUpdate);

  // Инициализация эффектов
  effectsList.addEventListener('change', onEffectsListChange);

  // Скрываем слайдер по умолчанию
  effectLevel.classList.add('hidden');
};

export { initImageEditor, resetImageEditor };
