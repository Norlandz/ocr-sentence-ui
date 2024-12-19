import { v4 as uuidv4 } from 'uuid';

export class HandwritingPanelInfo {
  // private static _refCount = 0;
  // public static get refCount() {
  //   return HandwritingPanelInfo._refCount;
  // }

  public lang = TextLanguage.EN;
  public img: ImageData | null = null;
  public textOcred: string | null = null;

  // @pb using class as state .. aga they send a new js object everytime ...
  public constructor(public id = uuidv4()) {
    // public sn: number,
    // HandwritingPanelInfo._refCount++;
  }
}

export enum TextLanguage {
  EN = 'EN',
  FR = 'FR',
}
