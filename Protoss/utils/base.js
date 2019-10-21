
import { Config } from 'config.js';
import { Token } from 'token.js';

class Base {
  constructor() {
    this.baseRequestUrl = Config.restUrl;
  }

 // 当noRefech为true时，不做未授权重试机制
  request(params, noRefetch) {
    var that = this;
    var url = this.baseRequestUrl + params.url;

    if (!params.type) {
      params.type = 'GET';
    }

    wx.request({
      url: url,
      data: params.data,
      method: params.type,
      
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token')
      },
      success: function (res) {
        // if(params.sCallBack){
        //   params.sCallBack(res);
        // }
       
        var code = res.statusCode.toString();
        var startChar = code.charAt(0);

        if (startChar == '2') {
          params.sCallback && params.sCallback(res.data);
        }
        else {                        //进入服务器，但服务器返回错误信息
          //AOP
          if (code == '401') {      //401查看是否令牌失效
            // token.getTokenFromServer
            // base.request
            if (!noRefetch) {         //判断是否重发
              that._refetch(params);    
            }
          }
          if(noRefetch){              
            params.eCallback && params.eCallback(res.data);   
          }
        }
      },
      fail: function (err) {     //未进入服务器 fail
        console.log(err);
      }
    })
  }

  _refetch(params) {
    var token = new Token();
    token.getTokenFromServer((token) => {
      this.request(params, true);             //~
    });
  }

  /*获得元素上的绑定的值*/
  getDataSet(event, key) {
    return event.currentTarget.dataset[key];
  };

}

export { Base };

