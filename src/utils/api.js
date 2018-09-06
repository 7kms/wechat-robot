
// https://www.npmjs.com/package/request
const config = require('../config')
const request = require('request')

const getConfig = (method, url , params) => {
    url = `${config.server_url}/api/yaoshe${url}`
    const obj = {
        method,
        url,
        headers : {
            'Content-Type': 'application/json'
        }
    }
    if(method === 'GET'){
        obj.qs = params
    }else{
        obj.body = JSON.stringify(params) 
    }
    return obj;
}

const $api = (options,isJson)=>{
    return new Promise((resolve,reject)=>{
        request(options,(error,response,body)=>{
            if(error){
                console.log(error,options)
                reject({status:response,error})
            }else if(response.statusCode != 200){
                console.error('remote api failed', options, body)
                reject({status:response.statusCode,body})
            }else{
                // console.log('---->',response,body)
                if(isJson){
                    const json = JSON.parse(body)
                    resolve(json.result)
                }else{
                    resolve(body)
                }
            }
        })
    })
}

const $get =  (url,params={})=>{
    const options = getConfig('GET',url,params)
    // console.log(options)
    // console.log(url)
    return $api(options,true)
}
const $getPlainText = (url,params={}) => {
    const options = getConfig('GET',url,params)
    return $api(options,false)
}

const $post =  (url,params={})=>{
    // console.log('post-->',url,params)
    const options = getConfig('POST',url,params)
    return $api(options,true)
}

const $delete =  (url,params={})=>{
    // console.log(url,params)
    const options = getConfig('DELETE',url,params)
    return $api(options,true)
}

const $put = (url,params={})=>{
    const options = getConfig('PUT',url,params)
    return $api(options,true)
}

const $uploadFile =  (url,formData={})=>{
    const options = {
        url,
        method: 'POST',
        formData
    }
    return $api(options,true)
}

module.exports = {
    $get,
    $getPlainText,
    $post,
    $delete,
    $put,
    $uploadFile
}