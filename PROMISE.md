# Promises

### Fetching url with error handling

```
fetch("/api/user/profile”)      // Начать HTTP-запрос.
    .then(response => {         // Вызывается, когда готовы состояние и заголовки, 
        if  (!response.ok) {    // Если мы получаем ошибку
                                // 404 Not Found или похожую.
            return null;        // Возможно, пользователь вышел из системы;
                                // возвратить профиль null.
        }
        // Проверить заголовки,  чтобы удостовериться,
        // что сервер отправил нам JSON.
        // Если нет, тогда наш сервер неисправен, а это серьезная ошибка!
        let type = response.headers.get("content-type"); 
        if (type !== "application/json") {
            throw new TypeError('Expected JSON, got ${type}'); // Ожидался JSON, но получен другой тип
        }
        // Если мы попали сюда, то получили состояние 2хх
        // и тип содержимого JSON, поэтому можем уверенно возвратить
        // объект Promise для тела ответа как объект JSON.
        return response.json();
    })
    .then(profile => { //Вызывается с разобранным телом ответа или null 
        if (profile) {
            displayUserProfile(profile);
        }
        else {  // Если мы получили ошибку 404 выше и возвратили null, то окажемся здесь. 
            displayLoggedOutProfilePage();
        }
    })
    .catch(е => {
        if (е instanceof NetworkError) {
            // fetch () может потерпеть такую неудачу, если исчезло подключение к Интернету. 
            displayErrorMessage("Check your internet connection.");
            // Проверьте свое подключение к Интернету.
        }
        else if (е instanceof TypeError) {
            // Это происходит в случае генерации TypeError выше. 
            displayErrorMessage ("Something is wrong with our server!"); 
            // Что-то не так с нашим сервером!
        }
        else {
            // Это должна быть непредвиденная ошибка какого-то вида, 
            console.error(е );
        }
});
```

### Последовательное выполнение нескольких асинхронных операций

```
function fetchSequentially(urls) {
  // Здесь мы будем сохранять тела URL по мере их извлечения, 
  const bodies = [];
  // Функция, возвращающая Promise, которая извлекает одно тело, 
  function fetchOne(url) {
    return fetch(url)
      .then(response => response.text())
      .then (body => {
        // Мы сохраняем тело в массив и преднамеренно опускаем
        // здесь возвращаемое значение (возвращая undefined)
        bodies.push(body);
      });
  }
  // Начать с объекта Promise, который будет удовлетворен 
  // прямо сейчас (со значением undefined)
  let р = Promise.resolve(undefined);
  // Пройти в цикле по желательным URL с построением цепочки Promise 
  // произвольной длины и извлечением одного URL на каждой стадии цепочки
  for (url of urls) {
    p = p.then(() => fetchOne(url));
  }
  // Когда удовлетворен последний объект Promise в этой цепочке, массив 
  // bodies готов. Следовательно, возвратить объект Promise для массива 
  //bodies.Обратите внимание, что мы не предусмотрели ни одного обработчика 
  //ошибок: мы хотим позволить ошибкам распространяться в вызывающий код 
  return р.then(() => bodies);
}

fetchSequentially(urls)
  .then(bodies => {/* делать что-нибудь с массивом строк */ })
  .catch(е => console.error(е));
```