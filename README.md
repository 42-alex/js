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
### Значение по умолчанию при помощи короткого замыкания (оператор ||)

```
// Если значение maxWidth истинное, то использовать его. Иначе искать значение в объекте preferences.
// Если оно не истинное, тогда использовать жестко закодированную константу.
let max = maxWidth || preferences.maxWidth || 500;
```
Важно отметить, что если 0 является законным значением для maxWidth, тогда код не будет работать корректно,
т.к. 0 — ложное значение. В качестве альтернативы рассмотрите операцию ??.
Обычно этот трюк использовался для предоставления параметрам функций значения по умолчанию, но в ES6+ необходимость
в этом отпала поскольку стандартное значение параметра можно просто записывать в
самом определении функции: `function сору (о, р={}) {...}`

---
### Законы булевой алгебры (з-ны де Моргана)

```
!(р && q) === (!р || !q);  // => true: для всех значений р и q 
!(р || q) === (!р && !q);  // => true: для всех значений р и q
```

---
### Перебор и вывод всех свойств объекта

```
for (let prop in someObj) {
    if(someObj.hasOwnProperty(prop)) {
        console.log(`${prop}: ${someObj[prop]}`);  // e.g. name: 'John'
    }
}
```
Если не использовать метод hasOwnProperty, то мы можем получить "лишние" свойства, которые не принадлежат тому объекту,
по которому мы проходимся в цикле. По умолчанию оператор in пробегается еще и по всем свойствам прототипа объекта.

---
### Сливание нескольких объектов в один без перетирания свойств

```
// Похожа на Object .assign (),  но не переопределяет существующие
// свойства  (и также не обрабатывает свойства Symbol).
function merge(target,  ...sources)  { 
    for (let source of sources) {
        for (let key of Object. keys (source))  {
            if  (!(key in target))  {  // Это отличается от Object .assign () 
                target[key]  = source[key];
            }
        }
    }
   
    return target;
}

Object.assign ({x: 1}, {x: 2, y: 2}, {y: 3, z: 4}); // => {x: 2, y: 3, z: 4} 
merge ({x: 1}, {x: 2, y: 2}, {y: 3, z: 4}); // =>  {x: 1, y: 2, z: 4}
```

---
### Получение случайного целого числа в диапазоне от m до n

Формула: `m + Math.floor(Math.random() * (n + 1))`
Например, чтобы получить случайное число от 5 до 10, выполните:
```
5 + Math.floor(Math.random() * 11)
```

---
### ES5 vs ES6+

Определение метода в объекте в ES5
```
var obj = { add: function() {/*...*/} }
```
Определение метода в объекте в ES6+
```
// избавляемся от двоеточия и слова "function"
const obj = { add() {/*...*/} }
```

---
### Регулярные выражения (regex)


```
/[A-Z]/.test(letter);  // checking for membership of a letter in the latin alpabet (upper case)
/[A-Za-z]/.test(letter);  // checking for membership of a letter in the latin alpabet (both case)
/[aeiou]/.test(letter);  // checking a letter of vowel
```

---
### Массивы

#### Избавиться от брешей в разреженном массиве
```
let dense = sparce.filter(() => true);  // метод filter всегда пропускает недостающие элементы 
```
#### Избавиться от брешей, а также null и undefined
```
let arr = arr.filter(item => item !== null && item !== undefined); 
```
#### Избавиться всех falsy значений
```
let arr = arr.filter(Boolean); 
```
#### Найти все индексы искомого значения
```
Array.prototype.indexOfAll = function (itemToFind) {
	let results = [];
	
	for (let pos = 0; pos < this.length; pos++) {
		pos = this.indexOf(itemToFind, pos);  // 2nd arguments means "start from"
		if (pos === -1) break;
		
		results.push(pos);
	}
	
	return results;
}; 
Array.from('Hello world!').indexOfAll('l'); // [2, 3, 9]
```

### Правильная сортировка массива

```
const arr1 = ['7', '15', '1'];
arr1.sort();  // ['1', '15', '7'];  // посимвольное сравнение строк
arr1.sort((a, b) => a - b);  // ['1', '7', '15'];
```
```
let а = ["ant", "Bug", "cat", "Dog"];
a.sortO;  // a == ["Bug", "Dog", "ant", "cat"]; сортировка, чувствительная к регистру 
а.sort(function(s,t) {
    let a = s .toLowerCase(); 
    let b = t .toLowerCase(); 
    if (a < b) return -1; 
    if (a > b) return 1; 
    
    return 0;
});  // a == ["ant","Bug","cat","Dog"]; сортировка, нечувствительная к регистру
```
---

