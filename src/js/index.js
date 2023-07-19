import '../scss/styles.scss';
import * as yup from 'yup';
import onChange from 'on-change';

const re =
  /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;

const schema = yup.object().shape({
  website: yup.string().matches(re, 'URL is not valid'),
});

const validate = (input) => {
  try {
    schema.validateSync(input, { abortEarly: false });
    return {};
  } catch (e) {
    return e;
  }
};

const hanleInputState = () => {};
const render = (state) => {
  console.log(state);
  // console.log(state)
};

const app = () => {

  const initialState = {
    status: 'notSubmitted',
    website: [],
    errors: {},
  };

  const state = onChange(initialState, render(initialState));

  const form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = new FormData(e.target);
    state.errors = validate(value);
    // const objectData = Object.fromEntries(data);
  });
};
app();
