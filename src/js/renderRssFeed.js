import _ from 'lodash';

const renderRSSFeed = (state) => {
  const feedList = document.querySelector('#feedList');
  feedList.innerHTML = '';

  const div = document.createElement('div');
  div.classList.add('card-body');
  const h2 = document.createElement('h2');
  h2.classList.add('card-title', 'h4');
  h2.setAttribute('data-i18n', 'feedTitle');
  h2.textContent = 'Feed';
  div.append(h2);
  feedList.append(div);
  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  state.forEach((feed) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');
    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.setAttribute('data-id', _.uniqueId());
    h3.textContent = feed.title;
    const p = document.createElement('p');
    p.classList.add('m-0', 'small', 'text-black-50');
    p.textContent = feed.description;
    li.append(h3);
    li.append(p);
    ul.prepend(li);
    feedList.append(ul);
  });

  
};

const renderRSSPosts = (state) => {
    console.log(state)
    const contentList = document.querySelector('#contentList');
    contentList.innerHTML = '';

    const div2 = document.createElement('div');
    div2.classList.add('card-body');
      const h2Posts = document.createElement('h2');
      h2Posts.classList.add('card-title', 'h4');
      h2Posts.setAttribute('data-i18n', 'postsTitles');
      h2Posts.textContent = 'Posts';
      div2.append(h2Posts);
      contentList.append(div2);
      const ul2 = document.createElement('ul');
      ul2.classList.add('list-group', 'border-0', 'rounded-0');
      
      
      const posts = feed.items;
      posts.forEach((item) => {
            const id = _.uniqueId();
            const li = document.createElement('li');
            li.classList.add(
                  'list-group-item',
                  'd-flex',
                  'justify-content-between',
                  'align-items-start',
                  'border-0',
          'border-end-0',
        );
        const a = document.createElement('a');
        a.setAttribute('href', item.link);
        a.classList.add('fw-bold');
        a.setAttribute('data-id', id);
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
        a.textContent = item.title;
        li.append(a);
        const button = document.createElement('button');
        button.setAttribute('type', 'button');
        button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
        button.setAttribute('data-id', id);
        button.setAttribute('data-bs-toggle', 'modal');
        button.setAttribute('data-bs-target', '#modal');
        button.setAttribute('data-i18n', 'postButton');
        button.textContent = 'Read';
        li.append(button);
        ul2.prepend(li);
        contentList.append(ul2);
      });
    };
    export { renderRSSFeed, renderRSSPosts };
