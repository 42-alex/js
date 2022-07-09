### Custom events.

The next example will show you how to show and hide a loader for users while you execute some asynchronous operation
```

// register handler for our custom event
document.addEventListener('myBusyStatus', e => {
  const loader = document.querySelector('.loader');
  if (e?.detail?.isFetching) {
    loader.classList.add('active')  //  just add "active" class to show loader
  } else {
    loader.classList.remove('active')   //  just remove "active" class to hide loader
  }
})

// emit custom event
const switchFetchingStatus = isFetching => {
  document.dispatchEvent(
    new CustomEvent(
      'myBusyStatus',               // any name you want
      { detail: { isFetching }}     // set any value in 'detail' prop, it will be considered as content of your event
    )
  );
};
switchFetchingStatus(true);     // show a loader after async request

// async operation imitation
let promise = new Promise(resolve => {
  setTimeout(resolve, 3000)
});
promise
	.then(successHandler)  // successHandler defined in other place
	.catch(errorHandler)   // errorHandler defined in other place
	.finally(
	  () => switchFetchingStatus(false)     // hide a loader after async request
	);
	
function successHandler() { /* do something */ }
function errorHandler() { /* do something */ }
```