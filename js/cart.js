// 导入ajax,isLogin
import { ajax, isLogin } from '../utils/ajax.js'
let off = document.querySelector('.off');
let on = document.querySelector('.on');
// 购物车代码
render();
async function render() {
  // 调用isLogin判断用户是否已登录
  let { status, info, token } = await isLogin();
  // 未登录   
  if (status != 1) return location.href = './login.html';
  // 请求购物车数据--->请求接口 地址: /cart/list 方式 get 参数 id 请求头token
  let { code, cart } = await ajax({ url: '/cart/list', data: { id: info.id }, headers: { authorization: token } })
  if (code != 1) return location.href = './login.html';
  if (!cart.length) {
    on.classList.remove('active');
    off.classList.add('active');
    return;
  }

  // 定义变量
  let selectNum = 0;// 选中数量
  let selectBuys = 0;// 选中的购买数量
  let selectPrices = 0;// 选中总价格
  // 统计数量及价格
  cart.forEach(v => {
    if (!v.is_select) return;
    selectNum++;
    selectBuys += v.cart_number;
    selectPrices += v.cart_number * v.current_price;
  })
  // 拼接渲染列表
  let str = `
    <div class="top">
      <input class="selectAll" ${selectNum == cart.length && cart.length ? 'checked' : ''} type="checkbox"> 全选
    </div>
    <ul class="center">
  `
  // 循环拼接 li
  str += cart.reduce((prev, item) => {
    return prev + `
      <li>
        <div class="select">
          <input data-id="${item.goods_id}" ${item.is_select ? 'checked' : ''} class="selectItem" type="checkbox">
        </div>
        <div class="show">
          <img src="${item.img_small_logo}">
        </div>
        <div class="title">
          ${item.title}  
        </div>
        <div class="price">
          ￥ ${item.current_price}  
        </div>
        <div class="number">
          <button data-id="${item.goods_id}" data-buys="${item.cart_number}" class="sub">-</button>
          <input type="text" value="${item.cart_number}">
          <button data-socket="${item.goods_number}" data-id="${item.goods_id}" data-buys="${item.cart_number}" class="add">+</button>
        </div>
        <div class="subPrice">
          ￥ ${(item.current_price * item.cart_number).toFixed(2)}
        </div>
        <div class="destory">
          <button data-id="${item.goods_id}" class="del">删除</button>
        </div>
      </li>    
    `
  }, '')

  str += `
    </ul>
    <div class="bottom">
      <p class="totalNum">总共购买了 ${selectBuys} 件商品</p>
      <div class="btns">
        <button class="clear">清空购物车</button>
        <button class="delAll"  ${selectNum ? '' : 'disabled'}>删除所有已选中</button>
        <button class="pay" ${selectNum ? '' : 'disabled'}>去支付</button>
      </div>
      <p class="totalNum">总价: ￥ ${selectPrices.toFixed(2)} </p>
    </div>
  `
  // 渲染str
  on.innerHTML = str;
  // 渲染完毕
  bindEvent(info.id, token);
}

// 点击事件
function bindEvent(id, token) {
  // 事件委托
  on.onclick = async ({ target }) => {
    if (target.className == 'selectAll') { // 点击全选
      let type = target.checked ? 1 : 0; // 获取选中状态
      let { code } = await ajax({ url: '/cart/select/all', method: 'post', data: { id, type }, headers: { authorization: token } })
      if (code != 1) return alert('修改失败,请重试');
      // 重新渲染
      render();
    }
    if (target.className == 'selectItem') { // 点击单个选中      
      let goodsId = target.dataset.id;
      let { code } = await ajax({ url: '/cart/select', method: 'post', data: { id, goodsId }, headers: { authorization: token } })
      if (code != 1) return alert('修改失败,请重试');
      // 重新渲染
      render();
    }
    if (target.className == 'sub') { // 点击减按钮
      let goodsId = target.dataset.id;
      let number = target.dataset.buys - 0;
      console.log(number)
      if (number <= 1) return alert('最小购买数为1');
      number--;
      let { code } = await ajax({ url: '/cart/number', method: 'post', data: { id, goodsId, number }, headers: { authorization: token } })
      if (code != 1) return alert('修改失败,请重试');
      // 重新渲染
      render();
    }
    if (target.className == 'add') { // 点击加按钮
      let goodsId = target.dataset.id;
      let number = target.dataset.buys - 0;
      let socket = target.dataset.socket - 0;
      if (number >= socket) return alert('库存不足,请等待商家补货!');
      number++;
      let { code } = await ajax({ url: '/cart/number', method: 'post', data: { id, goodsId, number }, headers: { authorization: token } })
      if (code != 1) return alert('修改失败,请重试');
      // 重新渲染
      render();
    }

    if (target.className == 'del') { // 点击单个删除按钮
      if(!confirm('不考虑考虑?')) return;
      let goodsId = target.dataset.id;      
      let { code } = await ajax({ url: '/cart/remove', method: 'get', data: { id, goodsId }, headers: { authorization: token } })
      if (code != 1) return alert('删除失败,请重试');
      // 重新渲染
      render();
    }
    if (target.className == 'delAll') { // 点击删除所有已选中按钮
      if(!confirm('不考虑考虑?')) return;           
      let { code } = await ajax({ url: '/cart/remove/select', method: 'get', data: { id }, headers: { authorization: token } })
      if (code != 1) return alert('删除失败,请重试');
      // 重新渲染
      render();
    }
    if (target.className == 'clear') { // 点击删除清空按钮
      if(!confirm('不考虑考虑?')) return;           
      let { code } = await ajax({ url: '/cart/clear', method: 'get', data: { id }, headers: { authorization: token } })
      if (code != 1) return alert('删除失败,请重试');
      // 重新渲染
      render();
    }

    if (target.className == 'pay') { // 点击支付      
      let { code,message } = await ajax({ url: '/cart/pay', method: 'post', data: { id }, headers: { authorization: token } })
      if (code != 1) return alert('支付失败,请重试');
      // 重新渲染
      alert(message)
    }
  }
}
