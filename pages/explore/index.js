//index.js
//获取应用实例
const app = getApp();
const globalData = app.globalData;
const baseUrl = globalData.baseUrl[globalData.env];
const imgPath = globalData.imgPath[globalData.env];

// import osArr from '../../utils/osArr.js';
Page({
  	data: {
        userArr:[],
        anchorArr:[],
        dirArr:[
            {
                dir_id:1,
                name:'用户留言榜'
            },
            {
                dir_id:2,
                name:'主播关注榜'
            },
        ],
        curDirId:1,
        imgPath:imgPath
  	},
    onReady: function (res) {
        
    },
  	onLoad: function () {
        console.log('onLoad');
        // wx.setNavigationBarTitle({
        //     title: '动画配音'
        // });
        wx.showShareMenu({
            // 要求小程序返回分享目标信息
            withShareTicket: true
        }); 
        this.getUserRank();
        this.getAnchorRank();
  	},
    getUserRank(){
        if(this.page===-1){
            return;
        }
        wx.showLoading({

        });
        let self = this;
        wx.request({
            url: baseUrl+'/rank/getUserCommentRank',
            method: 'GET',
            data: {
                version:globalData.version
            },
            success: function(res) {
                wx.hideLoading({});
                // res.data.data.forEach((anchor)=>{
                //     anchor.osName = osArr.find((osObj)=>{
                //         return osObj.os === anchor.anchor_os
                //     }).name.replace('直播','');
                // })
                if(self.page===0){
                    self.setData({
                        userArr:res.data.data
                    });
                }else{
                    self.data.userArr = self.data.userArr.concat(res.data.data);
                    self.setData({
                        userArr:self.data.userArr
                    })
                } 
                if(res.data.data.length===20){
                    self.page++;
                }else{
                    self.page = -1;
                }
                
                
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
    getAnchorRank(dir_id){
        let self = this;
        wx.request({
            url: baseUrl+'/rank/getAnchorAttentionRank',
            method: 'GET',
            data: {
                version:globalData.version
            },
            success: function(res) {
                self.setData({
                    anchorArr:res.data.data
                });
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
    changeDir(e){
        let dir_id = e.currentTarget.dataset.dir_id;
        this.setData({
            curDirId:dir_id
        });
        if(this.data.curDirId===1){
            this.getUserRank();
        }else{
            this.getAnchorRank();
        }
        
    },
    toUser(e){
        let user_id = e.currentTarget.dataset.user_id;
        wx.navigateTo({
            url:`../user/index?user_id=${user_id}`
        })
    },
    toComment(e){
        let anchor_id = e.currentTarget.dataset.anchor_id;
        wx.navigateTo({
            url:`../comment/index?anchor_id=${anchor_id}`
        })
    },
})
