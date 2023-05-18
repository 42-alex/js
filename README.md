# JS Notes

## Sources for learning

* https://javascript.info/
* https://github.com/jumaschion/You-Dont-Know-JS-1
* https://code-basics.com/languages/javascript (practical tasks)

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
export function sum(a, b) { return a + b };
export class Circle {
    constructor(r) { this.r = r }
    area() { return PI * this.r * this.r }
};
export const getFifthWeekday = () => 'Friday';

// Option #2
export { fourthWeekday, sum, Circle, getFifthWeekday as default };

// Option #3 (экспорт с переименованием)
export {
    fourthWeekday as day,
    sum as newFunctionName
}
```

Экспорт по умолчанию
```
// content of donor.js
const getFifthWeekday = () => 'Friday';
export default getFifthWeekday // export default () => 'Friday'
```

Повторное экспортирование (re-export)
```
// допустим, есть необходимость сделать удобный модуль откуда можно импортировать несколько функций в одной строке
import { mean } from "./stats/mean.js";
import { stddev } from "./stats/stddev.js";
export { mean, stdev };

// тогда мы можем упростить его используя оператор повторного экспорта, в котором применяются ключевые слова export и from
export { mean } from "./stats/mean.js";
export { stddev } from "./stats/stddev.js";
// или так, если модули которые мы хотим повторно экспортировать делали export default
export { default as mean } from "./stats/mean.js";
export { default as stddev } from "./stats/stddev.js";
// если нужно переэкспортировать модуль по умолчанию и оставить его дефолтным для последующих импортов
export { default } from "./stats/mean.js";
// если нужно переэкспортировать именованный модуль, но сделать его дефолтным для последующих импортов
export { mean as default } from "./stats/mean.js";

// если нас не интересует избирательность при повторном экспортировании, тогда можем применить групповой экспорт
export * from "./stats/mean.js";
export * from "./stats/stddev.js";
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

Импорт и запуск всего модуля (даже если в этом модуле нет экспортов)
```
import './analytics.js';  // используется, когда нам нужно импортировать не переменную или функцию,
                          // а чтобы выполнить код импортируемого модуля
```

Динамический импорт (ES2020)
```
// вместо импортирования модуля "./stats.js" статическим образом:
import * as stats from "./stats.js"; 

// мы могли бы импортировать его и работать с ним динамически:
import("./stats.js").then(stats => { 
    let average = stats.mean(data);
))

// Или же в асинхронной функции мы можем упростить код посредством await:
async analyzeData (data)  {
    let stats = await import("./stats.js");
    return  {
        average: stats.mean(data), 
        stddev: stats.stddev(data)
    } 
}
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


#### Перебор свойств объекта

Метод Object.entries создает из объекта массив. Например, Object.entries({ a: 1, b 2}) вернет массив [['a', 1], ['b', 2]]
Используя этот метод с синтаксисом деструктуризации, мы можем вывести все свойства и значения объекта следующим образом:
```
let о = { х: 1, у: 2 };
for (const [name, value] of Object.entries(о)) {
    console.log(`${name}: ${value}`);
}
```
Если нам нужны только ключи или только значения, то используем `Object.keys` или `Object.values`
<br><br>


#### Перебор и вывод всех "родных" свойств объекта

```
for (let prop in someObj) {
    if(someObj.hasOwnProperty(prop)) {
        console.log(`${prop}: ${someObj[prop]}`);  // e.g. name: 'John'
    }
}
```
Если не использовать метод hasOwnProperty, то мы можем получить "лишние" свойства, которые не принадлежат тому объекту,
по которому мы проходимся в цикле. По умолчанию оператор in пробегается еще и по всем свойствам прототипа объекта.
<br><br>


#### Сливание нескольких объектов в один без перетирания свойств

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
// reverse every word that has length of 5 or more 
const spinWords = str => {
  return string.replace(/\w{5,}/g, function(w) { return w.split('').reverse().join('') })
}
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

#### Правильная сортировка массива
Сортировка числовых значений массива, которые имеют строковый тип
```
const arr1 = ['7', '15', '1'];
arr1.sort();  // ['1', '15', '7'];  // посимвольное сравнение строк
arr1.sort((a, b) => a - b);  // ['1', '7', '15'];
```

Нечувствительная к регистру сортировка строк (слов) 
```
let а = ["ant", "Bug", "cat", "Dog"];
a.sortO;  // a == ["Bug", "Dog", "ant", "cat"]; сортировка, чувствительная к регистру 
а.sort(function(s,t) {
    let a = s.toLowerCase(); 
    let b = t.toLowerCase(); 
    if (a < b) return -1; 
    if (a > b) return 1; 
    
    return 0;
});  // a == ["ant","Bug","cat","Dog"]; сортировка, нечувствительная к регистру
```

Сортировка с применением Intl.Collator
```
// Базовый компаратор для сортировки согласно локали пользователя.
// Никогда не сортируйте строки, читабельные человеком, без передачи чего-то вроде такого:
let collator = Intl.Collator().compare;
['Z', 'a', 'A', 'z'].sort(collator);  // ['a', 'A', 'z', 'Z']

