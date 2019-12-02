import axios from 'axios'
const isOnlineEnv = location.host.indexOf('ceshi-') < 0 && location.host.indexOf('localhost') < 0;
const isProtocol = /http:/.test(window['location'].protocol);
const isLocal = /localhost/.test(window['location'].href) || isProtocol;
const BASE = isOnlineEnv ? '//courseware.haibian.com' : isLocal ? '//ceshi.courseware.haibian.com' : '//ceshi_courseware.haibian.com';

// 创建 axios 实例
let service = axios.create({
    // headers: {'Content-Type': 'application/json'},
    // 区分线上环境与测试环境下的 http 与 https
    baseURL: BASE,
    withCredentials: true,
    timeout: 60000
})

// 设置 post、put 默认 Content-Type
service.defaults.headers.post['Content-Type'] = 'application/json'
service.defaults.headers.put['Content-Type'] = 'application/json'

// 添加请求拦截器
service.interceptors.request.use()

// 添加响应拦截器
service.interceptors.response.use()

// 暴露一个 install 用于 vue.use()
const install = function (Vue) {
    if (install.installed) return

    install.installed = true
    Reflect.set(Vue.prototype, '$http', service)
}

export default {
    install
}
