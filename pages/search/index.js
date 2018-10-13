const app = getApp();
const globalData = app.globalData;
const baseUrl = globalData.baseUrl[globalData.env];
const imgPath = globalData.imgPath[globalData.env];

const CryptoJS = globalData.CryptoJS;
const CryptoJSAesJson = globalData.CryptoJSAesJson;
Page({
	data: {
		word:'',
		hotWordArr:null,
		imgPath:imgPath,
		isCanClear:false
	},
	onLoad:function(options){
		this.setData({
			word:options.word || ''
		})
		console.log(this.data.word);
		if(this.data.word){
			this.setData({
				isCanClear:true
			})
		}
		console.log(111);
		this.getHotWordArr();
	},
	getHotWordArr(){
		// let self = this;
		// wx.request({
		// 	url: baseUrl+'/search/hot',
		// 	method: 'GET',
		// 	data: {
		// 		version:globalData.version
		// 	},
		// 	success: function(res) {
		// 		let data = JSON.parse(CryptoJS.AES.decrypt(JSON.stringify(res.data.data),globalData.key,{format: CryptoJSAesJson}).toString(CryptoJS.enc.Utf8));
		// 		self.setData({
		// 			hotWordArr:data
		// 		});
		// 	},
		// 	fail:function(){
		// 		wx.showToast({
		// 			title: '请求失败',
		// 			icon: 'none',
		// 			duration: 2000
		// 		})
		// 	}
		// })

		this.setData({
			hotWordArr:[{words:'寒冰'},{words:'童子'},{words:'夕阳'}]
		});
	},
	changeWord(e){
		let word = e.currentTarget.dataset.word;
		this.setData({
			word:word
		});
		this.toNext(word);
	},
	bindConfirm(e){
		let word = e.detail.value;
		this.toNext(word);
	},
	bindBlur(e){
		// let word = e.detail.value;
		// this.toNext(word);
	},
	bindInput(e){
		console.log(e.detail.value);
		this.setData({
			isCanClear:e.detail.value===''?false:true
		})
	},
	deleteWord(){
		this.setData({
			word:''
		});
		this.setData({
			isCanClear:false
		})
	},
	toNext(word){
		if(word){
			wx.redirectTo({
            	url:'../search_result/index?word='+word
        	});
		}else{//没有搜索内容，返回首页
			wx.redirectTo({
            	url:'../home/index'
        	});
		}
		
	}
})



