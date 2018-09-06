const { config, log, Wechaty, Friendship ,Message, Contact} = require('wechaty');
console.log(Contact.Gender)

class Base {
    static async contactDetail(contact){
       contact =  contact || Wechaty.instance().userSelf();
       const id = contact.id;
       const name = contact.name();
    //    const type = contact.type();
       const gender = contact.gender();
    //    const isFriend = contact.friend();
       const alias = await contact.alias()
    //    console.log(contact)
    //    console.log(`contact id: ${id}`)
    //    console.log(`contact name: ${name}`)
    //    console.log(`contact type: ${type}  ${Contact.Type[type]}`)
    //    console.log(`contact gender: ${gender}  ${Contact.Gender[gender]}`)
    //    console.log(`contact isFriend: ${isFriend}`)
    const str = `id:${id},name:${name},alias:${alias},gender:${Contact.Gender[gender]}`;
    console.log(str)
       return str
    }

    static async contactAll(){
        let list = await Wechaty.instance().Contact.findAll();
        list = list.filter(contact=>contact.type() !== Contact.Type.Official);
        for(let contact of list){
            let msg =  await Base.contactDetail(contact)
            await Base.report(msg)
        }
    }

    static async report(msg){
        if(!Base.REPORT_CONTACT){
            // let target_contact = Wechaty.instance().userSelf();
            let target_contact = await Wechaty.instance().Room.find({topic: 'yy-1001'});
            if(target_contact){
                Base.REPORT_CONTACT = target_contact
            }else{
                console.log('yy-1001 is not find')
                return false;
            }
        }
        await Base.REPORT_CONTACT.say(msg)
    }
}

module.exports = Base;