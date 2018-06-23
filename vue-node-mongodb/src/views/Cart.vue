<template lang="pug">
  div
    nav-header
    nav-bread
      span Carts
    .accessory-result-page.accessory-page
      .container
        .cart
          .page-title-normal
            h2.page-title-h2 My Cart
          .item-list-wrap
            .cart-item
              .cart-item-head
                ul
                  li Items
                  li Price
                  li Quantity
                  li Subtotal
                  li Edit
              ul.cart-item-list
                li(v-for="item in cartList" )
                  .cart-tab-1
                    .cart-item-check
                      a.checkbox-btn.item-check-btn(href="javascipt:;" ,v-bind:class="{'check':item.checked=='1'}", @click="editCart('checked',item)")
                        svg.icon.icon-ok
                          #icon-ok
                    .cart-item-pic
                      img(v-bind:src="'/static/'+item.productImage",v-bind:alt="item.productName" )
                    .cart-item-title
                      .item-name {{item.productName}}
                  .cart-tab-2
                    .item-price {{item.salePrice | currency('$')}}
                  .cart-tab-3
                    .item-quantity
                      .select-self.select-self-open
                        .select-self-area
                          a.input-sub( @click="editCart('minu',item)" ) -
                          span.select-ipt {{item.productNum}}
                          a.input-add(@click="editCart('add',item)" ) +
                  .cart-tab-4
                    .item-price-total  {{(item.productNum*item.salePrice) | currency('$')}}
                  .cart-tab-5
                    .cart-item-opration
                      a.item-edit-btn(href="javascript:;",@click="delCartConfirm(item.productId)" )  删除
          .cart-foot-wrap
            .cart-foot-inner
              .cart-foot-l
                .item-all-check
                  a(href="javascipt:;",@click="toggleCheckAll" )
                        span.checkbox-btn.item-check-btn( v-bind:class="{'check':checkAllFlag}")
                            svg.icon.icon-ok
                              use(xlink:href="#icon-ok")
                        span Select all
              .cart-foot-r
                .item-total
                  Item total: span.total-price {{totalPrice | currency('$')}}
                .btn-wrap
                  a.btn.btn--red(v-bind:class="{'btn--dis':checkedCount==0}", @click="checkOut") Checkout
    <!--.md-overlay(v-show="overLayFlag", @click="closePop")-->
    nav-footer
    modal(v-bind:mdShow="modalConfirm",@close="closeModal('modalConfirm')")
      p(slot="message") 你确认要删除此条数据吗？
      div(slot="btnGroup", v-bind:mdShow="modalConfirm", @close="closeModal('modalConfirm')")
        a.btn.btn--m(href="javascipt:;",@click="delCart")  确认
        a.btn.btn--m(href="javascipt:;",@click="modalConfirm=false")  关闭
      
</template>
<script>
  import axios from 'axios'
  import NavHeader from '@/components/NavHeader'
  import NavFooter from '@/components/NavFooter'
  import NavBread from '@/components/NavBread'
  import Modal from '@/components/Modal'
  import {currency} from '@/util/currency.js'
  export default {
    data() {
      return {
       cartList:[],
       modalConfirm:false,
       productId:'' //全局缓存起来
      }
    },
    components: {
      NavHeader, NavFooter, NavBread,Modal
    },
    mounted() {
      this.init();
    },
    filters:{   // 定义局部过滤器
      currency:currency  // currency.js传过来的本就是函数
    },
    computed:{   // 实时计算的是属性，只不过是函数的写法，data里面就不用在声明了
      checkAllFlag(){    // 是否全选属性
        return this.checkedCount == this.cartList.length;  // 勾选的商品种数=购物车商品列表的商品种数时，返回true代表全选。
      },
      checkedCount(){   // 获取已勾选的商品种数(几种商品已勾选)
        var i = 0;
        this.cartList.forEach((item)=>{
          if(item.checked=='1')i++;
        });
        return i;
      },
      totalPrice(){   // 总价格
        var money = 0;
        this.cartList.forEach((item)=>{
          if(item.checked=='1'){
            money += parseFloat(item.salePrice)*parseInt(item.productNum);
          }
        });
        return money;
      }
    },
    methods: {
    	init(){
    		axios.get("users/cartList").then((response)=>{
    			console.log(response)
    			let res=response.data;
    			this.cartList=res.result;
    		})
    	},
    	delCartConfirm(productId){
    		this.modalConfirm=true
    		this.productId=productId;
    	},
    	delCart(){
    		axios.post("/users/cart/del",{
    			productId:this.productId
    		}).then((response)=>{
    			  let res=response.data;
    			  if( res.status == '0' ){
    			  	this.modalConfirm=false;
    			  	//重新调用，让数据初始化
    			  	this.init();
    			  	
    			  	// 右上角购物车数量更新
	            var delCount = this.delItem.productNum;
	            this.$store.commit("updateCartCount",-delCount);
    			  }
    		})
    	},
    	closeModal(attr){
	  		this[attr]=false
	  		console.log(this[attr]=false)
	    },
	    editCart(flag,item){   // 商品加减和勾选
        if(flag == 'add'){    // 添加商品数量
          item.productNum++;
        }else if(flag == 'minu'){   // 减少商品数量
          if(item.productNum <= 1){
            return;
          }
          item.productNum--;
        }else{      // 商品控制选中
          item.checked = (item.checked=='1') ? '0' : '1';
        }
        axios.post('/users/cartEdit',{
          productId:item.productId,
          productNum:item.productNum,
          checked:item.checked
        }).then((response)=>{
          let res = response.data;
          // 右上角购物车数量更新
          let num = 0;
          if(flag == 'add'){ //点加号
            num = 1
          }else if(flag == 'minu'){  //点减号
            num = -1;
          }
          this.$store.commit("updateCartCount",num);
        })
      },
	    toggleCheckAll(){    // 全选和取消全选
        // this.checkAllFlag = !this.checkAllFlag;  // 不能使用这种写法了，checkAllFlag是实时计算的属性，如果true取反变成false之后，还没来得及执行下面的所有商品取消勾选，就实时计算了检测到勾选的商品种数=购物车商品列表的商品种数,就又变成全选了。
        var flag = !this.checkAllFlag; // 声明变量取代
        this.cartList.forEach((item)=>{
          item.checked = flag ?'1':'0';
        })
        axios.post('/users/editCheckAll',{
          checkAll:flag
        }).then((response)=>{
          let res = response.data;
          if(res.status=='0'){
            console.log("update suc");
          }
        })
      },
      checkOut(){    // 结账
        if(this.checkedCount>0){   // 已勾选的商品种数>0时才可以跳转到地址列表页
          this.$router.push(
            {path:"/address"}
          );
        }
      }
    }
    }
 
</script>
<style>
  .input-sub,.input-add{
    min-width: 40px;
    height: 100%;
    border: 0;
    color: #605F5F;
    text-align: center;
    font-size: 16px;
    overflow: hidden;
    display: inline-block;
    background: #f0f0f0;
  }
  .item-quantity .select-self-area{
    background:none;
    border: 1px solid #f0f0f0;
  }
  .item-quantity .select-self-area .select-ipt{
    display: inline-block;
    padding:0 3px;
    width: 30px;
    min-width: 30px;
    text-align: center;
  }
  .item-edit-btn{
  	width: auto;
  }
</style>