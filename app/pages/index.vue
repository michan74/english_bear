<template>
  <div>
    <LoginButton />
  </div>
</template>
<script>
export default {
  name: 'IndexPage',
  layout: 'default',
  head() {
    return {
      title: 'Home Page',
      meta: [
        { name: 'description', content: 'This is the home page of our application.' }
      ]
    };
  },
  
};

</script>