document.addEventListener('DOMContentLoaded', () => {
    // 各HTML要素を取得
    const taskInput = document.getElementById('task-input'); // タスク入力欄
    const addButton = document.getElementById('add-button'); // 追加ボタン
    const deleteButton = document.getElementById('delete-button'); // 削除ボタン
    const completeButton = document.getElementById('complete-button'); // 完了ボタン
    const taskList = document.getElementById('task-list'); // タスクリスト（ul要素）

    /**
     * タスクを追加する関数
     */
    const addTask = () => {
        const taskText = taskInput.value.trim(); // 入力値を取得し前後の空白を除去
        if (taskText === '') {
            alert('タスクを入力してください。'); // 入力が空の場合は警告
            return;
        }

        // li要素を作成（タスク1件分のコンテナ）
        const listItem = document.createElement('li');

        // チェックボックスを作成（タスク選択用）
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';

        // タスクテキストを表示するspan要素を作成
        const taskSpan = document.createElement('span');
        taskSpan.className = 'task-text';
        taskSpan.textContent = taskText;

        // 編集用のinput要素を作成（初期状態では非表示）
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.className = 'edit-input';
        editInput.style.display = 'none'; // 編集時のみ表示

        // 編集確定ボタンを作成（初期状態では非表示）
        const editButton = document.createElement('button');
        editButton.textContent = '編集';
        editButton.className = 'edit-button';
        editButton.style.display = 'none'; // 編集時のみ表示

        // 各要素をliに追加
        listItem.appendChild(checkbox);
        listItem.appendChild(taskSpan);
        listItem.appendChild(editInput);
        listItem.appendChild(editButton);

        // ulにliを追加してリストに表示
        taskList.appendChild(listItem);

        // 入力欄をクリア
        taskInput.value = '';

        // タスクテキストをクリックすると編集モードに切り替え
        taskSpan.addEventListener('click', () => {
            taskSpan.style.display = 'none'; // テキストを非表示
            editInput.style.display = 'inline-block'; // 編集欄を表示
            editButton.style.display = 'inline-block'; // 編集ボタンを表示
            editInput.value = taskSpan.textContent; // 現在のテキストを編集欄にセット
            editInput.focus(); // 編集欄にフォーカス
        });

        // 編集ボタンをクリックするとタスクを更新
        editButton.addEventListener('click', () => {
            const newText = editInput.value.trim(); // 編集後のテキストを取得
            if (newText) {
                taskSpan.textContent = newText; // テキストを更新
            }
            taskSpan.style.display = 'inline'; // テキストを再表示
            editInput.style.display = 'none'; // 編集欄を非表示
            editButton.style.display = 'none'; // 編集ボタンを非表示
        });

        // 編集中のインプットでEnterキーが押された場合もタスクを更新
        editInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                editButton.click(); // 編集ボタンの処理を呼び出す
            }
        });
    };

    /**
     * チェックされたタスクを削除する関数
     */
    const deleteSelectedTasks = () => {
        const checkedTasks = document.querySelectorAll('.task-checkbox:checked'); // チェックされたタスクを取得
        if (checkedTasks.length === 0) {
            alert('削除するタスクを選択してください。'); // 何も選択されていない場合は警告
            return;
        }
        checkedTasks.forEach(checkbox => {
            checkbox.parentElement.remove(); // チェックされたli要素を削除
        });
    };

    /**
     * チェックされたタスクを完了状態にする関数
     */
    const completeSelectedTasks = () => {
        const checkedTasks = document.querySelectorAll('.task-checkbox:checked'); // チェックされたタスクを取得
        if (checkedTasks.length === 0) {
            alert('完了するタスクを選択してください。'); // 何も選択されていない場合は警告
            return;
        }
        checkedTasks.forEach(checkbox => {
            const taskText = checkbox.parentElement.querySelector('.task-text'); // 対象のタスクテキストを取得
            taskText.classList.toggle('completed'); // 完了状態をトグル（取り消し線などのスタイル付与）
        });
    };

    // --- イベントリスナーの設定 ---
    // 「追加」ボタンのクリックイベント
    addButton.addEventListener('click', addTask);

    // 入力欄でEnterキーが押された場合もタスクを追加
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    // 「削除」ボタンのクリックイベント
    deleteButton.addEventListener('click', deleteSelectedTasks);

    // 「完了」ボタンのクリックイベント
    completeButton.addEventListener('click', completeSelectedTasks);
});