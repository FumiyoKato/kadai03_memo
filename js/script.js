$(document).ready(function() {
    // 都道府県のオプションを設定
    const prefectures = ["福島県", "千葉県", "愛媛県", "福岡県"];
    const $prefectureSelect = $('select[name="prefecture"]');

    prefectures.forEach(function(prefecture) {
        $prefectureSelect.append('<option value="' + prefecture + '">' + prefecture + '</option>');
    });

    // 都道府県に紐付くエリア名
    const primaryAreas = {
        "福島県": ["中通り", "浜通り", "会津"],
        "千葉県": ["北東部", "北西部", "南部"],
        "愛媛県": ["東予", "中予", "南予"],
        "福岡県": ["福岡地方", "北九州地方", "筑豊地方", "筑後地方"]
    };

    // ローカルストレージからデータを読み込んでフォームに設定する関数
    function loadDataFromLocalStorage() {
        const savedData = JSON.parse(localStorage.getItem('PVFCTSettings'));

        if (savedData) {
            $('#CompanyName').val(savedData.companyName);
            $('#FCT_unit_Name').val(savedData.FCTUnitName);
            $('#PVgroup_capacity').val(savedData.PVGroupCapacity);
            $('#PCSgroup_capacity').val(savedData.PCSGroupCapacity);
            $('#direction').val(savedData.direction);
            $('#angle').val(savedData.angle);
            $('#conversion_efficiency').val(savedData.conversionEfficiency);
            $('#loss_rate').val(savedData.lossRate);
            $prefectureSelect.val(savedData.prefecture);

            // 都道府県に紐付くエリア名を更新
            if (savedData.prefecture) {
                $prefectureSelect.trigger('change'); // セレクトボックスをトリガーしてエリアを再生成
                $('select[name="primary_wx_area"]').val(savedData.primaryWxArea);
            }
        }
    }

    // データをローカルストレージに保存する関数
    function saveDataToLocalStorage() {
        const data = {
            companyName: $('#CompanyName').val(),
            FCTUnitName: $('#FCT_unit_Name').val(),
            PVGroupCapacity: $('#PVgroup_capacity').val(),
            PCSGroupCapacity: $('#PCSgroup_capacity').val(),
            direction: $('#direction').val(),
            angle: $('#angle').val(),
            conversionEfficiency: $('#conversion_efficiency').val(),
            lossRate: $('#loss_rate').val(),
            prefecture: $prefectureSelect.val(),
            primaryWxArea: $('select[name="primary_wx_area"]').val()
        };

        // 全ての項目が入力されているか確認
        if (Object.values(data).some(value => !value)) {
            alert("全ての項目を入力してください。");
            return;
        }

        // ローカルストレージにデータを保存
        localStorage.setItem('PVFCTSettings', JSON.stringify(data));
        alert("データが保存されました。");
    }

    // 都道府県の選択が変更されたときに発生するイベント
    $prefectureSelect.change(function() {
        const selectedPrefecture = $(this).val();
        const $primaryAreaSelect = $('select[name="primary_wx_area"]');

        // エリア名のセレクトボックスをクリア
        $primaryAreaSelect.empty();
        $primaryAreaSelect.append('<option value="">--最寄りエリア--</option>');

        // 選択された都道府県に紐付くエリア名を追加
        if (selectedPrefecture in primaryAreas) {
            primaryAreas[selectedPrefecture].forEach(function(area) {
                $primaryAreaSelect.append('<option value="' + area + '">' + area + '</option>');
            });
        }
    });

    // ページ読み込み時にデータを復元
    loadDataFromLocalStorage();

    // ボタンにイベントリスナーを設定
    $('#apply').click(function() {
        saveDataToLocalStorage();
    });
});
