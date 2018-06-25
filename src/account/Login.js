import React, { Component } from 'react';
import {Link, Redirect} from 'react-router-dom';
import './../css/css/account.css';
import axios from 'axios';
import qs from 'qs';
import Title from './../Title';
import MachineM from '../machineMarket/index';
import ForgetPwd from './ForgetPwd';
import WarningDlg from './../WarningDlg';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      adminPic: "",
      logined: false,
      keepPwd: false,
      phone: localStorage.getItem("phone") || "",
      l_pass: "",
      warningDlgShow: false,
      warningText: ""
    };
  }
  changeInputVal = (e) => { //input change事件
      this.setState({
        [e.name]: e.value
      })
  }
  keepPwdEvent (){ //记住密码--> 转变为记住手机号吗
    const keepPwd = this.state.keepPwd;
    const phone = this.state.phone;
    this.setState({
      keepPwd: !keepPwd
    }, function(){
      localStorage.setItem("phone", phone);
    })
  }
  checkMobile (phone){ //手机号码验证
    if(!(/^1[3|4|5|8|9][0-9]\d{4,8}$/.test(phone))){ 
     return false; 
    } else{
      return true;
    }
  }
  hanleWarningDlgTimer (){  //定时关闭 警告弹窗
    const self = this;
    setTimeout(
        function(){
            self.setState({
                warningDlgShow: false
            })
        }
    , 1000)
  }
  login = (e) => { //登录
    const phone = this.state.phone;
    const l_pass = this.state.l_pass;
    if(!this.checkMobile(phone)){
      alert("请输入正确的手机号码");
    }
    axios.post(window.baseUrl + '/home/Login/login', qs.stringify({
      phone: phone,
      l_pass: l_pass
    })).then(re=>{
      const data = re.data;
      if(data.code === -3){ //登录失败
        this.setState({
            warningDlgShow: true,
            warningText: "登录失败，请确认账号密码是否正确",
        }, function(){
          this.hanleWarningDlgTimer()
      })
      } 
       if(data.code === 1){  //登录成功
        localStorage.setItem("logined", true);
        localStorage.setItem("token", data.data.token);
        this.setState({
          logined: true
        })
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
  getSundry () { //一些杂项的数据
    const self = this;
    axios.post(window.baseUrl + "/home/Login/getSundry", qs.stringify({
      // token: token,
    })).then(re=>{
      const data = re.data;
      const code = re.code;
     if(data.code === 1){ //成功
      self.setState({
        adminPic: data.data.adminpic
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
  render() {
    if(this.state.logined) {
      return (
       <Redirect to="/machineMarket"/>
      )
     }
    return (
      <div>
        <Title title="登录页面"/>
        <div className="logo" style = {{backgroundImage: "url(" + window.baseUrl + this.state.adminPic +")"}}></div>
        <div className="over_hidden primary_form">
          <ul className = "f_flex">
            <li>
              <label>手机号</label>
              <input type = "text" placeholder="手机号" value={this.state.phone} onChange={e => {
                this.changeInputVal({name: "phone", value: e.target.value})
              }} />
            </li>
            <li>
              <label>请输入密码</label>
              <input type = "password" placeholder="请输入密码" value={this.state.l_pass} onChange={e => {
                this.changeInputVal({name: "l_pass", value: e.target.value})
              }} />
            </li>
          </ul>
          <div className="f_lt mt_50" style={{width: '100%', lineHeight: '.15rem'}}>
            <span>
              <span className="keepPwd fz_30 fc_gray f_lt"
                onClick = {e => {
                  this.keepPwdEvent()
                }}
              >{this.state.keepPwd ? <span>√</span> : null}</span>
              <label className="fz_26 fc_gray f_lt ml_10">记住手机号</label>
            </span>
            <Link to = "/account/forgetLoginPwd"><span className="fz_26 fc_gray f_rt">忘记密码？</span></Link>
          </div>
          <span className="btn btn_primary fz_26 mt_50" style={{width: '100%'}}
          onClick={e => {
            this.login()
          }}>登录</span>
          <Link to="/account/register">
            <span className="btn register_btn fz_26 f_lt" style={{width: '100%', marginTop: '.67rem', color: 'white'}}>注册</span>
          </Link> 
        </div>
        {this.state.warningDlgShow ? <WarningDlg text = {this.state.warningText} /> : null}
      </div>
    );
  }
}

export default Login;