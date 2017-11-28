import React from 'react';
import ReactDOM from 'react-dom';
import './main.scss'

let getRandImgsDatas=()=>{
  /*给图片json添加真实url地址*/
  let rawImgsDatas = require('../../data/imgs.json');
  let imgsDatas=[],tmpArr=[],maxGet=10;
  rawImgsDatas.map((item) => {
    tmpArr.push(item);
  });
  for(var i = 0 ; i < maxGet ; i++){
    let index=Math.floor(Math.random()*tmpArr.length);
    imgsDatas.push(tmpArr[index]);
    tmpArr.splice(index,1);
  }
  let getUrl;
  imgsDatas = (getUrl = (json) => {
      json.map((content, index) => {
          let singleImgData = json[index];
          singleImgData.imgUrl = require('../../imgs/' + singleImgData.fileName);
          json[index] = singleImgData;
      });
      return json;
  })(imgsDatas);
  return getUrl(imgsDatas);
}
let imgsDatas=getRandImgsDatas();

/*获取区间内的随机数*/
let getRandom=(low,high)=>{
  return Math.ceil(Math.random()*(high-low)+low);
};
/*获取旋转角度的范围*/
let getDegRandom=()=>{
  let baseDeg = 30;
  return (Math.random()>0.5?'':'-')+Math.ceil(Math.random()*baseDeg);
}
/*控制自动切换*/
let reArrangeCtr=null;
let autoReArrange=function(_self){
    clearInterval(reArrangeCtr);
    reArrangeCtr=setInterval(() => {
      // imgsDatas=getRandImgsDatas();
      let tmpNow=_self.state.imgsArrangeArr.findIndex((item)=>{
      return item.isCenter;
      });
      let tmpRand=getRandom(0,imgsDatas.length-1);
      for(;;){
        if (tmpRand!=tmpNow) {
          break;
        }else{
          tmpRand=getRandom(0,imgsDatas.length-1);
        }
      }
      _self.rearrange(tmpRand); 
    }, 5000);
}
/*显示图片子组件*/
class ImgFigure extends React.Component{
  /*
  * ImgFigure 的点击处理函数
  */
  handleClick(e){
    if(this.props.arrange.isCenter){
      this.props.inverse();
    } 
    else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }
  render() {
    /*改变图片位置*/
    let styleObj=this.props.arrange.pos||{};
    /*如果图片旋转角度有值，且不是0*/
    if(this.props.arrange.rotate){
      ['MozTransform','msTransform','WebkitTransform','transform'].forEach(function(data){
        // styleObj[data] = 'rotate('+this.props.arrange.rotate+'deg)';
        Object.defineProperty(styleObj,data,{
          value: `rotate(${this.props.arrange.rotate}deg)`,
          // writable:true,
          enumerable:true,
          // configurable:true
        });
      }.bind(this));
    }  

    let igmFigureClassName = 'img-figure';
    igmFigureClassName += this.props.arrange.isInverse?' is-inverse':'';


    /*添加z-index 避免遮盖*/
    Object.defineProperty(styleObj,'zIndex',{value: this.props.arrange.isCenter? 11:-11,enumerable:true});

    return ( 
      <figure className={igmFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}> 
      <img src={this.props.data.imgUrl} alt={this.props.data.title} />
       < figcaption > 
        < h2 className='img-title'>{this.props.data.title}< /h2>
        <div className='img-back' onClick={this.handleClick.bind(this)}>
          <p>
            {this.props.data.desc}
          </p>
        </div>
       </figcaption > 
      < /figure >
    )
  }
};
/**/
/*控制组件*/
class CtrUnit extends React.Component {
  handleClick(e){
    /*如果点击的居中图片，则翻转；否则居中*/
    if(this.props.arrange.isCenter){
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }
  render() {
    let ctrClassName='ctr-unit';
    /*如果对应居中的图片*/
    ctrClassName += this.props.arrange.isCenter?' is-center':'';
    /*如果对应翻转的图片*/
    ctrClassName +=this.props.arrange.isInverse? ' is-inverse':'';

    return(
      <span className={ctrClassName} onClick={this.handleClick.bind(this)}></span>
      )
  }
}
/**/
/*主组件*/
class App extends React.Component { 
  constructor(props){
      super(props);
      this.Constant={
        centerPos:{/*中心位置*/
          left:0,
          right:0
        },
        hPosRange:{/*水平方向的取值范围*/
          leftSecX:[0,0],
          rightSecX:[0,0],
          y:[0,0]
        },
        vPosRange:{/*垂直方向的取值范围*/
          x:[0,0],
          topY:[0,0]
        }
      }
      this.state={
        imgsArrangeArr:[
        /*{
          pos:{
            left:'0',
            top:'0'
          } 
          rotate: 0,
          isInverse:false
        }*/
        ]
      }
  } 
  /**
   * 重新布局所有图片
   * @param  {[type]} centerIndex [指定居中排布哪个图片]
   * @return {[type]}             [description]
   */
  rearrange(centerIndex){
    let imgArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeleftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],
        /*上侧图片的数值，可有可无。0或者1*/
        topImgNum = Math.floor(Math.random() * 2),
        /*上侧图片是从哪个位置拿出来的*/
        topImgSpliceIndex = 0,
        /*中心图片的状态信息*/
        imgsArrangeCenterArr = imgArrangeArr.splice(centerIndex, 1);
        /*居中 centerIndex*/
        /*居中的图片不需要旋转*/
        imgsArrangeCenterArr[0] ={
          pos: centerPos,
          rotate:0,
          isCenter:true
        }

