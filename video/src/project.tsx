import {makeProject} from '@revideo/core';
import './fonts.css';
import main from './scenes/main';

export default makeProject({
  scenes: [main],
  settings: {
    shared: {size: {x: 1920, y: 1080}, background: '#080a09'},
    rendering: {fps: 30},
  },
});
