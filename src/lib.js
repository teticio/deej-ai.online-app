export const createArray = length => [...Array(length)];

var timerId;

export const debounceFunction = function (func, delay) {
  // Cancels the setTimeout method execution
  clearTimeout(timerId)

  // Executes the func after delay time.
  timerId = setTimeout(func, delay)
}
