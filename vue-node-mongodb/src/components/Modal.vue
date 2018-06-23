<template lang="pug">
  div
    .md-modal.modal-msg.md-modal-transition(v-bind:class="{'md-show':mdShow}")
      .md-modal-inner
        .md-top
          .md-title 
            slot(name="title")
          button.md-close(@click="closeBtn")  Close
        .md-content
          .comfirm-tips
            slot(name="message")
          .btn-wrap
            slot(name="btnGroup")
    .md-overlay(v-if="mdShow", @click="closeBtn")       

</template>

<script>
	export default {
		props:["mdShow"], 
    data() {
      return {
			}
		},
		methods:{
			closeBtn(){
				this.$emit("close")
			}
		}
}
</script>