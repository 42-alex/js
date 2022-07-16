
// handle event
document.addEventListener('myBusyStatus', e => {
  const loader = document.querySelector('.loader');
  if (e?.detail?.isFetching) {
    loader.classList.add('active')
  } else {
    loader.classList.remove('active')
  }
})

// emit event
const switchFetchingStatus = isFetching => {
  document.dispatchEvent(
    new CustomEvent(
      'myBusyStatus',
      { detail: { isFetching }}
    )
  );
}

switchFetchingStatus(true);

// async operation
let promise = new Promise(resolve => {
  setTimeout(resolve, 3000)
});
promise
	.then(successHandler)
	.catch(errorHandler)
	.finally(
	  () => switchFetchingStatus(false)
	);

function successHandler() { /* do something */ }
function errorHandler() { /* do something */ }
