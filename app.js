//app.js
App({
onLaunch: function () {
    this.getUserId();
},
globalData: {
    userInfo: null,
    user:null,
    env:'prd',
    version:10,
    baseUrl:{
        'dev':'http://127.0.0.1:3000/api/site',
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
  getUserId(){
        // 登录
    wx.login({
        success: res => {
            //发送 res.code 到后台换取 openId, sessionKey, unionId
            let self = this;
            console.log(res.code);
            wx.request({
                url: this.globalData.baseUrl[this.globalData.env]+'/user/wxStart',
                // url:'http://127.0.0.1:3000/api/site'+'/user/wxStart',
                method: 'GET',
                data: {
                    code:res.code,
                    version:this.globalData.version
                },
                success: function(res) {
                    console.log(res);
                    self.globalData.userInfo = res.data.data;
                    // self.globalData.userInfo.user_avatar = '';
                    // self.globalData.userInfo.user_id = 1;
                }
            })    
        }
    })
  },
    postUserInfo(userInfo,cb){
        // let self = this;
        let globalData = this.globalData;
        console.log(globalData);
        wx.request({
            url: this.globalData.baseUrl[this.globalData.env]+'/user/wxUpdateUser',
            method: 'POST',
            data: {
                user_id:globalData.userInfo.user_id,
                user_name:userInfo.nickName,
                user_nickname:userInfo.nickName,
                user_avatar:userInfo.avatarUrl,
                user_city:userInfo.city,
                user_gender:userInfo.gender
            },
            success: function(res) {
                let data = res.data.data;
                globalData.userInfo = {
                    user_id:globalData.userInfo.user_id,
                    user_name:userInfo.nickName,
                    user_nickname:userInfo.nickName,
                    user_avatar:userInfo.avatarUrl,
                    user_city:userInfo.city,
                    user_gender:userInfo.gender
                };
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
    },
    addShareRecord(share_user_id,open_user_id){
        wx.request({
            url: this.globalData.baseUrl[this.globalData.env]+'/share/addShareRecord',
            method: 'POST',
            data: {
                share_user_id:share_user_id,
                open_user_id:open_user_id
            },
            success: function(res) {
                console.log(res.data.data)
            }
        })    
    },
})
