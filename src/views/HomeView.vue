<template>
  <div>
    <h2>write your text in the Canvas & click convert</h2>
    <HandwritingPanel
      v-for="(oHandwritingPanelInfo, index) in list_HandwritingPanelInfo"
      :key="oHandwritingPanelInfo.id"
      :oHandwritingPanelInfo="oHandwritingPanelInfo"
      @update-oHandwritingPanelInfo="handleUpdateHandwritingPanelInfo"
      @remove-oHandwritingPanel="handleRemoveHandwritingPanel"
      ref="list_childRef"
    />

    <button @click="add_canvas">Add Canvas</button>
    <button @click="logRefs">Log Refs</button>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, type Ref } from 'vue';
import HandwritingPanel from '@/handwritingPanel/HandwritingPanel.vue';
import { HandwritingPanelInfo, TextLanguage } from '@/handwritingPanel/HandwritingPanelInfo';

const list_HandwritingPanelInfo = reactive([
  //
  new HandwritingPanelInfo(),
  new HandwritingPanelInfo(),
]);

const add_canvas = () => {
  // const len = list_HandwritingPanelInfo.length
  list_HandwritingPanelInfo.push(new HandwritingPanelInfo());
};

// ################

function handleUpdateHandwritingPanelInfo(oHandwritingPanelInfo: HandwritingPanelInfo) {
  const index = list_HandwritingPanelInfo.findIndex((item) => item.id === oHandwritingPanelInfo.id);
  if (index !== -1) {
    list_HandwritingPanelInfo[index] = oHandwritingPanelInfo;
  }
}

function handleRemoveHandwritingPanel(id: string) {
  const index = list_HandwritingPanelInfo.findIndex((item) => item.id === id);
  if (index !== -1) {
    list_HandwritingPanelInfo.splice(index, 1);
  }
}

// ################ ################

const list_childRef = ref<
  {
    // status: Ref<string, string>;
    status: string;
    lang: TextLanguage;
    handleRemove: () => void;
  }[]
>([]);
// Log all child component refs
const logRefs = () => {
  // console.log('Current childRefs:', list_childRef.value);
  // list_childRef.value.forEach((ref, index) => {
  // .entries()
  let index = -1;
  for (const ref of list_childRef.value) {
    console.log(`Panel ${++index}:`, ref);
    // console.log(typeof ref.status);
    console.log(ref.status);
    console.log(ref.lang);
    console.log(ref.handleRemove);
  }
};
</script>
