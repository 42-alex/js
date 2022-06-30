# Date

### How to get the current timestamp

```
    Date.now();             // option #1
    +new Date;              // option #2
    Number(new Date());     // option #3
    new Date().valueOf();   // option #4
    new Date().getTime();   // option #5
```

### How to get a day name from a date

```
    let date = new Date()
    let dayNameEn = date.toLocaleDateString("en-US", { weekday: 'long' });  // Monday
    let dayNameRu = date.toLocaleDateString("ru-RU", { weekday: 'long' });  // Понедельник
```