// Функция проверки длины строки

function testStringLength(string, length) {
  return string.length >= length;
}
testStringLength('проверочная строка', 18);
testStringLength('проверочная строка', 30);

// Функция проверки, является ли строка палиндромом

function isPalindrome(str) {
  let check = '';
  for (let i = str.length - 1; i >= 0; --i) {
    check += str[i];
  }
  return str === check;
}
isPalindrome('dad');
isPalindrome('man');

// Функция извлекающая цифры из строки

function getNumbers(string) {
  return parseInt(string.replace(/\D+/g, ""));
}
getNumbers('test 345');
getNumbers('1 new test 456');

// Функция возврата исходной строки

const newString = (str, min, plus) => {
  let result;
  const symbolNumber = min - str.length;
  if (symbolNumber % plus.length === 0 && plus.length <= symbolNumber) {
    result = `${plus.repeat(symbolNumber / plus.length)}${str}`;
  } else if (str.length >= min) {
    result = `${str}`;
  } else if (plus.length >= symbolNumber) {
    result = `${plus.slice(0, symbolNumber)}${str}`;
  } else if (symbolNumber % plus.length !== 0) {
    result = `${plus.slice(0, (symbolNumber % plus.length))}${plus.slice(0,
      symbolNumber)}${str}`;
  }
  return result;
}

newString('1', 2, '0');
newString('1', 4, '0');
newString('q', 4, 'werty');
newString('q', 4, 'we');
newString('qwerty', 4, '0');