<template>
  <div class="absolute w-full z-10 p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg transition-opacity transition-delay:400" role="alert">
    <span class="font-medium">{{message}}</span>
  </div>
</template>

<script>
export default {
  name: "SuccessView",
  props:{
    message: String
  }
}
</script>

<style scoped>

</style>