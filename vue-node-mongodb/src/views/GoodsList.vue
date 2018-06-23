<template lang="pug">
  div
    nav-header
    nav-bread
      span goods
    .accessory-result-page.accessory-page
      .container
        .filter-nav
         span.sortby Sort by:
          a.default.cur(href="javascript:") Default
          a.price(href="javascript:;",@click="sortGoods")
            | Price 
            svg.icon.icon-arrow-short(v-bind:class="{'sort-up':sortFlag}")
              use(xlink:href="#icon-arrow-short")
          a.filterby.stopPop(href="javascript:;", @click="showFilterPop") Filter by
        .accessory-result
          // filter
          #filter.filter.stopPop(:class="{'filterby-show' : filterBy}")
            dl.filter-price
              dt Price:
              dd
                a(href="javascript:", :class="{'cur' : priceChecked === 'all'}", @click="priceChecked = 'all'") All
              dd(v-for="(price, index) in priceFilter", :key="index")
                a(href="javascript:", @click="setPriceFilter(index)", :class="{'cur': priceChecked === index}") {{ price.startPrice }} - {{ price.endPrice }}
          // search result accessories list
          .accessory-list-wrap
            .accessory-list.col-4
              ul
                li(v-for="(good, index) in goodsList", :key="index")
                  .pic
                    a(href="#")
                      img(v-lazy="'/static/' + good.productImage")
                  .main
                    .name {{ good.productName }}
                    .price {{ good.salePrice }}
                    .btn-area
                      a.btn.btn--m(href="javascript:;",@click="addCart(good.productId)") 加入购物车
              div(v-infinite-scroll="loadMore",infinite-scroll-disabled="busy",infinite-scroll-distance="30") 加载中...
    .md-overlay(v-show="overLayFlag", @click="closePop")
    nav-footer
    modal(v-bind:mdShow="mdShow",@close="closeModal('mdShow')")
      p(slot="message") 请先登录否则无法加入到购物车
      div(slot="btnGroup")
         a.btn.btn--m(@click="mdShow=false")  关闭
</template>
<script>
  import axios from 'axios'
  import NavHeader from '@/components/NavHeader'
  import NavFooter from '@/components/NavFooter'
  import NavBread from '@/components/NavBread'
  import Modal from '@/components/Modal'
  export default {
    data() {
      return {
        goodsList: [],
        sortFlag:true, //点升序降序是从全部显示的商品开始
        page:1,
        pageSize:3,
        busy:true,
        priceFilter: [
          {
            startPrice: '0.00',
            endPrice: '100.00'
          },
          {
            startPrice: '100.00',
            endPrice: '500.00'
          },
          {
            startPrice: '500.00',
            endPrice: '1000.00'
          },{
            startPrice: '1000.00',
            endPrice: '5000.00'
          }
        ],
        priceChecked: 'all',
        filterBy: false,
        overLayFlag: false,
        mdShow:false,
      }
    },
    components: {
      NavHeader, NavFooter, NavBread,Modal
    },
    mounted() {
      this.getGoodsList()
    },
    methods: {
      getGoodsList(flag) {
      	var param={
      		page:this.page,
      		pageSize:this.pageSize,
      		sort:this.sortFlag?1:-1,
      		priceLevel:this.priceChecked
      	}
        axios.get('/goods/list',{
        	params:param
        }).then((result) => {
          let res = result.data;
          if(res.status == "0"){
          	if(flag){//true就告诉他分页要进行累加
          		this.goodsList = this.goodsList.concat(res.result.list);
          		if(res.result.count== 0){ //说明没有数据加载进来了，那么loading就变为busy
          			this.busy=true
          		}else{
          			this.busy=false
          		}
          	}else{//没有分页的就把数据原封不动地还给它
          		this.goodsList = res.result.list
          		//填充数据中需要把busy改成false
          		this.busy=false 
          	}
          	
          }else{
          	this.goodsList = []
          }
        })
      },
      sortGoods(){
      	this.sortFlag = !this.sortFlag
      	this.page=1;
      	this.getGoodsList();//重新加载
      },
      setPriceFilter(index) {
        this.priceChecked = index
        this.page=1;
        this.getGoodsList();
      },
      loadMore(){
      	  this.busy = true; //禁止去滚动加载
	      setTimeout(() => {
	          this.page++;
	          this.getGoodsList(true);//页码加完再去加载商品列表,true就告诉他分页要进行累加
	      }, 500);
      },
      
        showFilterPop() {
        this.filterBy = true
        this.overLayFlag = true
      },
      closePop() {
        this.filterBy = false
        this.overLayFlag = false
      },
      addCart(productId){
      	axios.post("/goods/addCart",{
      		productId:productId
      	}).then((res)=>{
      		console.log(res)
      		  if(res.data.status==0){
                alert("添加成功");
                 // 购物车数量加1
                this.$store.commit('updateCartCount',1);
            }else{
            	this.mdShow=true
//              alert("msg:"+res.data.msg);
            }
      	})
      },
      closeModal(attr){
	  		this[attr]=false
	  		console.log(this[attr]=false)
	    }
    }
    }
 
</script>