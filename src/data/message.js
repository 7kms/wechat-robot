
const cautions = '\n\n温馨提示: 每天可免费试看3部视频(随机). \n转账1元可以观看3部指定视频.\n累计消费100元可进入主播微信群,享受vip服务 '
exports.PHRASES = {
    transfer: /\[收到一条微信转账消息，请在手机上查看\]/,
    redpacket: /Red packet received. View on phone./,
    try: '试看',
    menu: '菜单',
    categoryList: '分类',
    categoryNoPage: /^分类(\d+)$/,
    categoryPage: /^分类(\d+)页(\d+)$/,
    video: /^视频(\d+)$/
}

exports.TIPS = {
    menu: [
        '回复"菜单"=>查看操作说明',
        '回复"试看"=>随机试看一部视频',
        '回复"分类"=>查看所有分类',
        // '回复"分类m",m为数字=>如(分类1,分类2)查看视频列表',
        // '回复"分类m页n",mn为数字=>如(分类1页1,分类2页5)查看对应页码上面的视频',
        // '回复"视频id",id为数字=>如(视频10011)查看想要的视频',
        cautions
    ].join('\n'),
    thanks: '谢谢打赏, 如需视频观看请直接转账哦!',
    hello: 'hello, custom hello message',
    wait: '系统正在处理, 请稍等...',
    tips: '\n\n所有视频都需要用微信以外的浏览器(手机百度,safari,小米浏览器等)打开! 视频服务器在美国, 如加载缓慢,请耐心等待或从新打开! \n视频地址会不定期变动, 如想永久保存, 请及时下载!',
    error: '输入错误, 请回复"菜单"查看操作说明',
    no_balance: `余额不足,如需继续观看,请转账1元${cautions}`
}

