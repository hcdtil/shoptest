// 导入axios isLogin
import { axios, isLogin } from '../utils/ajax.js';

// 获取元素
let off = document.querySelector('.off');
let on = document.querySelector('.on');
let wrapper = document.querySelector('.swiper-wrapper');

// 页面打开立即执行
; (async () => {
  // 调用isLogin判断用户是否已登录
  let { status, info } = await isLogin();
  console.log(info);
  if (status != 1) { // 未登录
    off.classList.add('active');
    on.classList.remove('active');
  } else {
    // 已登录
    off.classList.remove('active');
    on.classList.add('active');
    on.firstElementChild.innerHTML = info.username;
  }



  // 获取图片
  let { data } = await axios('/carousel/list', { params: { is_show: 1 } });
  console.log(data.list)
  if (data.list.length) {
    wrapper.innerHTML = data.list.reduce((prev, item) => {
      return prev + `
        <div class="swiper-slide"><img src=http://127.0.0.1:8888/${item.name}></div>
      `
    }, '')
    newSwiper();
  }
})()


// 给退出登录按钮,个人中心按钮绑定点击事件
on.addEventListener('click', async ({ target }) => {
  // 个人中心
  if (target.className == 'self') return location.href = './self.html';
  // 退出登录
  if (target.className == 'logout') {
    if (!confirm('你确定要注销登录吗?')) return;
    // 注销登录成功
    // 将本地的id和token移除
    localStorage.removeItem('token');
    localStorage.removeItem('uid');
    // 切换on,off元素
    off.classList.add('active');
    on.classList.remove('active');
  }
})



// 导入swiper
import Swiper from "../utils/swiper-bundle.esm.browser.min.js";
function newSwiper() {

  new Swiper('.swiper', {

    loop: true, // 循环模式选项
    // // 如果需要分页器
    // pagination: {
    //   el: '.swiper-pagination',
    //   clickable: true
    // },
    // 如果需要前进后退按钮
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // 自动轮播
    autoplay: {
      delay: 1500, // 轮播间隔时间        
      disableOnInteraction: false, // 用户操作swiper之后，是否禁止autoplay自动轮播
      pauseOnMouseEnter: true,
    }
  })

}