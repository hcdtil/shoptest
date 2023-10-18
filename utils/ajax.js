// // 使用闭包函数将传入的基准地址缓存
// function getAjax(baseUrl) {

//   return function (options = {}) {
//     // 1. 校验传递的参数格式及类型
//     // 1.0 校验url
//     if (!options.url) throw new Error('ajax请求地址必须传递');
//     // 1.0 url类型
//     if (typeof options.url != 'string') throw new Error('ajax请求地址必须是字符串类型');
//     // 1.1 校验get参数---->可以不传递,传递了只能是get或post
//     if (options.method && !/^(get|post)$/i.test(options.method)) throw new Error('ajax请求方式暂时只支持get/post');
//     // 1.2 校验async参数---->可以不传递,传递了只能布尔值
//     if ('async' in options && typeof (options.async) != 'boolean') throw new Error('ajax请求async只能是true或false');
//     // 1.3 校验data参数---->可以不传递,传递了只能是对象
//     if (options.data && Object.prototype.toString.call(options.data) != '[object Object]') throw new Error('ajax请求方式携带数据只支持对象');
//     // 1.4 校验dataType参数---->可以不传递,传递了只能是json/string
//     if (options.dataType && !/^(json|string)$/i.test(options.dataType)) throw new Error('ajax请求dataType暂时只支持json/string');
//     // 1.5 校验headers参数---->可以不传递,传递了只能是对象
//     if (options.headers && Object.prototype.toString.call(options.headers) != '[object Object]') throw new Error('ajax请求headers只支持对象');
//     // 1.6 校验cb参数---->可以不传递,传递了只能是函数
//     // if (options.cb && Object.prototype.toString.call(options.cb) != '[object Function]') throw new Error('ajax请求cb只支持函数');
//     // 2. 设置请求的参数默认值
//     let info = {
//       url: baseUrl + options.url,
//       method: options.method ? options.method : 'get',
//       async: options.async ?? true,
//       data: options.data ?? {},
//       dataType: options.dataType ?? 'json',
//       headers: options.headers ? { 'content-type': 'application/x-www-form-urlencoded', ...options.headers } : { 'content-type': 'application/x-www-form-urlencoded' },
//       cb: options.cb ?? function () { }
//     }
//     // 3. 请求携带的参数格式化
//     // 将接受的请求携带的数据对象转接查询字符串
//     let qs = '';
//     for (const key in info.data) {
//       qs += `${key}=${info.data[key]}&`
//     }
//     qs = qs.slice(0, -1);
//     // 4. 发送请求
//     // 4.1 设置请求地址
//     if (/get/i.test(info.method) && qs) info.url += `?${qs}`;

//     // 返回一个promsie对象并 发起ajax请求,当获取到响应后改变 promsie状态为成功
//     return new Promise(resolve => {
//       // 创建ajax对象
//       let xhr = new XMLHttpRequest()
//       // 配置请求信息  
//       xhr.open(info.method, info.url, info.async);
//       // 设置请求头---->遍历info.headers循环设置
//       for (const key in info.headers) xhr.setRequestHeader(key, info.headers[key]);
//       // 接受响应数据
//       xhr.onload = () => {
//         let response; // 响应数据
//         try {
//           // 判断是否需要json转换
//           if (info.dataType == 'json') {
//             response = JSON.parse(xhr.responseText);
//           } else {
//             response = xhr.responseText;
//           }
//         } catch (error) {
//           response = xhr.responseText;
//         }
//         // 获取到响应数据后改变promise对象状态为成功,并将响应数据作为状态值
//         resolve(response); // 
//       }
//       // 发送请求
//       /post/i.test(info.method) ? xhr.send(qs) : xhr.send();
//     })
//   }
// }

// // 返回一个ajax请求函数,缓存到了基准地址
// let ajax = getAjax('http://localhost:8888');

import axios from "./axios.js";

// 设置axios的基准地址
axios.defaults.baseURL = 'http://127.0.0.1:8888';


// 请求拦截,响应拦截




// 封装一个判断用户是否已登录函数
// 返回值:  成功的promsie对象
//    -- 状态值  {status:0/1,message:'未登录/已登录',info:'用户信息,登录过才可获取到'}
async function isLogin() {
  // 获取本地存储的token和id
  let token = localStorage.getItem('token');
  let id = localStorage.getItem('uid');
  if (!token || !id) return { status: 0, message: '未登录' };
  // 根据获取的token和id 请求/users/info接口
  // 请求方式: get 携带数据: id,请求头: token
  let { data: { code, info } } = await axios({ url: '/user/info', params: { id }, headers: { authorization: token } });
  // 校验是否登录
  if (code != 1) return { status: 0, message: '未登录' };
  // 已登录
  return { status: 1, message: '已登录', info, token }
}



export { axios, isLogin };