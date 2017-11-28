import React from 'react';
import './main.scss';
let musicDatas=require('../../data/musics.json');
let getUrl;
musicDatas = (getUrl = (json) => {
    json.map((content, index) => {
        let singleMusicData = json[index];
        singleMusicData.url = require('../../musics/' + singleMusicData.fileName);
        json[index] = singleMusicData;
    });
    return json;
})(musicDatas);
musicDatas = getUrl(musicDatas);

/*获取区间内的随机数*/
let getRandom=(low,high)=>{
  return Math.ceil(Math.random()*(high-low)+low);
};

/*主程序App*/
class App extends React.Component {
	handleClick(e){
		if (this.state.isPlay) {
			this.audio.pause();
			this.setState({
				isPlay:false
			});
		}
		else {
			this.audio.play();
			this.setState({
				isPlay:true
			});
		}
	    e.stopPropagation();
	    e.preventDefault();
 	}
	constructor(props){
      super(props);
      this.audio=null;
      this.state={
      	isPlay:false
      }
	} 
	componentDidMount(){
		this.audio=document.getElementById('bg-music');
		this.audio.play();
		this.setState({
			isPlay:true
		})
	}
	render() {
		let nowMusic=musicDatas[getRandom(0,musicDatas.length-1)].url;
		let styleObj=this.state.isPlay?'bg-music is-rotate':'bg-music stop-rotate';
		return(
			<div className={styleObj} onClick={this.handleClick.bind(this)}>
				<audio id="bg-music">
       		 		<source src={nowMusic} type="audio/mp3" className="bg-logo" />
       		 	</audio>
   			</div>
		);
	}

}
/**/
/*暴露App主程序组件*/
export default App;