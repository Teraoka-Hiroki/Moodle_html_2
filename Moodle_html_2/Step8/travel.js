document.addEventListener('DOMContentLoaded', () => {
  // HTML要素を取得
  const searchForm = document.getElementById('searchForm');
  const locationInput = document.getElementById('locationInput');
  const streetViewIframe = document.getElementById('streetViewIframe');

  // フォームが送信されたときの処理
  // async は、この関数の中で非同期処理（時間がかかる処理）をしますよ、という目印
  searchForm.addEventListener('submit', async (event) => {
    // formのデフォルトの送信機能をキャンセルする
    event.preventDefault(); 
    
    const location = locationInput.value; // 入力された地名を取得
    if (location) {
      try {
        // APIにリクエストを送信！
        // fetchは、指定したURLにリクエストを送るための命令
        // await は、通信が終わるまでここで待っててね、という目印
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
        
        // 受け取ったレスポンス（JSON形式）をJavaScriptのオブジェクトに変換
        const data = await response.json();
        
        // データがちゃんと取得できて、中身が空でなければ...
        if (data && data.length > 0) {
          /**
           * 【修正点！】
           * APIからの応答データは配列（リスト）で返ってくるため、
           * その最初の要素である [0] を指定してから .lat や .lon を取り出す。
           */
          const lat = data[0].lat; // 緯度を取得
          const lon = data[0].lon; // 経度を取得
          
          // 取得できた緯度経度をコンソールに表示してみる（テスト用）
          console.log(`場所: ${location}, 緯度: ${lat}, 経度: ${lon}`);
          alert(`場所が見つかりました！ 緯度: ${lat}, 経度: ${lon}`);

        } else {
          alert('場所が見つかりませんでした');
        }
      } catch (error) {
        // 通信中にエラーが起きた場合
        console.error('エラーが発生しました:', error);
        alert('位置情報の取得に失敗しました');
      }
    }
  });
});
