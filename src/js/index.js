import '../scss/styles.scss';
import * as yup from 'yup';
import isEmpty from 'lodash/isEmpty.js';
// import onChange from 'on-change';

const form = document.querySelector('form');
const errorMessage = document.getElementById('URLValidationMessage');
const input = document.querySelector('input');

const schema = yup.object().shape({
  url: yup.string().url(),
});

const validate = (input) => {
  try {
    schema.validateSync(input, { abortEarly: false });
    return {};
  } catch (e) {
    return e;
  }
};

const hanleInputState = () => {};
const render = (state) => {
  if (state.state === 'valid') {
    document.querySelector('form').reset();
    input.focus();
    input.classList.remove('is-invalid');
    input.classList.add('is-valid');
    errorMessage.classList.remove('invalid-feedback');
    errorMessage.classList.add('valid-feedback');
    errorMessage.textContent = 'RSS was added to the feed';
  } else if (state.state === 'invalid') {
    input.classList.remove('is-valid');
    input.classList.add('is-invalid');
    errorMessage.classList.remove('valid-feedback');
    errorMessage.classList.add('invalid-feedback');
    errorMessage.textContent = state.errors.message;
  }
  console.log(state);
};

const app = () => {
  const state = {
    status: 'notSubmitted',
    feed: [],
    errors: {},
    state: '',
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const objectData = Object.fromEntries(formData);
    if (state.feed.includes(formData.get('url'))) {
      state.state = 'invalid';
      state.errors = { message: 'Has already been added' };
      render(state);
    } else {
      state.errors = validate(objectData);
      if (isEmpty(state.errors)) {
        state.state = 'valid';
        state.feed.push(formData.get('url'));
      } else {
        state.state = 'invalid';
      }
      render(state);
    }
  });
};
app();
