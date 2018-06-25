import React, {Component} from 'react';
import axios from 'axios';
import qs from 'qs';
import Title from '../Title';

class AboutJsd extends Component{
    constructor (props){
        super(props);
        this.state = {
            about_us: "",
            warningDlgShow: false,
            warningText: "",
        }
    }
    getSundry () { //一些杂项的数据
        const self = this;
        axios.post(window.baseUrl + "/home/Login/getSundry", qs.stringify({
        })).then(re=>{
          const data = re.data;
          const code = re.code;
         if(data.code === 1){ //成功
          self.setState({
            about_us: data.data.about_us
          })
          localStorage.setItem("sundryData", JSON.stringify(data.data));  //后面的页面时不时要用到的 先存着
         } else {
            this.setState({
              warningDlgShow: true,
              warningText: data.msg,
          }, function(){
              this.hanleWarningDlgTimer()
          })
         }
        })
      }
      componentDidMount (){
        this.getSundry()
      }
    render (){
        return <div>
            <Title title = "关于KGC"/>
            <p className="fc_white fz_26" style={{lineHeight: ".25rem", textIndent: '.2rem', padding: '.2rem'}}
                dangerouslySetInnerHTML = {{__html: this.state.about_us}} >
            </p>
        </div>
    }
}

export default AboutJsd;