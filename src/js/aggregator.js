import newInstance from './locales/index.js';

const parser = new DOMParser();

const aggregator = (url) =>
  fetch(
    `https://allorigins.hexlet.app/get?disableCache=true&url=${encodeURIComponent(
      url,
    )}`,
  )
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    })
    .then((data) => {
      const parsed = parser.parseFromString(data.contents, 'application/xml');

      if (parsed.querySelector('parsererror')) {
        return { message: newInstance.t('noRSS') };
      }
      const titleElement = parsed.querySelector('title');
      const feedTitle = titleElement.textContent;
      const descriptionElement = parsed.querySelector('description');
      const feedDescription = descriptionElement.textContent;
      const itemTags = parsed.querySelectorAll('item');
      const items = [...itemTags].map((item) => {
        const title = item.querySelector('title');
        const link = item.querySelector('link');
        const description = item.querySelector('description');
        return {
          title: title.innerHTML
            .trim()
            .replace(/^(\/\/\s*)?<!\[CDATA\[|(\/\/\s*)?\]\]>$/g, ''),
          link: link.innerHTML,
          description: description.innerHTML
            .trim()
            .replace(/^(\/\/\s*)?<!\[CDATA\[|(\/\/\s*)?\]\]>$/g, ''),
        };
      });

      return {
        title: feedTitle,
        description: feedDescription,
        link: url,
        items,
      };
    });
export default aggregator;
