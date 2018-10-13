//index.js
//获取应用实例
const app = getApp();
const globalData = app.globalData;
const baseUrl = globalData.baseUrl[globalData.env];
const imgPath = globalData.imgPath[globalData.env];

// import osArr from '../../utils/osArr.js';
Page({
    data: {
    },
    onReady: function (res) {
        
    },
    onLoad: function () {
       this.advice_content = '';
       this.advice_contact = '';
    },
    contentBlur(e){
        this.advice_content = e.detail.value;
    },
    contactBlur(e){
        this.advice_contact = e.detail.value;
    },
    postAdvice(dir_id){
        if(!this.advice_content){
            wx.showToast({
                title: '建议内容不能为空！',
                icon: 'none',
                duration: 2000
            });
            return;
        }
        let self = this;
        wx.request({
            url: baseUrl+'/advice/postAdvice',
            method: 'POST',
            data: {
                advice_content:this.advice_content,
                advice_contact:this.advice_contact
            },
            success: function(res) {
                wx.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 2000
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
})
