import * as ls from "./ls";
import langSvg from "../assets/lang.svg";

const lang = {
    submit: ['Submit', '提交'],
    save_and_quit: ['Save and Quit', '儲存並離開'],
    my_qbanks: ['My Question Banks', '我的題庫'],
    export_json: ['Export as JSON', '匯出 JSON'],
    add_to_saved: ['Add to Saved', '加入清單'],
    remove_from_saved: ['Remove from Saved', '從清單刪除'],
    restart: ['Restart', '重新開始'],
    continue: ['Continue', '繼續練習'],
    start: ['Start', '開始練習'],
    back: ['Back', '返回'],
    edit: ['Edit', '編輯'],
    confirm_restart: ['Are you sure you want to restart?', '確定要重新開始嗎？'],
    by: ['By: ', '作者：'],
    created_on: ['Created on ', '創建於 '],
    last_updated_on: ['Last updated on ', '更新於 '],
    explore: ['Explore', '探索'],
    upload: ['Upload', '上傳'],
    most_popular: ['Most Popular', '最熱門'],
    load_more: ['Load More', '載入更多'],
    no_qbanks_found: ['No Question Banks found', '沒有題庫'],
    sign_out: ['Sign Out', '登出'],
    create_own_qbank: ['Create your own Question Bank', '創建自己的題庫'],
    next: ['Next', '下一題'],
    try_again: ['Try Again', '再試一次'],
    loading: ['Loading...', '載入中...'],
    error: ['Error', '錯誤'],
    close: ['Close', '確定'],
    ok: ['OK', '確定'],
    cancel: ['Cancel', '取消'],
};

export const printLang = (langKey: string) => {
    const langCode = ls.getLang();
    if (langCode === 'en') return lang[langKey][0];
    return lang[langKey][1];
}

export const ChangeLangButton = ({setLangChanged}) => {
    return (
        <button onClick={()=>{ls.toggleLang(); setLangChanged((prev: number) => prev + 1);}} className='m-3 fixed top-0 right-14'>
            <img src={langSvg} alt='lang' className='w-8 h-8'/>
        </button>
    );
};
