/* 
  1. 校验是否已登录
  2. 用户信息回显
  3. 绑定提交事件
    - 请求修改用户信息接口
*/
// 导入axios isLogin
import { axios, isLogin } from '../utils/ajax.js';
import { ageTest, genderTest } from "../utils/reg.js";


// 获取元素
let nameInp = document.querySelector('.username');
let ageInp = document.querySelector('.age');
let genderSel = document.querySelector('.gender');
let avatorInp = document.querySelector('#tx');
let imgEle = document.querySelector('img');
let form = document.querySelector('form');

; (async () => {
  // 调用isLogin判断用户是否已登录
  let { status, info, token } = await isLogin();
  // 未登录   
  if (status != 1) return location.href = './login.html';
  // 已登录--->回显数据
  nameInp.value = info.username;
  ageInp.value = info.age;
  genderSel.value = info.gender;
  imgEle.src = `http://10.36.104.197:8888/${info.avator}`;


  // 绑定提交事件
  form.addEventListener('submit', async e => {
    e.preventDefault(); // 阻止默认提交
    // 因为有文件上传使用---->FormData提交
    let fd = new FormData(form);
    if (!fd.get('avator').type.startsWith('image')) return alert('请选择图片');
    if (fd.get('age') && !ageTest(fd.get('age'))) return alert('年龄格式错误');
    if (fd.get('gender') && !genderTest(fd.get('gender'))) return alert('性别格式错误');

    fd.set('id', info.id);
    // 请求修改接口
    let { data: { code } } = await axios({ url: '/user/rinfo', method: 'post', data: fd, headers: { authorization: token } })
    if (code != 1) return alert('修改失败,请重试');
    alert('修改成功!');
    // location.reload();
  })


  // 图片预览
  avatorInp.onchange = function () {
    let file = this.files[0]
    // console.log(file)
    if (!file?.type.startsWith('image')) return alert('请选择图片');
    let fr = new FileReader();
    // console.log(fr)
    fr.readAsDataURL(file);
    fr.onloadend = () => {
      imgEle.src = fr.result;
    }
  }
})()
