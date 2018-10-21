//index.js
//获取应用实例
const app = getApp();
const globalData = app.globalData;
const baseUrl = globalData.baseUrl[globalData.env];
const imgPath = globalData.imgPath[globalData.env];

// import osArr from '../../utils/osArr.js';
Page({
  	data: {
        userShareArr:[],
        userCommentArr:[],
        anchorArr:[],
        dirArr:[
            {
                dir_id:0,
                name:'分享榜',
            },
            {
                dir_id:1,
                name:'留言榜'
            },
            {
                dir_id:2,
                name:'关注榜'
            },
        ],
        curDirId:0,
        imgPath:imgPath
  	},
    onReady: function (res) {
        
    },
  	onLoad: function (options) {
        console.log('onLoad');
        // wx.setNavigationBarTitle({
        //     title: '动画配音'
        // });
        if(options.share_user_id){
            app.addShareRecord(options.share_user_id,globalData.userInfo.user_id)
        }
        wx.showShareMenu({
            // 要求小程序返回分享目标信息
            withShareTicket: true
        }); 
        
        this.getExploreNotice();
        this.getUserShareRank();
  	},
    onShareAppMessage(obj){
        return {
            title: `主播热度榜`,
            path: `/pages/explore/index?share_user_id=${globalData.userInfo.user_id}`,
            imageUrl:''
        }
    },

    getExploreNotice(){
        wx.request({
            url: baseUrl+'/notice/getNotice',
            method: 'GET',
            data: {
                type:'explore'
            },
            success: function(res) {
                let notice = res.data.data;
                if(notice && notice.title && !wx.getStorageSync('exploreModal_'+notice.notice_id)){
                    wx.showModal({
                        title:notice.title,
                        content:notice.content,
                        showCancel:true,
                        complete:()=>{
                            wx.setStorageSync('exploreModal_'+notice.notice_id,'yes');
                        }
                    })
                }
               
            }
        })    
    },
    changeDir(e){
        let dir_id = e.currentTarget.dataset.dir_id;
        this.setData({
            curDirId:dir_id
        });
        if(this.data.curDirId===0){
            this.getUserShareRank()
        }else if(this.data.curDirId===1){
            this.getUserCommentRank();
        }else if(this.data.curDirId===2){
            this.getAnchorRank();
        }
        
    },
    getUserShareRank(){
        wx.showLoading({

        });
        let self = this;
        wx.request({
            url: baseUrl+'/rank/getUserShareRank',
            method: 'GET',
            data: {
                version:globalData.version
            },
            success: function(res) {
                wx.hideLoading({});
                self.setData({
                    userShareArr:res.data.data
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
    getUserCommentRank(){
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
                self.setData({
                    userCommentArr:res.data.data
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
