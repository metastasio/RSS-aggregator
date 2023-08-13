import axios from 'axios';
import newInstance from './locales/index.js';
import rssParser from './parser.js';

const aggregator = (url) => axios
  .get(
    `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
      url,
    )}`,
    { timeout: 5000 },
  )
  .then((data) => rssParser(data, url))
  .catch(() => ({ message: newInstance.t('networkError') }));
export default aggregator;
