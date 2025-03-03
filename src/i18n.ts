import i18n, { LanguageDetectorAsyncModule } from "i18next";
import { initReactI18next, Translation } from "react-i18next";

type Translation = typeof en;

declare module "i18next" {
    interface CustomTypeOptions {
        resources: {
            translation: Translation;
        }
    }
}

const en = {
    addImages: "Add some images to get started",
    uploadImages: "Upload Images",
    chooseFiles: "Choose Files",
    removeImage: "Remove image",
    gridColumns: "Grid Columns",
    addColumn: "Add column",
    removeColumn: "Remove column",
    gridRows: "Grid Rows",
    addRow: "Add row",
    removeRow: "Remove row",
    elementSize: "Element size",
    maxImage: "Max Image",
    minImage: "Min Image",
    imageFit: "Image fit",
    cover: "Cover",
    contain: "Contain",
    saveAs: "Save as",
    quality: "Quality",
    download: "Download",
};

const jp: Translation = {
    addImages: "画像を追加して始めましょう",
    uploadImages: "画像をアップロードする",
    chooseFiles: "ファイルを選択",
    removeImage: "画像を削除",
    gridColumns: "グリッドのカラム",
    addColumn: "カラムを追加",
    removeColumn: "カラムを削除",
    gridRows: "グリッドのロー",
    addRow: "ローを追加",
    removeRow: "ローを削除",
    elementSize: "画像サイズ",
    maxImage: "最大サイズ",
    minImage: "最小サイズ",
    imageFit: "画像のフィット",
    cover: "カバー",
    contain: "コンテイン",
    saveAs: "保存",
    quality: "画質",
    download: "ダウンロード",
};

const pathDetector: LanguageDetectorAsyncModule = {
    type: "languageDetector",
    async: true,
    detect: callback => {
        if (window.location.pathname === "/ja" || window.location.pathname === "/jp") {
            callback("jp");
        }
        else {
            callback("en");
        }
    },
};

i18n
    .use(initReactI18next)
    .use(pathDetector)
    .init({
        resources: {
            en: {
                translation: en,
            },
            jp: {
                translation: jp,
            },
        },
        fallbackLng: "en",
        debug: import.meta.env.MODE === "development",
        interpolation: {
            escapeValue: false,
        },
});

export default i18n;