        /*取出要布局上侧图片的状态信息*/
        topImgSpliceIndex = Math.ceil(Math.random() * (imgArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgArrangeArr.splice(topImgSpliceIndex, topImgNum);

        /*布局上侧图片*/
        imgsArrangeTopArr.forEach(function (value, index) {
          imgsArrangeTopArr[index] = {
            pos :{
              top: getRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
              left: getRandom(vPosRangeX[0], vPosRangeX[1])
            },
            rotate:getDegRandom(),
            isCenter: false
          }
      });

      /*布局左右两侧的图片*/
      for (var i = 0, j = imgArrangeArr.length, k = j / 2; i < j; i++) {
        var hPosRangeLORX = null; //左区域或者右区域的取值范围
        /*前半部分布局左边，右半部分布局右边*/
        if (i < k) {
          hPosRangeLORX = hPosRangeleftSecX;
        } else {
          hPosRangeLORX = hPosRangeRightSecX;
        }
        imgArrangeArr[i] ={
          pos : {
            top: getRandom(hPosRange.y[0], hPosRange.y[1]),
            left: getRandom(hPosRangeLORX[0], hPosRangeLORX[1])
          },
          rotate:getDegRandom(),
          isCenter: false
        };
      }
    /*把取出来的图片放回去*/
    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }
    imgArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);
    this.setState({
      imgArrangeArr: imgArrangeArr
    });
  }
  /*组件加载以后,为每一张图片计算其位置的范围*/
  componentDidMount(){
    /*首先拿到舞台的大小*/
    let stageDom=ReactDOM.findDOMNode(this.refs.stage),
        stageW = stageDom.scrollWidth,
        stageH = stageDom.scrollHeight,
        halfStageW = Math.ceil(stageW / 2),
        halfStageH = Math.ceil(stageH / 2);
    /*拿到一个imgFigure的大小*/
    let imgFigureDom=ReactDOM.findDOMNode(this.refs.imgFigure0),
        imgW = imgFigureDom.scrollWidth,
        imgH = imgFigureDom.scrollHeight,
        halfImgW = Math.ceil(imgW / 2),
        halfImgH = Math.ceil(imgH / 2);

    /*计算中心图片的位置点*/
    this.Constant.centerPos={
        left: halfStageW - halfImgW,
        top: halfStageH - halfImgH
    }
    /*计算左侧,右侧图片排布位置的取值范围*/
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;
    /*计算上侧区域图片排布位置 的取值范围*/
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;
    /*处于居中的图片设置*/
    this.rearrange(getRandom(0,imgsDatas.length-1));
    autoReArrange(this)
  }
   /*
  * 翻转图片
  * @params index 输入当前被执行inverse操作的图片对应的index
  * @return {Function} 这是一个闭包函数，其内return一个真正等待被执行的函数
  */
  inverse(index) {
    return function (){
      let imgArrangeArr = this.state.imgArrangeArr;
      imgArrangeArr[index].isInverse = !imgArrangeArr[index].isInverse;
      clearInterval(reArrangeCtr);
      autoReArrange(this);
      this.setState({
        imgArrangeArr: imgArrangeArr
      });
    }.bind(this);
  }
  /*
  * 利用rearrange函数，居中对应index的图片
  * @param index ，需要居中的图片index
  * @return {Function}
  */
  center(index){
    return function(){
      clearInterval(reArrangeCtr);
      this.rearrange(index);
    }.bind(this);
  }
  render() {
    /*给子组件传参*/
    let ctrUnits = [],imgFigures = [];
    imgsDatas.forEach(function(value,index){
      if (!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index]={
          pos:{
            top:'0',
            left:'0'
          },
          rotate:'0',
          isInverse:false,
          isCenter:false
        }
      }
      imgFigures.push( < ImgFigure data = { value } key={index} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/> )
      /**/
      ctrUnits.push(<CtrUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>)
    }.bind(this))
    /**/
    return ( 
      <section className = "stage" ref="stage">
        <section className = "img-sec" > {imgFigures}</section> 
        <nav className = "ctr-nav" >{ctrUnits}</nav> 
      < /section > 
    )
  }
};

/**/
/*暴露App主程序组件*/
export default App;