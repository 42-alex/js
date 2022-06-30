# Date

### How to get day name from date

```
    let date = new Date()
    let dayNameEn = date.toLocaleDateString("en-US", { weekday: 'long' });  // Monday
    let dayNameRu = date.toLocaleDateString("ru-RU", { weekday: 'long' });  // Понедельник
```