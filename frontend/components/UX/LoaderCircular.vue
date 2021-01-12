<template>
  <v-progress-circular
    class="my-3"
    :size="size"
    :width="width"
    color="primary"
    indeterminate
    >
  </v-progress-circular>
</template>

<script>
export default {
  name: 'LoaderCircular',
  props: ['size', 'width'],
}
</script>
