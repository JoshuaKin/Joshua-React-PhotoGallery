import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import Gallery from './components/Gallery.component/GalleryApp.js';
import BgMusic from './components/BgMusic.component/BgMusicApp.js';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render( < Gallery / > , document.getElementById('gallery'));
ReactDOM.render( < BgMusic / > , document.getElementById('BgMusic'));
registerServiceWorker();
