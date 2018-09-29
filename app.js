//app.js
App({
  onLaunch: function () {
    // 登录
    // wx.login({
    //     success: res => {
    //         //发送 res.code 到后台换取 openId, sessionKey, unionId
    //         let self = this;
    //         wx.request({
    //             url: this.globalData.baseUrl[this.globalData.env]+'/user/wx_start',
    //             method: 'GET',
    //             data: {
    //                 code:res.code,
    //                 version:this.globalData.version
    //             },
    //             success: function(res) {
    //                 console.log(res);
    //                 let data = JSON.parse(CryptoJS.AES.decrypt(JSON.stringify(res.data.data),self.globalData.key,{format: CryptoJSAesJson}).toString(CryptoJS.enc.Utf8));
    //                 self.globalData.userInfo = data;
    //                 // self.globalData.userInfo.user_id = 4;
    //                 // self.globalData.userInfo = {
    //                 //     user_id:3
    //                 // }
    //             }
    //         })    
    //     }
    // })
},
globalData: {
    userInfo: null,
    user:null,
    env:'prd',
    version:10,
    baseUrl:{
        'dev':'https://www.zhiboke.site/api/site',
        'prd':'https://www.zhiboke.site/api/site'
    },
    imgPath:{
          // 'dev':'../../assets/images/',
        'dev':'https://upyun.lesson.bbwansha.com/dub/program/images',
        'prd':'https://upyun.lesson.bbwansha.com/dub/program/images'
    },
    userInfo:{

    },
  },
  postUserInfo(userInfo,cb){
        // let self = this;
        let globalData = this.globalData;
        console.log(globalData);
        wx.request({
            url: globalData.baseUrl[globalData.env]+'/user/wx_login',
            method: 'GET',
            data: {
                user_id:globalData.userInfo.user_id,
                nickname:userInfo.nickName,
                avatar:userInfo.avatarUrl,
                city:userInfo.city,
                gender:userInfo.gender,
                version:globalData.version
            },
            success: function(res) {
                let data = res.data.data;
                globalData.userInfo = data;
                cb();
            },
            fail:function(){
                wx.showToast({
                    title: '请求失败',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    }
})
