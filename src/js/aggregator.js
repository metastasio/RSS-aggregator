const parser = new DOMParser();

const aggregator = (url) => {
  return fetch(
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
        return { message: "This URL doesn't contain any RSS" };
      }
      const titleElement = parsed.querySelector('title');
      const title = titleElement.textContent;
      const descriptionElement = parsed.querySelector('description');
      const description = descriptionElement.textContent;
      const itemTags = parsed.querySelectorAll('item');
      const items = [...itemTags].map((item) => {
        const title = item.querySelector('title');
        const link = item.querySelector('link');
        return {
          title: title.innerHTML,
          link: link.innerHTML,
        };
      });

      return {
        title,
        description,
        link: url,
        items,
      };
    });
};
export default aggregator;
