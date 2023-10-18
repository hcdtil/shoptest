// 导入axios,isLogin
import { axios, isLogin } from '../utils/ajax.js'
// 导入正则函数
import { pwdTest } from "../utils/reg.js";

// 1. 获取元素
let errBox = document.querySelector('.error');
let oldInp = document.querySelector('.oldpassword');
let newInp = document.querySelector('.newpassword');
let rnewInp = document.querySelector('.rnewpassword');
let form = document.querySelector('form');

; (async () => {
  // 调用isLogin判断用户是否已登录
  let { status, info, token } = await isLogin();
  // console.log(info);
  // 未登录   
  if (status != 1) return location.href = './login.html';
  // 绑定事件
  form.addEventListener('submit', async e => {
    e.preventDefault();
    // 请求携带数据组装
    let data = {
      id: info.id,
      oldpwd: oldInp.value,
      newpwd: newInp.value,
      rnewpwd: rnewInp.value
    }
    console.log(data);
    // 不为空校验
    for (const key in data) if (!data[key]) return alert('请完整填写表单');
    // 两次密码一致校验
    if (data.newpwd != data.rnewpwd) return alert('两次新密码不一致');
    // 新密码不能和原密码一致
    if (data.oldpwd === data.newpwd) return alert('新密码不能和原密码一致');

    // 正则校验
    if (!pwdTest(data.oldpwd)) return alert('原密码格式错误');
    if (!pwdTest(data.newpwd)) return alert('新密码格式错误');

    // 请求接口修改密码
    let { data: { code } } = await axios({ url: '/user/rpwd', method: 'post', data, headers: { authorization: token } })

    // 修改密码失败
    if (code != 1) return errBox.classList.add('active');
    // 修改密码成功
    errBox.classList.remove('active');
    alert('修改密码成功,跳转登录页面');
    // 移除本地的uid和token
    localStorage.removeItem('uid');
    localStorage.removeItem('token');
    // 跳转
    location.href = './login.html';
  })
})()

