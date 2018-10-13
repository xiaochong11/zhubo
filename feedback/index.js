//index.js
const app = getApp();
const globalData = app.globalData;
const baseUrl = globalData.baseUrl[globalData.env];
const imgPath = globalData.imgPath[globalData.env];
import osArr from '../../utils/osArr.js';
Page({
	data:{
		imgPath:imgPath,
		userInfo:null,
		userDubArr:null,
		attentionArr:[],
        commentArr:[],
        optionArr:[
            {
                optionId:1,
                name:'我的留言'
            },
            {
                optionId:0,
                name:'关注的主播'
            }
        ],
        curOptionId:1
	},
	onLoad: function () {
		//this.getSetting();
        console.log(globalData.userInfo);
		if(globalData.userInfo.user_avatar){
            this.setData({
                userInfo:globalData.userInfo
            });
			this.getUserAttention(this.data.userInfo.user_id);
            this.getUserComment(this.data.userInfo.user_id);
		}
		
	},
    changeOption(e){
        let optionId = e.currentTarget.dataset.option_id;
        this.setData({
            curOptionId:optionId
        });

        if(optionId===0){
            this.getUserAttention(this.data.userInfo.user_id);
        }else{
            this.getUserComment(this.data.userInfo.user_id);
        }

    },
	bindGetUserInfo: function(e) {
		console.log(e.detail.userInfo);
        app.postUserInfo(e.detail.userInfo,()=>{
            this.setData({
                userInfo:globalData.userInfo
            });
            this.getUserAttention(globalData.userInfo.user_id);
        });
	},
	getUserAttention(user_id){
        let self = this;
        wx.request({
            url: baseUrl+'/userInfo/getUserAttention',
            method: 'GET',
            data: {
                user_id:user_id,
                ts:new Date().getTime()
            },
            success: function(res) {
            	res.data.data.forEach((attention)=>{
            		attention.attentionDate = new Date(attention.attention_date).toLocaleDateString();
            		attention.osName = osArr.find((osObj)=>{
                                            return osObj.os === attention.anchor_os
                                        }).name.replace('直播','');
            	})
            	
                self.setData({
                    attentionArr:res.data.data
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
    getUserComment(user_id){
        let self = this;
        wx.request({
            url: baseUrl+'/userInfo/getUserComment',
            method: 'GET',
            data: {
                user_id:user_id,
                ts:new Date().getTime()
            },
            success: function(res) {
                // res.data.data.forEach((attention)=>{
                //     attention.attentionDate = new Date(attention.attention_date).toLocaleDateString();
                //     attention.osName = osArr.find((osObj)=>{
                //                             return osObj.os === attention.anchor_os
                //                         }).name.replace('直播','');
                // })
                
                self.setData({
                    commentArr:res.data.data
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
    toComment(e){
        let anchor_id = e.currentTarget.dataset.anchor_id;
        wx.navigateTo({
            url:`../comment/index?anchor_id=${anchor_id}`
        })
    }
})