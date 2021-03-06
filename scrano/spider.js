const exceptions = require('./exception')
const {Request, } = require('./http/request')
const signal = require('./signal')


class Spider {
    constructor(options) {
        this.allowDomains = []
        this.startUrls = []
        this.crawler = options.crawler
        this.config = options.config
        this.validateAllowDomain = this.validateAllowDomain.bind(this)
        this.parse = this.parse.bind(this)
        this._initProcess_ = this._initProcess_.bind(this)
        this.closed = this.closed.bind(this)
        this.startRequests = this.startRequests.bind(this)
    }

    _initProcess_() {
        // 将allow_domain转化为RegExp对象
        for (const i in this.allowDomains) {
            this.allowDomains[i] = new RegExp(this.allowDomains[i])
        }
    }

    validateAllowDomain(url) {
        if (this.allowDomains.length === 0) {
            return true
        }
        for (const ad of this.allowDomains) {
            if (ad.test(url)) {
                return true
            }
        }
        return false
    }

    * startRequests() {
        if (this.startUrls.length < 1) {
            return []
        }
        for (const startUrl of this.startUrls) {
            if (this.allowDomains.length === 0 || this.validateAllowDomain(startUrl)) {
                yield new Request(startUrl, this.parse)
            }
        }
    }

    * parse(response) {
        throw new exceptions.NotImplementedError('parse is not implemented')
    }

    closed() {
        signal.emit(signal.SPIDER_CLOSED, this)
    }

    static fromCrawler (crawler) {
        const instance = new this({crawler, config: crawler.options, })
        instance._initProcess_()
        return instance
    }

    toString() {
        return `<Spider ${this.constructor.name}>`
    }
}

module.exports = {
    Spider,
}