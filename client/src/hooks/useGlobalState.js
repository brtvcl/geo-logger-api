import { useEffect, useState } from "react";

function nanoid(length = 6) {
  const alphabet = "QWERTYUIOPASDFGHJZXCVB";
  return Array(length)
    .fill(null)
    .map(() => {
      return alphabet[Math.floor(Math.random() * alphabet.length)];
    })
    .join("");
}

const defaultValues = {
  count: 5,
};

const store = {};

Object.entries(defaultValues).forEach(([key, value]) => {
  store[key] = {
    value,
    listeners: {},
  };
});

function setState(key, value) {
  // Update Value
  store[key].value = value;
  // Call listeners
  Object.values(store[key].listeners).forEach((listener) => {
    listener(value);
  });
}

function initKey(key, defaultValue) {
  if (!store[key]) {
    store[key] = {
      value: defaultValue,
      listeners: {},
    };
  }
}

function addStateListener(key, callback) {
  const listenerId = nanoid();

  store[key].listeners[listenerId] = callback;

  return listenerId;
}

function removeStateListener(key, id) {
  delete store[key].listeners[id];
}

/**
 *
 * @param {*} key
 * @param {*} defaultValue
 * @returns {[any, Function]}
 */
export default function useGlobalState(key, defaultValue) {
  // Init key
  initKey(key, defaultValue);

  // Value
  const value = store[key]?.value;

  const [internalState, setInternalState] = useState(value);

  // Listen to state changes
  useEffect(() => {
    // register state listener
    const listenerId = addStateListener(key, (value) => {
      console.log("state updated", key);
      setInternalState(value);
    });

    return () => {
      removeStateListener(key, listenerId);
    };
  }, []);

  function setter(value) {
    setState(key, value);
  }

  return [internalState, setter];
}
