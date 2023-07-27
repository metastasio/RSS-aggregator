// import { forEach } from 'lodash';

const RSSRender = (data) => {
  const feedList = document.querySelector('#feedList');
  feedList.innerHTML = '';

  const div = document.createElement('div');
  div.classList.add('card-body');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.setAttribute('data-i18n', 'feedTitle');
  h2.textContent = 'Feed';
  div.append(h2);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');
  feedList.append(div);

  data.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.feed.title;
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.feed.description;
    li.append(h3);
    li.append(p);
    ul.append(li)
    feedList.append(ul);
  });

};
export default RSSRender;
