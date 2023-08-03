import '../scss/styles.scss';
import 'bootstrap/js/dist/modal.js';
import * as yup from 'yup';
import render from './view.js';
import onChange from 'on-change';
import i18n from 'i18next';
import resources from './locales/index.js';
import aggregator from './aggregator.js';
import update from './RSSUpdate.js';
import _ from 'lodash';

const errorMessage = document.querySelector('.feedback');
const input = document.querySelector('input');

const newInstance = i18n.createInstance(
  {
    lng: 'ru',
    debug: true,
    resources,
  },
  (err) => {
    if (err) return console.log('something went wrong loading', err);
  },
);

const schema = yup.object().shape({
  url: yup.string().required().url(),
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
    lng: '',
    feedList: [],
    feedListItems: [],
    openPost: [],
  };

  const watchedState = onChange(state, (path, value) => {
    render(path, value, watchedState);
  });

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const URL = formData.get('url');
    const objectData = Object.fromEntries(formData);
    if (watchedState.feed.includes(URL)) {
      input.classList.remove('is-valid');
      input.classList.add('is-invalid');
      errorMessage.classList.remove('text-success');
      errorMessage.classList.add('text-danger');

      watchedState.state = 'invalid';
      watchedState.errors = { message: newInstance.t('double') };
    } else {
      watchedState.errors = validate(objectData);
      if (_.isEmpty(watchedState.errors)) {
        watchedState.status = 'pending';
        aggregator(URL)
          .then((result) => {
            if (result.message) {
              watchedState.errors = result;
              watchedState.state = 'invalid';
              watchedState.status = 'notSubmitted';
            } else {
              watchedState.state = 'valid';
              const feedID = _.uniqueId();
              const { items, ...rest } = result;
              const formattedResult = {
                ...rest,
                id: feedID,
              };
              watchedState.feedListItems = items.map((item) => {
                return { ...item, feedID: feedID, postID: _.uniqueId() };
              });
              document.querySelector('form').reset();
              input.focus();
              input.classList.remove('is-invalid');
              input.classList.add('is-valid');
              errorMessage.classList.remove('text-danger');
              errorMessage.classList.add('text-success');

              watchedState.feed.push(URL);
              watchedState.errors = { message: newInstance.t('success') };
              watchedState.feedList.push(formattedResult);
              watchedState.status = 'notSubmitted';
              let timerId = setTimeout(function tick() {
                update(watchedState);
                timerId = setTimeout(tick, 5000);
              }, 5000);
            }
          })
          .catch(() => (watchedState.errors = 'Network error'));
      } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        errorMessage.classList.remove('text-success');
        errorMessage.classList.add('text-danger');

        watchedState.state = 'invalid';
        watchedState.errors = { message: newInstance.t('incorrectURL') };
      }
    }
  });

  const lngButton = document.querySelector('#lng');
  lngButton.addEventListener('click', () => {
    watchedState.lng === 'ru'
      ? (watchedState.lng = 'eng')
      : (watchedState.lng = 'ru');
  });

  const modal = document.getElementById('modal');
  modal.addEventListener('show.bs.modal', function (event) {
    const button = event.relatedTarget;
    const title = button.getAttribute('data-bs-title');
    const link = button.getAttribute('data-bs-link');
    const description = button.getAttribute('data-bs-description');
    const id = button.getAttribute('data-post-id');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    const modalFooter = modal.querySelector('.modal-footer');
    const modalFooterLink = modalFooter.querySelector('a');
    modalFooterLink.setAttribute('href', link);
    modalTitle.textContent = title;
    modalBody.textContent = description;

    watchedState.openPost.push(id);
  });
};
app();
export { newInstance };
