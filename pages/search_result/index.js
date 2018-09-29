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
        imgPath:imgPath
  	},
    onReady: function (res) {
        
    },
  	onLoad: function (option) {
 		let word = option.word;
        this.getAnchorData(word);
  	},
    getAnchorData(word){
        wx.showLoading({

        });

        let self = this;
        wx.request({
            url: baseUrl+'/anchor/getSearchAnchor',
            method: 'GET',
            data: {
                searchItem:word,
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
