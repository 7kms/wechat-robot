/**
 *   Wechaty - https://github.com/chatie/wechaty
 *
 *   @copyright 2016-2018 Huan LI <zixia@zixia.net>
 *
 *   Licensed under the Apache License, Version 2.0 (the "License");
 *   you may not use this file except in compliance with the License.
 *   You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   Unless required by applicable law or agreed to in writing, software
 *   distributed under the License is distributed on an "AS IS" BASIS,
 *   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *   See the License for the specific language governing permissions and
 *   limitations under the License.
 *
 */
const qrTerm = require('qrcode-terminal')
const { config, log, Wechaty, Friendship ,Message} = require('wechaty')
const {sleep} = require('../utils/index');
const Base = require('./base')
const {PHRASES, TIPS} = require('../data/message')
const RemoteService = require('../service/remote-service')


class Bot{
    constructor(){
        this.onFriendship = this.onFriendship.bind(this);
        this.onLogin = this.onLogin.bind(this);
        this.onMessage = this.onMessage.bind(this);
        this.init()
    }
    init(){
        this.bot = Wechaty.instance();
        // this.bot = new Wechaty({puppet});
    }
    start(){
        this.bot
       .on('friendship',this.onFriendship)
       .on('login',this.onLogin)
       .on('logout',this.onLogout)
       .on('error',this.onError)
       .on('message',  this.onMessage)
       .on('scan', this.onScan)
       .start()
    }
    contactSerialize(contact){
        const {payload} = contact;
        return {
            ...payload
        }
    }
    processTextMessage(){

    }
    async onMessage(msg){
        const filehelper = this.bot.Contact.load('filehelper')
        let sender   = msg.from()
        const receiver = msg.to()
        const text     = msg.text()
        const room     = msg.room()
        const type     = msg.type()
        console.log(text,type)
        if(!sender || !receiver){
            return false;
        }

        // 保证测试过程只有自己能使用
        // if(!sender.self()){
        //     return false;
        // }
        if(receiver.id == 'filehelper'){
            return false;
        }
        // 占时忽略房间消息

        if(!room){
            return false
        }
        // 测试房间, 为了视频
        let topic = await room.topic()
        if((topic != '为了视频') && (topic != 'yy-1001')){
            return false;
        }
        // sender = room
        // web微信, 只处理文字消息
        if(type !== Message.Type.Text){
            return false;
        }
        // 回复: 菜单
        if(text == PHRASES.menu){
            const text = TIPS.menu;
            // sender.say(text)
            await room.say(text)
            return false;
        }
        // 回复: 分类
        if(text == PHRASES.categoryList){
            const text = await RemoteService.getCategory()
            // sender.say(text)
            await room.say(text)
            return false;
        }
   
        // 回复: 试看
        if(text == PHRASES.try){
            const text = await RemoteService.getRandomVideo(this.contactSerialize(sender))
            // sender.say(text)
            room.say(text)
            return false;
        }
             /**
         *  categoryList: '分类',
            categoryNoPage: /^分类(\d+)$/,
            categoryPage: /^分类(\d+)页(\d+)$/,
            video: /视频(\d+)/
         */
        // 回复: 分类\d
        if(PHRASES.categoryNoPage.test(text)){
            let arr = PHRASES.categoryNoPage.exec(text);
            let category = arr[1];
            const res = await RemoteService.getVideoList(category)
            // sender.say(res)
            room.say(res)
            return false;
        }
        // 回复: 分类\d页\d
        if(PHRASES.categoryPage.test(text)){
            let arr = PHRASES.categoryPage.exec(text);
            let category = arr[1];
            let page = arr[2]
            const res = await RemoteService.getVideoList(category,page)
            // sender.say(res)
            room.say(res)
            return false;
        }

        // 回复: 视频\d
        if(PHRASES.video.test(text)){
            let arr = PHRASES.video.exec(text);
            let id = arr[1];
            const res = await RemoteService.getVideo(id,this.contactSerialize(sender))
            // sender.say(res)
            room.say(res)
            return false;
        }

        // 转账消息
        if(PHRASES.transfer.test(text)){
            console.log(text)
            console.log(sender.id)
            const res = await RemoteService.recharge(this.contactSerialize(sender))
            // sender.say(res)
            room.say(res)
            Base.report(`有转账消息: ${JSON.stringify(this.contactSerialize(sender))}`)
            return false;
        }
        // 红包消息
        if(PHRASES.redpacket.test(text)){
            sender.say(TIPS.thanks)
            return false;
        }
        if(sender.self()){
            return false;
        }
        if(room){
            room.say(TIPS.error);
        }else{
            sender.say(TIPS.error);
        }
        
        log.info('Bot', '(message) %s', msg)
        console.log(`receive message, sender: ${sender}`)
        console.log(`receive message, receiver: ${receiver}`)
        console.log(`receive message, text: ${text}`)
        console.log(`receive message, room: ${room ? room.topic(): room}`)
        console.log(`receive message, type: ${type}, ${Message.Type[type]}`)
        filehelper.say(`type:${type}; message:${text}\n room:${room ? room.topic() : null} ; sender:${sender.name()}; receiver:${receiver.name()}`)
    }
    async onFriendship(friendship){
        let logMsg
        const fileHelper = this.bot.Contact.load('filehelper');
        try {
          logMsg = 'received `friend` event from ' + friendship.contact().name() + '; hello-message: ' + friendship.hello();
          await fileHelper.say(logMsg)
          console.log(logMsg)
          switch (friendship.type()) {
            /**
             *
             * 1. New Friend Request
             *
             * when request is set, we can get verify message from `request.hello`,
             * and accept this request by `request.accept()`
             */
            case Friendship.Type.Receive:
                logMsg = 'accepted automatically'
                console.log('before accept')
                // await sleep(1000)
                await friendship.accept()
                // if want to send msg , you need to delay sometimes
                await sleep(1000)
                await friendship.contact().say(TIPS.menu)
                console.log('after accept')
              break;
            /**
             * 2. Friend Ship Confirmed
             */
            case Friendship.Type.Confirm:
              logMsg = 'friend ship confirmed with ' + friendship.contact().name()
              break;
          }
        } catch (e) {
          logMsg = e.message
        }
        console.log(logMsg)
        await fileHelper.say(logMsg)
    }
    onScan(qrcode, status){
        qrTerm.generate(qrcode,{small: true})
        console.log(`${qrcode}\n[${status}] Scan QR Code in above url to login: `)
        const qrcodeImageUrl = ['https://api.qrserver.com/v1/create-qr-code/?data=',encodeURIComponent(qrcode)].join('')
        console.log(status, qrcodeImageUrl)
    }
    async report(msg){
        let target_contact = await this.bot.Contact.find({name: 'float..'});
        if(target_contact){
            target_contact.say(msg)
        }
    }
    async onLogin(user){
        log.info('Bot', `${user.name()} logined`)
    }
    async onLogout(user){
        log.info('Bot', `${user.name()} logined`)
    }
    async onError(e){
        log.info('Bot', 'error: %s', e)
    }
}

module.exports = new Bot();
