// import _ from 'lodash';

const parser = new DOMParser();

const aggregator = (url) => {
  console.log();
  return fetch(
    `https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`,
  )
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    })
    .then((data) => {
      const parsed = parser.parseFromString(data.contents, 'application/xml');

      if (parsed.querySelector('parsererror')) {
        return { message: "This URL doesn't contain any RSS" };
      }
      const titleElement = parsed.querySelector('title');
      const title = titleElement.textContent;
      const descriptionElement = parsed.querySelector('description');
      const description = descriptionElement.textContent;
      const itemTags = parsed.querySelectorAll('item');
      const items = [];
      itemTags.forEach((item) => {
        const title = item.querySelector('title');
        const link = item.querySelector('link');
        items.push({
          title: title.innerHTML,
          link: link.innerHTML,
        });
      });

      return {
        feed: {
          title: title,
          description: description,
        },
        items: items,
      };
    });
};
export default aggregator;
