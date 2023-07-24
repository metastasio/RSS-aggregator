import '../scss/styles.scss';
import * as yup from 'yup';
import isEmpty from 'lodash/isEmpty.js';
import render from './view.js';
import onChange from 'on-change';
import i18n from 'i18next';
import resources from './locales.js';

const errorMessage = document.querySelector('.feedback');
const input = document.querySelector('input');

const newInstance = i18n.createInstance(
  {
    lng: 'en',
    debug: true,
    resources,
  },
  (err, t) => {
    if (err) return console.log('something went wrong loading', err);
  },
);

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

const app = () => {
  const state = {
    status: 'notSubmitted',
    feed: [],
    errors: {},
    state: '',
  };

  const watchedState = onChange(state, render);

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const objectData = Object.fromEntries(formData);
    if (watchedState.feed.includes(formData.get('url'))) {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      errorMessage.classList.remove('text-success');
      errorMessage.classList.add('text-danger');
      watchedState.state = 'invalid';
      watchedState.errors = { message: newInstance.t('double') };
    } else {
      watchedState.errors = validate(objectData);
      if (isEmpty(state.errors)) {
        document.querySelector('form').reset();
        input.focus();
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        errorMessage.classList.remove('text-danger');
        errorMessage.classList.add('text-success');
        watchedState.state = 'valid';
        watchedState.feed.push(formData.get('url'));
        watchedState.errors = { message: newInstance.t('success') };
      } else {
        watchedState.state = 'invalid';
        watchedState.errors = { message: newInstance.t('incorrectURL') };
      }
    }
  });
};
app();
