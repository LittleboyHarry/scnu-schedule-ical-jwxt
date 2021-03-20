/* eslint-disable @typescript-eslint/member-ordering */

import { create, UseStore, StoreApi } from 'zustand';

import { ICalCalendar } from 'ical-generator';
import * as Rules from './rules';
import { GenerateOptions } from './generator';

declare module 'ical-generator' {
  interface ICalCalendar {
    /** 只在浏览器中存在
     * @see 包源码 */
    toBlob(): Blob;
  }
}

export enum ProgressState {
  Idle,
  Success,
  Failure
}

interface FailureMessage {
  title?: string;
  code?: string;
}

type ReturnTypeOfCreate<T> = [UseStore<T>, StoreApi<T>];
interface State {
  // 外观
  gettingStartElement: HTMLElement | null;
  introductionElement: HTMLElement | null;
  showingHelpDoc: boolean;
  setGettingStartElement(element: HTMLElement | null): void;
  setIntroductionElement(element: HTMLElement | null): void;
  showHelpDoc(): void;
  hideHelpDoc(): void;

  // 进度
  progress: ProgressState;
  failureMessage: FailureMessage;
  turnToFailure(message?: FailureMessage): void;
  turnToSuccess(calendar: ICalCalendar): void;
  turnToIdle(): void;

  // 子窗口
  window: null | Window;
  openChildWindow(url: string): void;
  closeChildWindow(): void;

  // Blob 管理
  downloadableBlobUrl: null | string;
  storeBlob(blob: Blob): void;

  // 生成参数
  generateOptions: null | GenerateOptions;
  setGenerateOptions(options: GenerateOptions): void;
}

const created = create((set, get) => ({
  // 外观
  gettingStartElement: null,
  setGettingStartElement(_) {
    set({ gettingStartElement: _ });
  },
  introductionElement: null,
  setIntroductionElement(_) {
    set({ introductionElement: _ });
  },
  showingHelpDoc: false,
  showHelpDoc() {
    set({ showingHelpDoc: true });
  },
  hideHelpDoc() {
    set({ showingHelpDoc: false });
  },
  // 进度
  progress: ProgressState.Idle,
  failureMessage: {},
  turnToFailure(message = {}) {
    set({ progress: ProgressState.Failure, failureMessage: message });
  },
  turnToSuccess(calendar) {
    if (calendar) get().storeBlob(calendar.toBlob());
    set({ progress: ProgressState.Success });
  },
  turnToIdle() {
    set({ progress: ProgressState.Idle });
  },
  // 子窗口管理
  window: null,
  openChildWindow(url) {
    set({ window: window.open(url) });
  },
  closeChildWindow() {
    get().window!.close();
    set({ window: undefined });
  },

  // Blob 管理
  downloadableBlobUrl: null,
  storeBlob(blob) {
    const url = get().downloadableBlobUrl;
    if (url) URL.revokeObjectURL(url);
    set({ downloadableBlobUrl: URL.createObjectURL(blob) });
  },

  // 生成参数
  generateOptions: null,
  setGenerateOptions(_) {
    set({ generateOptions: _ });
  }
})) as ReturnTypeOfCreate<State>;

export function getAppState() {
  return created[1].getState();
}

export const useAppState = created[0];
