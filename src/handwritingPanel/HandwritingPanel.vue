<template>
  <div
    :style="{
      display: 'flex ',
      gap: '1em',
      flexWrap: 'wrap',
      justifyContent: 'center',
      border: '2px solid darkblue',
      padding: '1em',
      margin: '1em',
    }"
  >
    <span>{{ oHandwritingPanelInfo!.id }}</span>
    <span>{{ oHandwritingPanelInfo!.lang }}</span>
    <div ref="eltCanvasContainer"></div>
    <button @click="ocrText">{{ status }}</button>
    <textarea readonly>{{ oHandwritingPanelInfo!.textOcred }}</textarea>
    <button @click="handleRemove">delete</button>
  </div>
</template>

<script setup lang="ts">
import { CanvasFreeHand } from '@/handwritingPanel/CanvasFreeHand';
import { HandwritingPanelInfo, TextLanguage } from '@/handwritingPanel/HandwritingPanelInfo';
import { ref, onMounted, onUnmounted } from 'vue';
import { defineProps } from 'vue';

// aga the pb of in client or server side ... the security thing // forgot how this is dealt in client // forogt?  was there a way to allow the use of server in client -- not just next.js but how
// const OCR_SERVICE_URL = process.env.OCR_SERVICE_URL; // e.g., http://localhost:5000
const OCR_SERVICE_URL = import.meta.env.VITE_API_OCR_SERVICE_URL;
console.log('OCR_SERVICE_URL: ' + OCR_SERVICE_URL);

const eltCanvasContainer = ref<HTMLDivElement | null>(null);

onMounted(() => {
  const eltCanvas = new CanvasFreeHand().init();
  eltCanvas.style.border = '1px solid aliceblue';
  if (!eltCanvasContainer.value) throw new Error('');
  eltCanvasContainer.value.appendChild(eltCanvas);
});
// onUnmounted(() => {
//   if (eltCanvasContainer.value && eltCanvasContainer.value.firstChild) {
//     eltCanvasContainer.value.removeChild(eltCanvasContainer.value.firstChild);
//   }
// });

const props = defineProps<{
  oHandwritingPanelInfo: HandwritingPanelInfo;
}>();

// const _log = (oHandwritingPanelInfo: HandwritingPanelInfo) => {
//   console.log(oHandwritingPanelInfo);
//   return `${typeof oHandwritingPanelInfo}`;
// };

const emit = defineEmits<{
  (e: 'update-oHandwritingPanelInfo', payload: HandwritingPanelInfo): void;
  (e: 'remove-oHandwritingPanel', payload: string): void;
}>();

// const handleLangChange = (event: Event) => {
//   const target = event.target as HTMLInputElement;
//   emit('update-oHandwritingPanelInfo', { ...props.oHandwritingPanelInfo, lang: target.value as TextLanguage });
// };

// <textarea @input="handleContentChange">{{ oHandwritingPanelInfo!.textOcred }}</textarea>
// feels inf loop
// const handleContentChange = (event: Event) => {
//   const target = event.target as HTMLInputElement;
//   emit('update-oHandwritingPanelInfo', { ...props.oHandwritingPanelInfo, textOcred: target.value });
// };

const handleRemove = () => {
  emit('remove-oHandwritingPanel', props.oHandwritingPanelInfo.id);
};

const status = ref('convert'); // Reactive status variable

defineExpose({
  status,
  lang: props.oHandwritingPanelInfo.lang,
  handleRemove
});

// ################################

async function _convert_CanvasBackground_Transparent2White(canvas_Ori: HTMLCanvasElement): Promise<string> {
  return new Promise((resolve) => {
    const imgDataUrl_Ori = canvas_Ori.toDataURL('image/png'); //  'image/jpeg'
    const img = new Image();
    img.src = imgDataUrl_Ori;
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas_Ori.width;
    tempCanvas.height = canvas_Ori.height;
    const tempCtx = tempCanvas.getContext('2d') ?? (() => { throw new Error(); })(); // prettier-ignore
    // Set background to white
    // tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
    img.onload = function () {
      tempCtx.drawImage(img, 0, 0);
      // // Overwrite the original canvas
      // ctx.drawImage(tempCanvas, 0, 0);
      const newImgDataUrl = tempCanvas.toDataURL('image/png');
      return resolve(newImgDataUrl);
    };
  });
}

async function ocrText(event: MouseEvent) {
  //
  status.value = 'converting';

  const eltCanvas = eltCanvasContainer.value!.firstChild as HTMLCanvasElement;
  const imgDataUrl = await _convert_CanvasBackground_Transparent2White(eltCanvas);

  console.log('>> imgDataUrl: ' + imgDataUrl.substring(0, 50));
  // ~~~~// idk those old talk of axios & fetch api; the feeling ...
  // @todo timeout
  const response = await fetch(OCR_SERVICE_URL + '/ocr_text/ocr_text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ imgDataUrl: imgDataUrl }),
  });
  const textOcred = await response.json();
  // const textOcred = await response.text();
  console.log('>> textOcred: ' + textOcred);

  emit('update-oHandwritingPanelInfo', { ...props.oHandwritingPanelInfo, textOcred });

  //
  status.value = 'convert';
}
</script>
