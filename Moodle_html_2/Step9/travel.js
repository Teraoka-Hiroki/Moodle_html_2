document.addEventListener('DOMContentLoaded', () => {
  // HTML要素を取得
  const searchForm = document.getElementById('searchForm');
  const locationInput = document.getElementById('locationInput');
  const streetViewIframe = document.getElementById('streetViewIframe');

  /**
   * 緯度・経度からストリートビュー埋め込み用のURLを生成する関数
   */
  function getStreetViewEmbedUrl(lat, lng) {
    // Googleマップの埋め込みURLのテンプレート
    // !1d${lat}!2d${lng} の部分に緯度と経度を埋め込む
    return `https://www.google.com/maps/embed?pb=!4v1523823931746!6m8!1m7!1sCAoSLEFGMVFpcE1EZEZBb2dHeFQwTWZ3TWZ6T2JzNGg3TzB4UXYtZkNoTnZ0X3BF!2m2!1d${lat}!2d${lng}!3f75!4f0!5f0.7820865974627469`;
  }

  // フォームが送信されたときの処理
  searchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const location = locationInput.value;
    if (location) {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`);
        const data = await response.json();
        
        if (data && data.length > 0) {
          /**
           * 【修正点！】
           * ステップ8と同様に、配列の最初の要素 [0] から緯度経度を取り出す。
           */
          const lat = data[0].lat;
          const lon = data[0].lon;
          
          // 取得した緯度経度を使ってURLを生成し、iframeのsrcを更新する
          streetViewIframe.src = getStreetViewEmbedUrl(lat, lon);

        } else {
          alert('場所が見つかりませんでした');
        }
      } catch (error) {
        alert('位置情報の取得に失敗しました');
      }
    }
  });

  /**
   * 【おまけ機能】
   * おすすめの場所をランダムに表示する機能も追加してみよう！
   */
  const randomButton = document.createElement('button'); // ボタンをJSで作成
  randomButton.id = 'randomButton';
  randomButton.textContent = '✨ おすすめの場所へ';
  randomButton.type = 'button'; // formの送信を防ぐために type="button" を指定
  searchForm.after(randomButton); // 検索フォームの後ろにボタンを追加

  const recommendedPlaces = [
    { name: '東京タワー', lat: 35.6586, lng: 139.7454 },
    { name: 'エッフェル塔', lat: 48.8584, lng: 2.2945 },
    { name: 'マチュピチュ', lat: -13.1631, lng: -72.5450 },
    { name: '渋谷スクランブル交差点', lat: 35.6595, lng: 139.7005 },
    { name: 'コロッセオ', lat: 41.8902, lng: 12.4922 },
  ];

  randomButton.addEventListener('click', () => {
    // おすすめリストからランダムに1つ選ぶ
    const place = recommendedPlaces[Math.floor(Math.random() * recommendedPlaces.length)];
    // iframeのsrcを更新
    streetViewIframe.src = getStreetViewEmbedUrl(place.lat, place.lng);
    // 入力欄にも場所の名前を入れてあげる
    locationInput.value = place.name;
  });

  // 最初にランダムな場所を1つ表示しておく
  randomButton.click();
});
