import aggregator from './aggregator';

const update = (watchedState) => {
  watchedState.feed.forEach((URL) =>
    aggregator(URL).then((result) => {
      const getCorrectFeed = (element) => element.link === URL;
      const correctFeed = watchedState.feedList.findIndex(getCorrectFeed);
      watchedState.feedList[correctFeed].items = [];
      watchedState.feedList[correctFeed].items.push(result.items);
    }),
  );
};
export default update;