// Имена файлов часто включают числа, поэтому мы должны их 
// сортировать особым образом:
const filenameOrder = new Intl.Collator(
    undefined,
    { numeric: true }, 
).compare;
["page10”, "page9"].sort(filenameOrder) // => ["page9", "page1O”] 
```

#### Создание массива из массивоподобного объекта (объект со свойством length и положительными целочисленными свойствами)
Способ №1 (заимствование метода)
```
const arrLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
const realArr = Array.prototype.slice.call(arrLike, 0);  // ['a', 'b', 'c']
```
Способ №2 (использование фабричного метода Array.from())
```
const arrLike = { 0: 'a', 1: 'b', 2: 'c', length: 3 };
const realArr = Array.from(arrLike);  // ['a', 'b', 'c']
```

---

### Функция определения строгого режима

```
const isStrict = (fucntion() { retrun !this; }());  // если это строгий режим, то this равен undefined и функция возвращает true
                                                    // в не строгом режиме this равен глобальному объекту, поэтому возвращается false
```

---

### Функция обертка для измерения времени выполнения

```
// эта функция принимает функцию и возвращает обертку над ней, в которую добавляет свой функционал
function timed(f) {
    return function(...args) {  // собрать все аргументы в массив
        const startTime = Date.now();
        console.log(`Enters in function ${f.name}`);
        try {
            return f(...args);  // передать все аргументы в основную функцию
        }
        finally {
            console.log(`The function has run for ${Date.now() - startTime} ms`);
        }
    } 
}

// function call example
function benchmark(n) {
    let sum = 0;
    for (let i=1; i<n; i++) sum += i;
    return sum;
};

timed(benchmark)(1000000);  // возвращает результат вычисления и время выполнения в консоль
```

---

### Как измерить время выполнения кода JS
Способ №1 (performance.now())
```
const startTime = performance.now();
calculateSomething();
const finishTime = performance.now();
const executionTime = finishTime - startTime;  // 162.928955078125 ms
```
Способ №2 (Date.now()) - отличие от performance.now() в том, что здесь мы получаем целое число
```
const startTime = Date.now();
calculateSomething();
const finishTime = Date.now();
const executionTime = finishTime - startTime;  // 162
```
Способ №3 (console.time())
```
console.time('yourMark');  // yourMark must match the mark you pass to timeEnd()
calculateSomething();
console.timeEnd('yourMark');  // yourMark: 162.928955078125 ms
```

---

### Методы функций

#### Методы call() и apply()
Методы call() и apply() позволяют косвенно вызывать функцию, как если бы 
она была методом какого-то другого объекта. Другими словами мы можем с
помощью данных методов вызывать функцию, явно устанавливая this. 
Первым аргументом в call() и apply() является объект, на котором должна
вызываться функция; он представляет контекст вызова и становится значением
ключевого слова this внутри тела функции. Чтобы вызвать функцию f() как
метод объекта о (без аргументов), вы можете использовать либо call(), либо
apply():
```
f.call(о);  // full signature: f.call(context, arg1, arg2, ...)
f.apply(о);  // full signature: f.call(context, argsPseudoArr)
```
Любая из двух строк подобна следующему коду (где предполагается, что объект
о не имеет свойства по имени m):
```
o.m = f; // Сделать f временным методом о
o.m(); // Вызвать его без аргументов
delete o.m;  // Удалить временный метод
```
Единственная разница в синтаксисе между call и apply состоит в том,
что call ожидает список аргументов, в то время как apply принимает псевдомассив.
Эти два вызова почти эквивалентны:
```
func.call(context, ...args);  // передаёт перебираемый объект args как список с оператором расширения
func.apply(context, args);    // принимает только псевдомассив args
```
Операция распространения ... появилась в ES6, поэтому если мы писали на ES5, то метод apply() был незаменим

---

### Как сделать объект итерируемым

Необходимо добавить в объект метод под названием [Symbol.iterator]. Этот метод будет возвращать итератор.
Итератор это объект с методом next(). Метод next() можно многократно вызывать для получения значений итерируемого 
объекта. Он возвращает объект со свойством value и done: ```{ value: 'anything', done: false }```. Если больше нечего
возвращать, то он возвращает ```{ done: true }```
```
let obj = {
    from: 1,
    to: 5,
    [Symbol.iterator]() {
        let i = this.from;
        return {
            next: () => {
                if(i <= this.to) {
                    return {
                        value: i++,
                        done: false,  // можно опустить это свойство, если оно не true
                    }
                }
                return { done: true }
            }
        }
    }
}

