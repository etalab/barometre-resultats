<template>
  <v-progress-linear
    :size="size"
    :width="width"
    color="primary"
    stream
    indeterminate
    >
  </v-progress-linear>
</template>

<script>
export default {
  name: 'LoaderLinear',
  props: ['size', 'width'],
}
</script>
