//index.js
//获取应用实例
const app = getApp();
const globalData = app.globalData;
const baseUrl = globalData.baseUrl[globalData.env];
const imgPath = globalData.imgPath[globalData.env];
const commentLimit = 5;

Page({
  	data: {
        anchorCommentObj:null,
        imgPath:imgPath,
        isDialogShow:false,
        commentInput:'',
        isAttention:false,
        userInfo:null
  	},
    onReady: function (res) {
        
    },
  	onLoad: function (options) {
        if(globalData.userInfo.user_avatar){
            this.setData({
                userInfo:globalData.userInfo
            })
        }
        if(options.share_user_id){
            app.addShareRecord(options.share_user_id,globalData.userInfo.user_id)
        }
        this.anchor_id = options.anchor_id||1;
        this.page = 0; 
        wx.showShareMenu({
            // 要求小程序返回分享目标信息
            withShareTicket: true
        }); 
        this.getAnchorComment(this.anchor_id);
        this.getUserAnchorAttention(this.anchor_id);


  	},
    toIndex(){
        wx.switchTab({
            url:'../home/index',
        })
    },
    onShareAppMessage(obj){
        return {
            title: `为主播 ${this.data.anchorCommentObj.anchorInfo.anchor_name} 助威`,
            path: `/pages/comment/index?anchor_id=${this.anchor_id}&share_user_id=${globalData.userInfo.user_id}`,
            imageUrl:''
        }
    },
    bindGetUserInfo: function(e) {
        console.log(e.detail.userInfo);
        app.postUserInfo(e.detail.userInfo,()=>{
            this.setData({
                userInfo:globalData.userInfo
            })
        });
    },
    toUser(e){
        let user_id = e.currentTarget.dataset.user_id;
        wx.navigateTo({
            url:`../user/index?user_id=${user_id}`
        })
    },
    getAnchorComment(anchor_id){
        if(this.page=== -1){
            return;
        }
        wx.showLoading({

        });

        let self = this;
        wx.request({
            url: baseUrl+'/anchor/getAnchorComment',
            method: 'GET',
            data: {
                anchor_id:anchor_id,
                page:this.page,
                version:globalData.version
            },
            success: function(res) {
                wx.hideLoading({});
                // res.data.data.commentList.forEach((comment)=>{
                //     comment.comment_date = new Date(comment.comment_date).toLocaleDateString();
                    
                // });
                // res.data.data.anchorInfo.dirName = dirConfigObj[res.data.data.anchorInfo.anchor_dir_id];
                // res.data.data.anchorInfo.roomNum = dirConfigObj[]

                // res.data.data.anchorInfo.osIcon  = 'https://www.zhiboke.site'+ osArr.find((osObj)=>{
                //                                         return osObj.os === res.data.data.anchorInfo.anchor_os
                //                                     }).icon;
                // res.data.data.anchorInfo.osName = osArr.find((osObj)=>{
                //                                         return osObj.os === res.data.data.anchorInfo.anchor_os
                //                                     }).name.replace('直播','');


                if(self.page === 0){
                    self.setData({
                        anchorCommentObj:res.data.data
                    });
                }else{
                    console.log(res.data.data.commentList.length);
                    self.data.anchorCommentObj.commentList = self.data.anchorCommentObj.commentList.concat(res.data.data.commentList);
                    self.setData({
                        anchorCommentObj: self.data.anchorCommentObj
                    });
                }
                if(res.data.data.commentList.length===commentLimit){
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
    getUserAnchorAttention(anchor_id){
        wx.request({
            url: baseUrl+'/userInfo/checkAttention',
            method: 'GET',
            data: {
                anchor_id:anchor_id,
                user_id:globalData.userInfo.user_id
            },
            success: res=> {
                this.setData({
                    isAttention:res.data.data.isAttention
                })
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
    scrollToLower(){
        console.log('滚动到底部');
        this.getAnchorComment(this.anchor_id);
    },
    
    addComment(){
        this.setData({
            isDialogShow:true
        })
    },
    hideDialog(){
        this.setData({
            isDialogShow:false
        })
    },
    inputBlur(e){
        this.inputValue = e.detail.value;
    },
    commentSubmmit(e){
        if(!this.data.userInfo){
            wx.switchTab({
                url:'../mine/index'
            });
            return;
        } 
        if(!this.inputValue){
            wx.showToast({
                icon: 'none',
                title:'请输入评论内容',
                duration: 2000
            })
        }

        let isAnonymous = e.currentTarget.dataset.is_anonymous;
        console.log(isAnonymous);
        wx.request({
            url: baseUrl+'/anchor/postAnchorComment',
            method: 'POST',
            data: {
                anchor_id:this.anchor_id,
                comment_auth_id:this.data.userInfo.user_id,
                rate:5,
                content:this.inputValue,
                anonymous:isAnonymous
            },
            success:(res)=>{
                wx.showToast({
                    title:'留言成功',
                    duration: 2000
                }),
                this.page = 0; 
                this.setData({
                    anchorCommentObj:null,
                    imgPath:imgPath,
                    isDialogShow:false,
                    commentInput:''
                });
                this.getAnchorComment(this.anchor_id);
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
    addAttention(){
        if(!this.data.userInfo){
            wx.switchTab({
                url:'../mine/index'
            });
            return;
        } 
        if(this.data.isAttention){
            wx.showToast({
                title:'你已关注',
                duration: 2000
            })
            return;
        }
        wx.request({
            url: baseUrl+'/userInfo/addAttention',
            method: 'POST',
            data: {
                user_id:this.data.userInfo.user_id,
                anchor_id:this.anchor_id
            },
            success:(res)=>{
                if(res.data.code===200){
                    wx.showToast({
                        title:'关注成功',
                        duration: 2000
                    }),
                    this.setData({
                        isAttention:true
                    })
                }
                
            }
        })
    },
    addUpNum(e){
        if(!this.data.userInfo.user_avatar){
            wx.switchTab({
                url:'../mine/index'
            });
            return;
        } 
        let comment_id = e.currentTarget.dataset.comment_id;
        let curCommentObj = this.data.anchorCommentObj.commentList.find((comment)=>{
                            return comment_id === comment.comment_id
                        })
        if(curCommentObj.isUp){
            wx.showToast({
                    title: '不能重复点赞',
                    icon: 'none',
                    duration: 2000
                })
            return;
        }
        
        wx.request({
            url: baseUrl+'/anchor/updateCommentTimes',
            method: 'GET',
            data: {
                comment_id:comment_id,
                user_id:this.data.userInfo.user_id,
                item:'up'
            },
            success:(res)=>{
                if(res.data.code === 200){
                    wx.showToast({
                        title:'点赞成功',
                        duration: 2000
                    });
                    curCommentObj.isUp = true;
                    curCommentObj.comment_up++;
                    this.setData({
                        anchorCommentObj:this.data.anchorCommentObj
                    })
                }else{
                    wx.showToast({
                        title: res.data.data || '点赞失败',
                        icon: 'none',
                        duration: 2000
                     })
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
})
