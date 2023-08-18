import '../scss/styles.scss';
import 'bootstrap/js/dist/modal.js';
import * as yup from 'yup';
import onChange from 'on-change';
import _ from 'lodash';
import render from './view.js';
import aggregator from './aggregator.js';
import update from './RSSUpdate.js';
import { newInstance, setLocales } from './locales/index.js';
import elements from './elements.js';

const app = () => {
  // const setLocales = () => {
  //   elements.getInterfaceLanguages().forEach((locale) => {
  //     const initialLocale = locale;
  //     initialLocale.textContent = newInstance.t(locale.dataset.i18n);
  //   });
  // };
  setLocales();

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

  // eslint-disable-next-line no-unused-vars
  let timerId = setTimeout(function tick() {
    update(watchedState);
    timerId = setTimeout(tick, 5000);
  }, 5000);

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

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const URL = formData.get('url');
    const objectData = Object.fromEntries(formData);

    const validation = validate(objectData);
    if (_.isEmpty(validation)) {
      watchedState.status = 'pending';
      aggregator(URL).then((result) => {
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
        }
      });
      watchedState.state = '';
    } else {
      watchedState.state = 'invalid';
      watchedState.errors = validation;
    }
  });

  elements.lngButton.addEventListener('click', () => {
    if (watchedState.lng === 'eng') {
      watchedState.lng = 'ru';
    } else {
      watchedState.lng = 'eng';
    }
  });

  elements.modal.addEventListener('show.bs.modal', (event) => {
    const button = event.relatedTarget;
    const title = button.getAttribute('data-bs-title');
    const link = button.getAttribute('data-bs-link');
    const description = button.getAttribute('data-bs-description');
    const modalTitle = elements.modal.querySelector('.modal-title');
    const modalBody = elements.modal.querySelector('.modal-body');
    const modalFooter = elements.modal.querySelector('.modal-footer');
    const modalFooterLink = modalFooter.querySelector('a');
    modalFooterLink.setAttribute('href', link);
    modalTitle.textContent = title;
    modalBody.textContent = description;
  });
};
app();
export default setLocales;
