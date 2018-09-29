//index.js
//获取应用实例
const app = getApp();
const globalData = app.globalData;
const baseUrl = globalData.baseUrl[globalData.env];
const imgPath = globalData.imgPath[globalData.env];

import osArr from '../../utils/osArr.js';
Page({
  	data: {
        anchorCommentObj:null,
        imgPath:imgPath,
        isDialogShow:false,
        commentInput:''
  	},
    onReady: function (res) {
        
    },
  	onLoad: function (options) {
        this.anchor_id = options.anchor_id||1;
        this.page = 0; 
        wx.showShareMenu({
            // 要求小程序返回分享目标信息
            withShareTicket: true
        }); 
        this.getAnchorComment(this.anchor_id);
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
                res.data.data.commentList.forEach((comment)=>{
                    comment.comment_date = new Date(comment.comment_date).toLocaleDateString();
                });

                res.data.data.anchorInfo.osIcon  = 'https://www.zhiboke.site'+ osArr.find((osObj)=>{
                                                        return osObj.os === res.data.data.anchorInfo.anchor_os
                                                    }).icon;
                res.data.data.anchorInfo.osName = osArr.find((osObj)=>{
                                                        return osObj.os === res.data.data.anchorInfo.anchor_os
                                                    }).name.replace('直播','');
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
                if(res.data.data.commentList.length===3){
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
    scrollToLower(){
        console.log('滚动到底部');
        this.getAnchorComment(this.anchor_id);
    },
    addUpNum(e){
         let comment_id = e.currentTarget.dataset.comment_id;
         wx.request({
            url: baseUrl+'/anchor/updateCommentTimes',
            method: 'GET',
            data: {
                comment_id:comment_id,
                item:'up'
            },
            success:(res)=>{
                wx.showToast({
                    title:'点赞成功',
                    duration: 2000
                });
                this.data.anchorCommentObj.commentList.forEach((comment)=>{
                    if(comment_id = comment.comment_id){
                        comment.comment_up++
                    }
                })
                this.setData({
                    anchorCommentObj:this.data.anchorCommentObj
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
    commentSubmmit(){
        console.log(this.inputValue);
        wx.request({
            url: baseUrl+'/anchor/postAnchorComment',
            method: 'POST',
            data: {
                anchor_id:this.anchor_id,
                comment_auth_id:0,
                rate:5,
                content:this.inputValue
            },
            success:(res)=>{
                wx.showToast({
                    title:'添加成功',
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

    }
})
