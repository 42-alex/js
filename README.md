# JS Notes

## Sources for learning

* https://learn.javascript.ru
* https://github.com/azat-io/you-dont-know-js-ru  
* https://ru.code-basics.com/languages/javascript (practical tasks)

---

## JS Features

### Функции-предикаты

Функции-предикаты (или функции-вопросы) отвечают на какой-то вопрос и всегда (без исключений!) возвращают либо true, либо false.

Предикаты во всех языках принято именовать особым образом для простоты анализа.
В JavaScript предикаты, как правило, начинаются с префикса is, has или can, но не ограничены этими словами. Примеры:

* isInfant() — «младенец ли?»
* hasChildren() — «есть ли дети?»
* isEmpty() — «пустой ли?»
* hasErrors() — «есть ли ошибки?»

Функция может считаться предикатом только если она возвращает boolean.

---

### Импорт и экспорт модулей в JS

Экспорт из модуля
```
// content of donor.js
// Option #1
export const fourthWeekday = 'Thursday';
export const getFifthWeekday = () => 'Friday';

// Option #2
export { fourthWeekday, getFifthWeekday as default };
```

Экспорт по умолчанию
```
// content of donor.js
const getFifthWeekday = () => 'Friday';
export default getFifthWeekday // export default () => 'Friday'
```

Импорт по умолчанию
```
// content of acceptor.js
import nameOfDefault from './donor';
```

Импорт по умолчанию с другими импортами
```
// content of acceptor.js
// Option #1
import nameOfDefault, { getFirstWeekday, getSecondWeekday } from './donor';

// Option #2
import { default as nameOfDefault, getFirstWeekday, getSecondWeekday } from './donor';
```

Импорт всего модуля
```
// acceptor.js
import * as someName from './donor';

// usage
someName.getThirdWeekday(); // 'Wednesday'
someName.default(); // доступ (при данном виде импорта) к значению по умолчанию: 'Friday'
```

---

### Функции для работы с cookie


Returns a value of cookie with the specified name, or undefined if nothing was found
```
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
```


Sets a cookie with name "name" and value "value", with the default path ="/" setting (can be changed to add other defaults)

Usage example: `setCookie('user', 'John', {secure: true, 'max-age': 3600});`
```
function setCookie(name, value, options = {}) {
    options = {
        path: '/',
        // add other defaults as needed
        ...options
    };
    
    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }
    
    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
    
    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }
    
    document.cookie = updatedCookie;
}
```

Delete cookie with name "name". Its dependency is previous function `setCookie()`
```
function deleteCookie(name) {
    setCookie(name, "", {
        'max-age': -1
    })
}
```

---

### Работа с объектами

Метод Object.entries создает из объекта массив. Например, Object.entries({ a: 1, b 2}) вернет массив [['a', 1], ['b', 2]]
Используя этот метод с синтаксисом деструктуризации, мы можем вывести все свойства и значения объекта следующим образом:
```
let о = { х: 1, у: 2 };
for (const [name, value] of Object.entries(о)) {
    console.log(`${name}: ${value}`);
}
```
Если нам нужны только ключи или только значения, то используем `Object.keys` или `Object.values`

---
### Правильная сортировка массива чисел представленных в строковом формате

```
const arr1 = ['7', '15', '1'];
arr1.sort();  // ['1', '15', '7'];  // посимвольное сравнение строк
arr1.sort((a, b) => a - b);  // ['1', '7', '15'];
```

