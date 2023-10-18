import { axios, isLogin } from "../utils/ajax.js";
// 获取分类元素
let cateBox = document.querySelector('.category');
// 页面中的分类渲染
renderCate();
async function renderCate() {
  // ajax请求获取分类列表,请求地址/goods/category
  let {data:{cates}} = await axios({ url: '/goods/cates' });
  // 遍历渲染
  cateBox.innerHTML = cates.reduceRight((prev, item) => prev + `<li>${item}</li>`, '<li class="active">全部</li>');
}
/*
  搜索筛选数据分页渲染
    - 需要渲染分页数据及分页器元素
    - 分页渲染数据请求接口
      + /goods/list     
    - 什么时候需要渲染?
      + 页面打开需要渲染,(分类,筛选,折扣,排序,搜索),分页按钮点击 都需要重新渲染分页数据
      + 需要多次渲染--->需要多次请求/goods/list  接口 
        - 我们可以组装一个请求携带参数的对象data
          + 每次操作(分类,筛选,折扣,排序,搜索切换),切换分页等,都修改data对象
            - 然后使用data对象数据请求接口
      + 需要多次渲染,那就封装一个渲染函数
        - 渲染函数内实现, 请求接口获取数据
          + 渲染分页数据,渲染分页器元素
*/
// 准备请求 /goods/list  接口 携带数据对象默认值
let datal = {
  current: 1,//当前页
  pagesize: 12,// 一页多少条数据显示
  search: '',// 模糊搜索关键字
  filter: '',  //hot,sale,''  空字符串表示全部 (热销/折扣)筛选
  saleType: 10, // 折扣类型 5~10
  sortType: 'id', // id || sale || price排序类型
  sortMethod: 'ASC', // ASC 正序, DESC 倒序
  category: '',//分类  空字符串表示全部
}

// 获取元素
// 分页数据渲染容器
let listBox = document.querySelector('.list');
// 分页器元素
let padinationBox = document.querySelector('.pagination');
let firstBtn = document.querySelector('.first');
let prevBtn = document.querySelector('.prev');
let nextBtn = document.querySelector('.next');
let lastBtn = document.querySelector('.last');
let totalBox = document.querySelector('.total');
let currInp = document.querySelector('.jump');
let pagesizeSle = document.querySelector('.pagesize');

// 分类,筛选,折扣,排序,搜索 元素
let filterBox = document.querySelector('.filterBox') // 筛选-->热销/折扣
let saleBox = document.querySelector('.saleBox') // 折扣
let sortBox = document.querySelector('.sortBox') // 排序
let search = document.querySelector('.search') // 搜索

let totalPage; // 总页数

// 渲染函数
render();
async function render() {
  // 请求接口获取分页数据====>结构
  let {data:{list,totalPage:total}} = await axios({ url: '/goods/list', params:datal });
  totalPage = total;

  // 遍历list渲染 分页内容
  listBox.innerHTML = list.reduce((prev, item) => {
    return prev + `
    <!-- 将商品id存储在li元素属性中为了后续方便获取商品  -->
    <li data-id="${item._id}">
      <div class="show">
        <img src="${item.img_big_logo}">
        <!-- 判断is_hot,is_sale是否显示热销,折扣span元素-->
        ${item.is_hot ? '<span class="hot">热销</span>' : ''}
        ${item.is_sale ? '<span>折扣</span>' : ''}
      </div>
      <div class="info">
        <p class="title">${item.title}</p>
        <p class="price">
          <span class="curr">¥ ${item.current_price}</span>
          <span class="old">¥ ${item.price}</span>
        </p>
        <button data-id="${item._id}">加入购物车</button>
      </div>
    </li>
    `
  }, '');
  // 判断获取的分页数据为空的情况
  !list.length && (listBox.innerHTML = `<img src="../img/no.png" alt="">`)

  // 渲染分页器
  // 更具当前页 判断是否禁用上一页,首页/ 下一页尾页
  firstBtn.className = datal.current === 1 ? 'first disable' : 'first';
  prevBtn.className = datal.current === 1 ? 'prev disable' : 'prev';
  nextBtn.className = datal.current === total ? 'next disable' : 'next';
  lastBtn.className = datal.current === total? 'last disable' : 'last';
  // 渲染页码
  totalBox.innerHTML = `${datal.current} / ${total}`;
  currInp.value = datal.current;
}


