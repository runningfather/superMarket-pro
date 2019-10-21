// product.js
import { Product } from 'product-model.js';
import { Cart } from '../cart/cart-model.js';
var product = new Product();
var cart = new Cart(); //将cart类实例化 就还可以在js代码里使用这个点cart类

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: null,
    countsArray: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
    productCount: 1,
    currentTabsIndex:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    this.data.id = id;
    this._loadData();
  },

  _loadData: function () {

    product.getDetailInfo(this.data.id, (data) => {
      console.log(cart.getCartTotalCounts());
      this.setData({
        cartTotalCounts: cart.getCartTotalCounts(),
        product: data
      });
    });
  },

  bindPickerChange: function (event) {
    var index = event.detail.value;
    var selectedCount = this.data.countsArray[index]
    this.setData({
      productCount: selectedCount
    });
  },

  onTabsItemTap: function (event) {      
    var index = product.getDataSet(event, 'index');
    this.setData({
      currentTabsIndex: index
    });
  },

  onAddingToCartTap:function(event){  //
    this.addToCart();
    var counts =
      this.data.cartTotalCount + this.data.productCount;
    this.setData({
      cartTotalCounts: cart.getCartTotalCounts()
    });
  },
 
  addToCart:function(){   //添加进购物车缓存的对象添加一个数据
     var tempObj = {};
     var keys = ['id', 'name', 'main_img_url', 'price']; //pro中读取这些属性即可

     for (var key in this.data.product) {  //遍历全部的数据（详情已经偶这些数据所以遍历读取）for in只遍历属性名称的奇葩比如id，name，…  indexOf
       if (keys.indexOf(key) >= 0) { //如果key属性是存在的话
         tempObj[key] = this.data.product[key]; //将key装进tmpObj中来
       }
     }

     cart.add(tempObj, this.data.productCount); //将用户选择的数据添加进购物车 add方法 
  },

  onCartTap:function(event){
    wx.switchTab({
      url: '/pages/cart/cart'
    });
  }


})