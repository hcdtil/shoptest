import { ajax, isLogin } from "../utils/ajax.js";

// 获取本地的商品id
let id = sessionStorage.getItem('id');
if (!id) {
  // 回到列表页
  location.href = './list.html';
  throw new Error('非法访问');
}

// 获取渲染容器元素
let contentBox = document.querySelector('.content');
// 获取商品详细描述容器元素
let descBox = document.querySelector('.desc');

// 渲染函数
render();
async function render() {
  // 发起请求 获取商品详细信息  地址: /goods/item 方式: get  参数: id(商品id)
  let { code, info } = await ajax({ url: '/goods/item', data: { id } });
  if (code != 1) {
    location.href = './list.html';
    throw new Error('获取商品详情失败');
  }
  // console.log(info);
  // 渲染商品信息
  contentBox.innerHTML = `
    <div class="left box">
      <div class="middleBox">
        <img src="${info.img_big_logo}" class="middleimg">
        <div class="shadeBox"></div>
      </div>
      <div class="bigBox">
        <img src="${info.img_big_logo}" class="bigimg">
      </div>
    </div>
    <div class="right">
      <p class="title">${info.title}</p>
      <p class="price">¥ ${info.current_price}</p>
      <button>加入购物车</button>
    </div>  
  `;
  // 渲染商品详细描述(是一个html格式的字符串)
  descBox.innerHTML = info.goods_introduce;

  // 渲染完毕后启动放大镜
  enlarge();

  // 渲染完毕 加入购物车点击事件
  addCart();

}

// 放大镜
function enlarge() {
  // 获取元素
  let middleBox = contentBox.querySelector('.middleBox'); // 中盒子
  let shadeBox = contentBox.querySelector('.shadeBox'); // 遮罩层
  let bigBox = contentBox.querySelector('.bigBox'); // 大图盒子
  let bigImg = contentBox.querySelector('.bigBox>img'); // 大图元素

  // 给中图盒子绑定鼠标移入移出事件
  middleBox.onmouseover = () => {
    shadeBox.classList.add('active');
    bigBox.classList.add('active');
  }
  middleBox.onmouseout = () => {
    shadeBox.classList.remove('active');
    bigBox.classList.remove('active');
  }
  // 鼠标移动事件
  middleBox.onmousemove = ({ offsetX, offsetY }) => {
    // 获取尺寸
    let middleBoxWidth = middleBox.clientWidth;
    let middleBoxHeight = middleBox.clientHeight;
    let shadeBoxWidth = shadeBox.clientWidth;
    let shadeBoxHeight = shadeBox.clientHeight;
    let bigImgWidth = bigImg.clientWidth;
    let bigImgHeight = bigImg.clientHeight;

    // 遮罩层最大偏移量
    let maxLeft = middleBoxWidth - shadeBoxWidth;
    let maxTop = middleBoxHeight - shadeBoxHeight;
    // console.log( offsetX,offsetY )     
    // 计算遮罩层跟随移动的偏移量
    let left = offsetX - shadeBoxWidth / 2;
    let top = offsetY - shadeBoxHeight / 2;
    if (left <= 0) left = 0;
    if (top <= 0) top = 0;
    if (left >= maxLeft) left = maxLeft;
    if (top >= maxTop) top = maxTop;

    // 设置偏移量
    shadeBox.style.left = left + 'px';
    shadeBox.style.top = top + 'px';


    // 大图跟随移动--->根据比例计算大图偏移量
    let bigImgLeft = (left / middleBoxWidth) * bigImgWidth;
    let bigImgTop = (top / middleBoxHeight) * bigImgHeight;

    bigImg.style.left = -bigImgLeft + 'px';
    bigImg.style.top = -bigImgTop + 'px';

  }

}

function addCart() {
  contentBox.querySelector('button').onclick = async () => {
    // 判断是否已登录
    let { status, info, token } = await isLogin();
    if (status != 1) {

      alert('请先登录');
      location.href = './login.html'
      return
    }
    // 请求加入购物车接口  地址: /cart/add  方式: post  参数: id(用户id),goodsId(商品id),请求头带token    
    let res = await ajax({ url: '/cart/add', method: 'post', data: { id: info.id, goodsId: id }, headers: { authorization: token } })

    if (res.code != 1) return alert('加入购物车失败,请重试');
    alert(res.message); // 加入购物车成功
  }
}