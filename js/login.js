// 导入ajax
import { axios } from '../utils/ajax.js'
// 导入正则函数
import { nameTest, pwdTest } from "../utils/reg.js";


// 1. 获取元素
let errBox = document.querySelector('.error');
let nameInp = document.querySelector('.username');
let pwdInp = document.querySelector('.password');
let form = document.querySelector('form');

// 2. 绑定表单提交事件
form.addEventListener('submit', async e => {
  e.preventDefault(); // 阻止默认提交
  // 3.0 获取用户输入的用户名,密码,确认密码,昵称
  let name = nameInp.value;
  let pwd = pwdInp.value;
  // 3.1 不为空校验
  if (!name || !pwd) return alert('请完整填写表单');
  // 3.2 正则校验
  if (!nameTest(name)) return alert('用户名格式错误');
  if (!pwdTest(pwd)) return alert('密码格式错误');
  // 4. 发送请求
  // 注意: 请求地址: /users/login 请求方式:post
  //    请求携带参数: username,password
  let { data: { code, token, info } } = await axios({ url: '/user/login', method: 'post', data: { name, pwd } })
  
  if (code != 1) return errBox.classList.add('active'); // 登录失败
  
  // 登录成功
  // 将用户id和token存储在浏览器本地
  localStorage.setItem('token', token);
  localStorage.setItem('uid', info.id);
  location.href = './index.html';
})
