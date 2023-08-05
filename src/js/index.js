import '../scss/styles.scss';
import 'bootstrap/js/dist/modal.js';
import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';
import render from './view.js';
import aggregator from './aggregator.js';
import update from './RSSUpdate.js';
import newInstance from './locales/index.js';

const app = () => {
  const state = {
    status: '',
    feed: [],
    errors: {},
    state: '',
    lng: 'ru',
    feedList: [],
    feedListItems: [],
    openPost: [],
  };

  const watchedState = onChange(state, (path, value) => {
    render(path, value, watchedState);
  });

  const schema = yup.lazy(() =>
    yup.object().shape({
      url: yup
        .string(newInstance.t('incorrectURL'))
        .required(newInstance.t('empty'))
        .url(newInstance.t('incorrectURL'))
        .notOneOf(watchedState.feed, newInstance.t('double')),
    }),
  );

  const validate = (input) => {
    try {
      schema.validateSync(input, { abortEarly: false });
      return {};
    } catch (e) {
      return e;
    }
  };

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const URL = formData.get('url');
    const objectData = Object.fromEntries(formData);
    let timerId;

    const validation = validate(objectData);
    if (_.isEmpty(validation)) {
      clearTimeout(timerId);
      watchedState.status = 'pending';
      aggregator(URL)
        .then((result) => {
          if (result.message) {
            watchedState.errors = result;
            watchedState.state = 'invalid';
            watchedState.status = '';
          } else {
            watchedState.feed.push(URL);
            watchedState.status = '';
            watchedState.state = 'valid';
            const feedID = _.uniqueId();
            const { items, ...rest } = result;
            const formattedResult = {
              ...rest,
              id: feedID,
            };
            const updatedPosts = items
              .map((item) => ({
                ...item,
                feedID,
                postID: _.uniqueId(),
              }))
              .reverse();
            watchedState.feedListItems.push(...updatedPosts);
            watchedState.feedList.push(formattedResult);
            timerId = setTimeout(function tick() {
              update(watchedState);
              timerId = setTimeout(tick, 5000);
            }, 5000);
          }
        })
        // .catch(() => {
        //   watchedState.errors = newInstance.t('networkError');
        // });
      watchedState.state = '';
    } else {
      watchedState.state = 'invalid';
      watchedState.errors = validation;
    }
  });

  const lngButton = document.querySelector('#lng');
  lngButton.addEventListener('click', () => {
    if (watchedState.lng === 'eng') {
      watchedState.lng = 'ru';
    } else {
      watchedState.lng = 'eng';
    }
  });

  const modal = document.getElementById('modal');
  modal.addEventListener('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    const title = button.getAttribute('data-bs-title');
    const link = button.getAttribute('data-bs-link');
    const description = button.getAttribute('data-bs-description');
    const modalTitle = modal.querySelector('.modal-title');
    const modalBody = modal.querySelector('.modal-body');
    const modalFooter = modal.querySelector('.modal-footer');
    const modalFooterLink = modalFooter.querySelector('a');
    modalFooterLink.setAttribute('href', link);
    modalTitle.textContent = title;
    modalBody.textContent = description;
  });
};
app();