// теперь такой объект можно использовать с итерируемыми операторами
[...obj];                           // [1, 2, 3, 4, 5]
// or
for (let i of obj) {
    console.log(i);                 // 1, 2, 3, 4, 5
}
```

---

#### Как сделать объект асинхронно итерируемым

Первое отличие от обычного итерируемого объекта в том, что в объект нужно добавлять метод [Symbol.asyncIterator]
вместо [Symbol.iterator]. Второе отличие в том, что метод итератора next() возвращает не объект результата итерации,
а Promise, который уже разрешается в объект результата итерации.

```
let obj = {
    from: 1,
    to: 5,
    [Symbol.asyncIterator]() {
        let i = this.from;
        return {
            next: () => {
                if(i <= this.to) {
                    return new Promise(resolve => {
                        setTimeout(
                            () => resolve({ value: i++}),
                            2000
                        )
                    })
                }
                return Promise.resolve({ done: true });
            }
        }
    }
}

// теперь такой объект можно использовать в цикле for/await 
for await (let value of obj) {
    console.log(value);  // выведeт цифры от 1 до 5 с интервалом в 2 секунды
}
```

---

### Как изменить атрибуты свойств
Для одного свойства можно использовать метод Object.defineProperty
```
Object.defineProperty (anyObject, "х_prop", { writable: false });
```

Для изменения нескольких свойств за раз используем метод Object.defineProperties
```
let р = Object.defineProperties({}, {
    х: { value: 1, writable: true, enumerable: true, configurable: true }, 
    y: { value: 1, writable: true, enumerable: true, configurable: true }, 
    r: {
        get() { return Math, sqrt (this. x*this.x + this. y*this.y); }, 
        enumerable: true, 
        configurable: true
    }
});
p.r;  // => Math.SQRT2
```

---

### Как получить класс любого значения

```
function classof(о) {
    return Object.prototype.toString.call(o).slice(8,-1);
}

classof(null)        // => "Null"
classof(undefined)   // => "Undefined1
classof(1)           // => "Number"*
classof(10n**100n)   // => "Biglnt"
classof("")          // => "String"
classof(false)       // => "Boolean"
classof(Symbol())    // => "Symbol"
classof({})          // => "Object"
classof([])          // => "Array"
classof(/./)         // => "RegExp"
classof(()=>{})      // => "Function"
classof (new Map ()) // => "Map"
classof(new Set ())  // => "Set"
classof(new Date())  // -> "Date"
```

---

### Как асинхронно импортировать скрипт с помощью функции

```
const importScript = (url) => {
  return new Promise((resolve, reject) => {
    let s = document.createElement('script');
    s.onload = () => resolve();
    s.onerror = (e) => reject(e);
    s.src = url;
    document.head.append(s);
  })
};

importScript('https://example.com/your_script_here.js');
```

---

### Как получить текст HTML-элемента

Есть два способа:
* свойство textContent (рекомендуемое)
* свойство innerText (не рекомендуемое, т.к. оно не определено как следует и не реализовано совместимым между браузерами образом)

Пример.
Допустим наш HTML содержит следующий заголовок h1
```<h1>What a <span>wonderful</span> day</h1>```
найдем его и отобразим его текст
```
let h1 = document.querySelector('h1')
let h1Text = h1.textContent;  // What a wonderful day
```
Обратите внимание, что теги внутри h1 вырезались. Свойство textContent находит и возвращает весь текст во всех потомках элемента.

---

### Get a random number 

From 0 to {maxNumber}
```
const max = 200;
const getRandomNumber = (max) => Math.floor(Math.random() * max)
```

From {minNumber} to {maxNumber}
```
const min = 80;
const max = 200;
const getRandomNumber = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min
```

---

### Create a new number id for the next object in array: the_highest_id + 1

```
const todos = [
  {
    id: 1,
    text: 'Learn JS',
    completed: true
  }
]

const addNewTodo = (todoText) => {
  const maxId = todos.reduce(
    (maxId, todo) => Math.max(maxId, todo.id),
    -1
  );
  const newTodoId = maxId + 1;
  
  // or in one row:
  // todos.reduce((maxId, todo) => Math.max(todo.id, maxId), -1) + 1
  
  todos.push({
    id: newTodoId,
    text: todoText,
    completed: false,
  })
}
```

---

### Specifying a default value for a function parameter

#### Approach #1
```
function drawShape(size = 100) {
    // ...
}
```
The default value {100} is only used if you don't pass an argument to the drawShape
function or you pass `undefined` value. If you pass `null` or any other falsy value
the default value will not be applied.

#### Approach #2 

```
function drawShape(size) {
    const defaultSize = size || 100;
}
```
In this case the fall back value will be applied either you don't pass an argument 
or you pass a falsy value like 0, '', null, undefined, false;

#### Approach #3 
```
function drawShape(size) {
    const defaultSize = size ?? 100;
}
```
The nullish coalescing operator return the default value only if the "size" 
argument equals `null` or `undefined`. There is more verbose way to do the same
but it is supported in all browsers and Node.js versions.
```
function drawShape(size) {
    const defaultSize = typeof size !== 'undefined && size !== null'
        ? size
        : 100;
}
```