// 事件绑定函数
bindEvent();
function bindEvent() {
  // 分页器的点击事件-->事件委托
  padinationBox.addEventListener('click', ({ target }) => {
    if (target.className == 'first') { // 点击首页
      if (datal.current === 1) return;
      // 修改datal的current数据
      datal.current = 1;
      // 重新渲染分页数据
      render();
    }
    if (target.className == 'prev') { // 点击上一页
      if (datal.current === 1) return;
      // 修改datal的current数据
      datal.current--;
      // 重新渲染分页数据
      render();
    }
    if (target.className == 'next') { // 点击下一页
      if (datal.current === totalPage) return;
      // 修改datal的current数据
      datal.current++;
      // 重新渲染分页数据
      render();
    }
    if (target.className == 'last') { // 点击末页
      if (datal.current === totalPage) return;

      // 修改datal的current数据
      datal.current = totalPage;
      // 重新渲染分页数据
      render();
    }
    if (target.className == 'go') { // 点击跳转
      // 获取输入的页码
      let n = currInp.value - 0;
      // 如果输入的页码有问题则 改为原页码数
      if (!n || n <= 0 || n > totalPage) return currInp.value = datal.current;
      // 修改datal的current数据
      datal.current = n;
      // 重新渲染分页数据
      render();
    }
  })
  // 每页条数切换
  pagesizeSle.addEventListener('change', function () {
    datal.pagesize = this.value;
    datal.current = 1;
    render();
  })


  // 分类,筛选,折扣,排序,搜索 切换事件--->事件委托
  // 分类切换事件
  cateBox.addEventListener('click', ({ target }) => {
    if (target.nodeName === 'LI') { // 点击的是具体的分类
      // 排他法 切换高亮元素
      ;[...cateBox.children].forEach(ele => ele.classList.remove('active'));
      target.classList.add('active');
      // 修改data---->修改请求携带的数据
      datal.category = target.innerHTML == '全部' ? '' : target.innerHTML;
      // 重新渲染
      render();
    }
  })

  // 筛选(热销折扣)切换事件
  filterBox.addEventListener('click', ({ target }) => {
    if (target.nodeName === 'LI') { // 点击的是具体的热销/折扣/ 全部
      // 排他法 切换高亮元素
      ;[...filterBox.children].forEach(ele => ele.classList.remove('active'));
      target.classList.add('active');
      // 修改data---->修改请求携带的数据
      datal.filter = target.dataset.type;
      // 重新渲染
      render();
    }
  })

  // 折扣切换事件
  saleBox.addEventListener('click', ({ target }) => {
    if (target.nodeName === 'LI') { // 点击的是具体的折扣
      // 排他法 切换高亮元素
      ;[...saleBox.children].forEach(ele => ele.classList.remove('active'));
      target.classList.add('active');
      // 修改data---->修改请求携带的数据
      datal.saleType = target.dataset.type;
      // 重新渲染
      render();
    }
  })

  // 排序切换事件
  sortBox.addEventListener('click', ({ target }) => {
    if (target.nodeName === 'LI') { // 点击的是具体的排序
      // 排他法 切换高亮元素
      ;[...sortBox.children].forEach(ele => ele.classList.remove('active'));
      target.classList.add('active');
      // 修改data---->修改请求携带的数据
      datal.sortType = target.dataset.type;
      datal.sortMethod = target.dataset.method;
      // 重新渲染
      render();
    }
  })

  // 搜索=====>闭包,防抖函数
  search.addEventListener('input', (function (timerId) {
    return function () {
      clearInterval(timerId);
      timerId = setTimeout(() => {
        datal.search = this.value;
        console.log(data.search)
        render();
      }, 500);
    }
  })())


}

// 商品的点击事件
goodsEvent();
function goodsEvent() {
  listBox.addEventListener('click', async ({ target }) => {
    if (target.nodeName === 'BUTTON') { // 点击加入购物车
      // 判断是否已登录
      let { status, info, token } = await isLogin();
      if (status != 1) {

        alert('请先登录');
        location.href = './login.html'
        return 
      }
      // 请求加入购物车接口  地址: /cart/add  方式: post  参数: id(用户id),goodsId(商品id),请求头带token
      let goodsId = target.dataset.id;
      let res = await axios({ url: '/cart/add', method: 'post', data: { uid: info.id, gid: goodsId }, headers: { authorization: token } })

      if (res.code != 1) return alert('加入购物车失败,请重试');
      alert(res.message); // 加入购物车成功
    }
    // 点击跳转详情页
    if (target.nodeName === 'LI') {

      // 在详情页中需要获取商品详情---需要通过商品id 请求接口获取
      // 可以在此处获取到商品id并存储在本地  sessionStorage
      // console.log( target )
      sessionStorage.setItem('id', target.dataset.id);

      // 跳转详情页
      location.href = './detail.html';
    }
  })



}
