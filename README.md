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