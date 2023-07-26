const parser = new DOMParser();

const aggregator = (url) => {
 return fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(url)}`)
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error('Network response was not ok.');
    })
    .then((data) => {
      const parsed = parser.parseFromString(data.contents, 'application/xml');
      // parsed.querySelector('title');
      console.log(parsed);
      return parsed;
    });
};
export default aggregator;
