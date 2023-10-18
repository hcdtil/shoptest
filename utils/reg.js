// 正则校验函数(基础柯里化)
function regTest(reg) {
  return (value) => {
    return reg.test(value)
  }
}

// 用户名的正则校验函数
let nameTest = regTest(/^[a-z0-9]\w{4,11}$/);
// 密码的正则校验函数
let pwdTest = regTest(/\w{6,12}/);
// 昵称正则校验函数
let nickTest = regTest(/^[\u4e00-\u9fa5]{2,5}$/);
// 年龄正则校验函数
let ageTest = regTest(/^[1-9]\d?\d?$/);
// 昵称正则校验函数
let genderTest = regTest(/^(男|女|保密)$/);
// 邮箱正则校验函数
let emialTest = regTest( /^[1-9a-zA-Z]\w{4,10}@(qq|163)\.com$/);

// 导出
export { nameTest, pwdTest, nickTest, ageTest, genderTest, emialTest }
