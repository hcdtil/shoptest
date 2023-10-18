// 导入ajax
import { axios } from '../utils/ajax.js'
// 导入正则函数
import { nameTest, pwdTest, emialTest } from "../utils/reg.js";

// 1. 获取元素
let errBox = document.querySelector('.error');
let nameInp = document.querySelector('.username');
let pwdInp = document.querySelector('.password');
let rpwdInp = document.querySelector('.rpassword');
let emailInp = document.querySelector('.email');
let form = document.querySelector('form');

// 2. 绑定表单提交事件
form.addEventListener('submit', async e => {
  e.preventDefault(); // 阻止默认提交
  // 3.0 获取用户输入的用户名,密码,确认密码,昵称
  let username = nameInp.value;
  let password = pwdInp.value;
  let rpassword = rpwdInp.value;
  let email = emailInp.value;
  // 3.1 不为空校验
  if (!username || !password || !rpassword || !email) return alert('请完整填写表单');
  // 3.2 正则校验
  if (!nameTest(username)) return alert('用户名格式错误');
  if (!pwdTest(password)) return alert('密码格式错误');
  if (!emialTest(email)) return alert('邮箱格式错误');
  // 3.3 两次密码一致性校验
  if (password != rpassword) return alert('两次密码不一致');
  // 4. 发送请求
  // 注意: 请求地址: /users/register 请求方式:post
  //    请求携带参数: username,password,rpassword,nickname
  // 解构接受的响应数据  
  let { data: { code } } = await axios({ url: '/user/register', method: 'post', data: { username, pwd: password, rpwd: rpassword, email } })
  
  console.log(code);
  if (code != 1) return errBox.classList.add('active'); // 注册失败

  // 注册成功
  errBox.classList.remove('active');
  alert('注册成功,请进入邮箱激活账号');
})


