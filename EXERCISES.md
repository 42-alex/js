# JS Exercises

## Exercises

### 1. Make a phone number ([source](https://www.codewars.com/kata/525f50e3b73515a6db000b83/javascript))

Create a function that accepts two arguments:
 - an array of ten integers from 0 to 9
 - format of phone number of string type

The function should return phone number as a string in the provided format.
Example: 
```makeNumber([1, 1, 2, 2, 3, 3, 4, 4, 5, 5], '(xxx) xxx-xx-xx');  // returns '(112) 233-44-55')```

## Solutions

### 1. Make a phone number
```
function makePhoneNumber(numbers, format){
  let result = format;
  
  for(var i = 0; i < numbers.length; i++)
  {
    result = result.replace('x', numbers[i]);
  }
  
  return format;
}
```