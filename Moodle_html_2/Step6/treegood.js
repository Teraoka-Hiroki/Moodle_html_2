document.addEventListener('DOMContentLoaded', () => {
    // --- DOM要素の取得 ---
    const startButton = document.getElementById('startButton');
    const postButton = document.getElementById('postButton');
    const datetimeSpan = document.getElementById('datetime');
    const goodThing1 = document.getElementById('goodThing1');
    const goodThing2 = document.getElementById('goodThing2');
    const goodThing3 = document.getElementById('goodThing3');
    const displayArea = document.getElementById('displayArea');
    const postedContent = document.getElementById('postedContent');

    // ローカルストレージに保存する際のキー
    const INPUT_STORAGE_KEY = 'threeGoodThings_inputs';
    const CSV_STORAGE_KEY = 'threeGoodThings_csv';

    let currentDateTime; // 日時情報を保持する変数

    // --- 関数の定義 ---

    // 日時を更新して表示する関数
    const updateDateTime = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');

        currentDateTime = {
            date: `${year}/${month}/${day}`,
            time: `${hours}:${minutes}:${seconds}`
        };

        datetimeSpan.textContent = `${currentDateTime.date} ${currentDateTime.time}`;
    };

    /**
     * 【変更点】
     * 画面とローカルストレージをクリアする関数
     */
    const clearScreen = () => {
        goodThing1.value = '';
        goodThing2.value = '';
        goodThing3.value = '';
        displayArea.classList.remove('visible'); // 表示エリアを非表示に
        localStorage.removeItem(INPUT_STORAGE_KEY); // 保存されている入力内容を削除
        alert('内容をリセットしました。新しく日記を始めましょう。');
        updateDateTime(); // 日時を更新
    };
    
    /**
     * 【新規追加】
     * 前回入力した内容をローカルストレージから読み込んで表示する関数
     */
    const loadPreviousInputs = () => {
        const savedInputs = localStorage.getItem(INPUT_STORAGE_KEY);
        if (savedInputs) {
            const { thing1, thing2, thing3 } = JSON.parse(savedInputs);
            goodThing1.value = thing1 || '';
            goodThing2.value = thing2 || '';
            goodThing3.value = thing3 || '';
        }
    };

    // CSV形式の文字列を安全にエスケープする関数
    const escapeCSV = (str) => {
        if (str == null) return '';
        if (/[",\n]/.test(str)) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    // CSVデータをダウンロードさせる関数
    const downloadCSV = (data) => {
        const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        const blob = new Blob([bom, data], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'treegoodlog.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    
    // HTMLエスケープ用の簡易関数
    const escapeHTML = (str) => {
        return str.replace(/[&<>"']/g, (match) => {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[match];
        });
    };

    // --- イベントリスナーの設定 ---

    // 「開始」ボタンがクリックされたとき
    startButton.addEventListener('click', clearScreen);

    // 「投稿」ボタンがクリックされたとき
    postButton.addEventListener('click', () => {
        const thing1 = goodThing1.value.trim();
        const thing2 = goodThing2.value.trim();
        const thing3 = goodThing3.value.trim();

        // 入力チェック
        if (!thing1 || !thing2 || !thing3) {
            alert('3つの項目をすべて入力してください。');
            return;
        }

        // 日時を投稿時のものに更新
        updateDateTime();

        // 画面に投稿内容を表示
        postedContent.innerHTML = `
            <p><strong>日時:</strong> ${escapeHTML(currentDateTime.date)} ${escapeHTML(currentDateTime.time)}</p>
            <p><strong>1:</strong> ${escapeHTML(thing1)}</p>
            <p><strong>2:</strong> ${escapeHTML(thing2)}</p>
            <p><strong>3:</strong> ${escapeHTML(thing3)}</p>
        `;
        displayArea.classList.add('visible');

        /**
         * 【新規追加】
         * 入力内容をローカルストレージに保存する
         */
        const inputsToSave = { thing1, thing2, thing3 };
        localStorage.setItem(INPUT_STORAGE_KEY, JSON.stringify(inputsToSave));

        // CSVデータを作成
        const csvRow = [
            escapeCSV(currentDateTime.date),
            escapeCSV(currentDateTime.time),
            escapeCSV(thing1),
            escapeCSV(thing2),
            escapeCSV(thing3)
        ].join(',') + '\n';

        let existingData = localStorage.getItem(CSV_STORAGE_KEY) || '';
        const newData = existingData + csvRow;
        localStorage.setItem(CSV_STORAGE_KEY, newData);

        const header = '"日付","時刻","良かったこと1","良かったこと2","良かったこと3"\n';
        downloadCSV(header + newData);
        
        alert('投稿内容をCSVファイルとしてダウンロードします。\nこれまでの全ての記録が含まれています。');
        
        // 【変更点】投稿後に入力欄をクリアしない
    });

    // --- 初期化処理 ---
    updateDateTime();
    loadPreviousInputs(); // 【変更点】ページ読み込み時に前回の内容を読み込む
});
