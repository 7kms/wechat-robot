const {$get,$post} = require('../utils/api')
const {TIPS} = require('../data/message')
class Remote {
    constructor(){
        this.userSelf = null;
        this.category = null;
    }
    init(userSelf){
        this.userSelf = userSelf;
    }
    async getCategory(){
        if(!this.category){
            let list = await $get('/category');
            let str = '';
            list.forEach(item=>{
                str += `回复"分类${item.id}"查看=>${item.name}\n`
            })
            str += `\n`
            this.category = str;
        }
        return this.category;
    }
    async getRandomVideo(user){
        let {video,randomTimes} = await $post('/random',{user});
        let str = `今日剩余试看${randomTimes}次`;
        if(randomTimes>0){
            str = `${str}\n"视频${video.seq_id}"\n${video.title}(${video.time})\n\n${video.target_url}`
        }
        return `${str}${TIPS.tips}`;
    }
    async getVideo(id, user){
        let {video,realTimes} = await $post(`/${id}`,{user});
        let str = '';
        if(realTimes){
            str += `"视频${video.seq_id}"\n${video.title}(${video.time})\n\n${video.target_url}`
        }else{
            str = TIPS.no_balance
        }
        return `${str}\n${TIPS.tips}`;
    }
    async getVideoList(cate,page=1){
       let {list,currentPage,totalPage,category} = await $get(`/list/${cate}`,{page});
       currentPage = parseInt(currentPage);
       let str = `当前位置: ${category}(分类${cate}页${currentPage}):第(${currentPage}/${totalPage})页\n\n`;
       list.forEach((item,index)=>{
            str += `${index+1}."视频${item.seq_id}"\n${item.title}(${item.time})\n`
       })
       str += `操作提示:\n观看视频请回复"视频id"(id为数字, 如"视频${list[0].seq_id}")\n\n`;
       if(currentPage > 1){
            str += `\n上一页=>请回复"分类${cate}页${currentPage-1}"`;
       }
       if(currentPage < totalPage){
            str += `\n下一页=>请回复"分类${cate}页${currentPage+1}"`;
       }
       return str;
    }
    async recharge(user){
        await $post('/recharge',{user});
        return '充值成功, 回复"视频id"观看和下载吧';
    }
    /**
     * 获取当前微信号对应的付费用户
     */
    async getPayedList(){
        let {list} = await $get(`/payedList/${this.userSelf.id}`);
        return list
    }
    feedback(){

    }
}


module.exports = new Remote();