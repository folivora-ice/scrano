const path = require('path')
const extensions = require('./extensions')
const middlewares = require('./middlewares')

const SPIDER_MIDDLEWARES = [ 

]

const DOWNLOAD_MIDDLEWARES = [
    [ middlewares.ValidRequestMiddleware, 0, ],
    [ middlewares.DefaultRequestHeadersMiddleware, 1, ], 
]

const ITEM_PIPELINES = [

]

const EXTENSIONS = [
    [ extensions.logger, 'on', ],
]

// 开启日志文件
const LOG_TO_FILE = false

// 日志文件存放目录, 仅 LOG_TO_FILE = true 时有效
const LOG_DIR = path.resolve('./log')

// 是否允许301或者302重定向，默认开启
const REDIRECT_ENABLED = true

// 重定向最大深度, 仅在 REDIRECT_ENABLED = true 时有效, 默认3
const MAX_REDIRECT_DEEPTH = 3

// 超时时间(秒)
const REQUEST_TIMEOUT = 120

// 最大重试次数
const MAX_RETRY = 3

// 最大同时请求数
const CONCURRENT_REQUESTS = 32

// 启用自动限速给能
const AUTOTHROTTLE_ENABLED = true
// 限速最大延迟, 单位秒
const AUTOTHROTTLE_MAX_DELAY = 60



// 默认请求头
const DEFAULT_REQUEST_HEADER = {
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
    'Accept-Language': 'zh-CN,zh;q=0.9,zh-HK;q=0.8',
    'Cache-Control': 'no-cache',
    "Accept-Encoding":"gzip, deflate",
    "Connection":"keep-alive",
    "Content-Type":"application/x-www-form-urlencoded; charset=UTF-8",
    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/53.0.2763.0 Safari/537.36",
}

// 请求失败的最大重试次数
const RETRY_TIMES = 3

const config = {
    SPIDER_MIDDLEWARES,
    DOWNLOAD_MIDDLEWARES,
    ITEM_PIPELINES,
    LOG_TO_FILE,
    LOG_DIR,
    REDIRECT_ENABLED,
    MAX_REDIRECT_DEEPTH,
    AUTOTHROTTLE_ENABLED,
    AUTOTHROTTLE_MAX_DELAY,
    CONCURRENT_REQUESTS,
    DEFAULT_REQUEST_HEADER,
    RETRY_TIMES,
    EXTENSIONS,
    REQUEST_TIMEOUT,
    MAX_RETRY,
}

const loadConfig = function(options) {
    for (const key in config) {
        if ([ 'SPIDER_MIDDLEWARES', 'DOWNLOAD_MIDDLEWARES', 'ITEM_PIPELINES', ].includes(key)) {
            const cache = [ ...config[key], ...(options[key] ? options[key] : []), ].filter((x) => {
                return x[1] !== 'off'
            })
            cache.sort((x, y) => {
                return parseInt(x[1]) > parseInt(y[1])
            })
            config[key] = cache.map((x) => x[0])
        } else if (Array.isArray(config[key])) {
            config[key] = [ ...config[key], ...(options[key] ? options[key] : []), ]
        } else if (config[key] instanceof Object) {
            config[key] = Object.assign({}, config[key], options[key])
        } else {
            config[key] = options[key] || config[key]
        }
    }
    for (const key in options) {
        if (!config[key]) {
            config[key] = options[key]
        }
    }
    return config 
}

module.exports = {
    loadConfig,
}