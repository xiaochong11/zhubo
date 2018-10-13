//index.js
//获取应用实例
const app = getApp();
const globalData = app.globalData;
const baseUrl = globalData.baseUrl[globalData.env];
const imgPath = globalData.imgPath[globalData.env];

// import osArr from '../../utils/osArr.js';
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
        this.page = 0;
        this.getAnchorData(this.data.curDirId);

        wx.showModal({
            title:'新版上线',
            content:'1.点击用户头像，可查看用户信息；2.新增用户留言排行榜；3.优化留言框，支持多行格式',
            showCancel:true
        })
  	},
    getAnchorData(dir_id){
        if(this.page===-1){
            return;
        }
        wx.showLoading({

        });
        let self = this;
        wx.request({
            url: baseUrl+'/anchor/getDirAnchor',
            method: 'GET',
            data: {
                dir_id:dir_id,
                page:this.page,
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
                        anchorArr:res.data.data
                    });
                }else{
                    self.data.anchorArr = self.data.anchorArr.concat(res.data.data);
                    self.setData({
                        anchorArr:self.data.anchorArr
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
    scrollToLower(){
        console.log('底部');
        this.getAnchorData(this.data.curDirId);
    },
    changeDir(e){
        let dir_id = e.currentTarget.dataset.dir_id;
        this.setData({
            curDirId:dir_id
        });
        //重置page为0
        this.page=0;
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
