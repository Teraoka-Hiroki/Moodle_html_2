// DOMContentLoadedイベントが発火したとき
document.addEventListener('DOMContentLoaded', () => {
    // --- DOM要素の取得 ---
    const postButton = document.getElementById('postButton');
    const goodThing1 = document.getElementById('goodThing1');
    const goodThing2 = document.getElementById('goodThing2');
    const goodThing3 = document.getElementById('goodThing3');
    const displayArea = document.getElementById('displayArea');
    const postedContent = document.getElementById('postedContent');

    // HTMLエスケープ用の簡易関数（セキュリティ対策）
    const escapeHTML = (str) => {
        return str.replace(/[&<>"']/g, (match) => {
            return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[match];
        });
    };

    // --- イベントリスナーの設定 ---

    // 「投稿」ボタンがクリックされたとき
    postButton.addEventListener('click', () => {
        // 各textareaから入力値を取得し、前後の空白を削除
        const thing1 = goodThing1.value.trim();
        const thing2 = goodThing2.value.trim();
        const thing3 = goodThing3.value.trim();

        // 入力チェック: 1つでも空欄があればアラートを出す
        if (!thing1 || !thing2 || !thing3) {
            alert('3つの項目をすべて入力してください。');
            return; // 処理を中断
        }

        // 表示エリアに投稿内容をHTMLとして書き込む
        // innerHTMLを使うと、文字列をHTMLとして解釈してくれる
        // バッククォート(`)で囲むと、文字列内に変数を${}で埋め込める（テンプレートリテラル）
        postedContent.innerHTML = `
            <p><strong>1:</strong> ${escapeHTML(thing1)}</p>
            <p><strong>2:</strong> ${escapeHTML(thing2)}</p>
            <p><strong>3:</strong> ${escapeHTML(thing3)}</p>
        `;
        
        // displayAreaに 'visible' クラスを追加して、表示状態に切り替える
        displayArea.classList.add('visible');
    });
});