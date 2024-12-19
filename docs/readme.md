- This program can do handwriting ocr.

- Model architecture is based on CRNN + CTC. 
  Model is built with Pytorch.
  UI is written in Vue. 
  Server is built with FastApi & Uvicorn

- You will need to start up those 2 services in order to draw and ocr your handwriting.

- Demo:
  ![demo](<./demo - ocrSentence - 20241219_172540567.png>)

- Model architecture specifically: `CNN + MLP + ResNet > CNN > 2 bidirectional GRU > MLP > CTC loss` 

  - see: https://github.com/Norlandz/ocrSentenceModel .\demo-ipynb\ocrSentence.ipynb .\src\mlModel\Crnn.py

  - (tried to add Attention mechanism, but only made it worse... idk how)

- Note:
  - The model was only trained for 30min on a relatively small dataset.
    So the accuracy is not high.

  - The time for conversion is long. 
    Because I didnt do any optimization on the process.

- Repos for the same project:
  - https://github.com/Norlandz/ocr-sentence-ui
  - https://github.com/Norlandz/ocrSentenceModel
