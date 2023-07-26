const RSSRender = (data) => {
  const feedList = document.querySelector('#feedList');
  const title = data.querySelector('title');
  const titleContent = title.textContent;
  const description = data.querySelector('description');
  const descriptionContent = description.textContent;

  feedList.innerHTML = `<div class="card-body"><h2 class="card-title h4" data-i18n="feedTitle">Feed</h2></div>
  <ul class="list-group border-0 rounded-0"><li class="list-group-item border-0 border-end-0">
  <h3 class="h6 m-0">${titleContent}</h3>
  <p class="m-0 small text-black-50">${descriptionContent}</p></li></ul>`;

  //   feedList.innerHTML = `<ul class="list-group border-0 rounded-0"><li class="list-group-item border-0 border-end-0"><h3 class="h6 m-0">${titleContent}</h3><p class="m-0 small text-black-50">${descriptionContent}</p></li></ul>`;

  //   const ul = document.createElement('ul');
  //   ul.classList.add('list-group', 'border-0', 'rounded-0');
  //   const li = document.createElement('li');
  //   li.classList.add('list-group-item', 'border-0', 'border-end-0');
  //   const h3 = document.createElement('h3');
  //   h3.classList.add('h6', 'm-0');
  //   const title = data.querySelector('title');
  //   const titleContent = title.textContent;
  //   h3.textContent = titleContent;
  //   const p = document.createElement('p');
  //   p.classList.add('m-0', 'small', 'text-black-50');
  //   const description = data.querySelector('description');
  //   const descriptionContent = description.textContent;
  //   p.textContent = descriptionContent;
  //   li.prepend(p);
  //   li.prepend(h3);
  //   ul.prepend(li);
  //   feedList.append(ul);
};
export default RSSRender;
