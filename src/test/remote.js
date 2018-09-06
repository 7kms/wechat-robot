const RemoteService = require('../service/remote-service')


const test = async ()=>{

   let res =  await RemoteService.getMenu()
   console.log(res)
}

test()