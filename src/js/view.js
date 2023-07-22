const errorMessage = document.querySelector('.feedback');
// const input = document.querySelector('input');

const render = (path, value) => {
  if (path === 'errors') {
    errorMessage.textContent = value.message;
  } else if (path === 'state' && value === 'valid') {
    errorMessage.textContent = 'RSS was added to the feed';
  }
};

export default render;
