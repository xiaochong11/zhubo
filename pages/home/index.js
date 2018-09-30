//index.js
//获取应用实例
const app = getApp();
const globalData = app.globalData;
const baseUrl = globalData.baseUrl[globalData.env];
const imgPath = globalData.imgPath[globalData.env];

import osArr from '../../utils/osArr.js';
Page({
  	data: {
        anchorArr:[],
        dirArr:[
            {
                dir_id:1,
                name:'王者荣耀'
            },
            {
                dir_id:2,
                name:'英雄联盟'
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
        this.getAnchorData(this.data.curDirId);
  	},
    getAnchorData(dir_id){
        wx.showLoading({

        });

        let self = this;
        wx.request({
            url: baseUrl+'/anchor/getDirAnchor',
            method: 'GET',
            data: {
                dir_id:dir_id,
                version:globalData.version
            },
            success: function(res) {
                wx.hideLoading({});
                res.data.data.forEach((anchor)=>{
                    anchor.osName = osArr.find((osObj)=>{
                        return osObj.os === anchor.anchor_os
                    }).name.replace('直播','');
                })
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
        })
        this.getAnchorData(this.data.curDirId);
    },
    toComment(e){
        let anchor_id = e.currentTarget.dataset.anchor_id;
        wx.navigateTo({
            url:`../comment/index?anchor_id=${anchor_id}`
        })
    },
    toSearch(){
        wx.navigateTo({
            url:'../search/index'
        });
    },
})
