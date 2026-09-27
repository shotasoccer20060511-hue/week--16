import React, { useState } from 'react';

export default function App() {
  // タブの切り替え ('input' または 'calendar')
  const [activeTab, setActiveTab] = useState('input');

  // 日付ごとのメモを保存する状態 ({ '2026-09-27': '今日のメモ内容', ... })
  const [entries, setEntries] = useState({});

  // 今日の日付を YYYY-MM-DD 形式で取得
  const getTodayString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  // 入力画面の状態
  const [inputDate, setInputDate] = useState(getTodayString());
  const [inputText, setInputText] = useState('');

  // カレンダー画面で選択された日付と表示用モーダルの状態
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalText, setModalText] = useState('');

  // 現在表示しているカレンダーの年・月（初期値は現在の日付を基準に設定）
  const todayDate = new Date();
  const [currentYear, setCurrentYear] = useState(todayDate.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(todayDate.getMonth() + 1); // 1-12

  // メモ保存処理
  const handleSave = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setEntries((prev) => ({
      ...prev,
      [inputDate]: inputText,
    }));

    alert('メモを保存しました！');
    setInputText('');
    setActiveTab('calendar'); // 保存後にカレンダー画面へ移動
  };

  // カレンダーの日付セルをクリックしたとき
  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr);
    setModalText(entries[dateStr] || 'この日のメモはありません。');
  };

  // 指定年月のカレンダーデータを正確に生成する関数
  const generateCalendarDays = (year, month) => {
    const firstDayIndex = new Date(year, month - 1, 1).getDay(); // 月初めの曜日 (0:日曜 〜 6:土曜)
    const totalDays = new Date(year, month, 0).getDate(); // 当月の最終日

    const days = [];
    // 前月の空白埋め
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    // 当月の日付
    for (let i = 1; i <= totalDays; i++) {
      const mm = String(month).padStart(2, '0');
      const dd = String(i).padStart(2, '0');
      days.push(`${year}-${mm}-${dd}`);
    }
    return days;
  };

  const calendarDays = generateCalendarDays(currentYear, currentMonth);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-indigo-600 text-white p-4 shadow-md text-center">
        <h1 className="text-xl font-bold">日記・メモアプリ</h1>
      </header>

      {/* タブナビゲーション */}
      <div className="flex justify-center bg-white border-b border-slate-200">
        <button
          onClick={() => setActiveTab('input')}
          className={`py-3 px-6 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'input'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          📝 入力画面
        </button>
        <button
          onClick={() => setActiveTab('calendar')}
          className={`py-3 px-6 font-medium text-sm transition-colors border-b-2 ${
            activeTab === 'calendar'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          📅 カレンダー画面
        </button>
      </div>

      {/* メインコンテンツ */}
      <main className="flex-1 max-w-xl w-full mx-auto p-4">
        {activeTab === 'input' ? (
          /* --- 入力画面 --- */
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-semibold mb-4 text-slate-700">今日の出来事を入力</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">日付</label>
                <input
                  type="date"
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">本文</label>
                <textarea
                  rows="6"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="今日はどんな一日でしたか？"
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors text-sm shadow-sm"
              >
                追加する
              </button>
            </form>
          </div>
        ) : (
          /* --- カレンダー画面 --- */
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-slate-700">
                {currentYear}年 {currentMonth}月
              </h2>
              <div className="space-x-2">
                <button
                  onClick={() => {
                    if (currentMonth === 1) {
                      setCurrentYear(currentYear - 1);
                      setCurrentMonth(12);
                    } else {
                      setCurrentMonth(currentMonth - 1);
                    }
                  }}
                  className="px-3 py-1 border rounded text-sm hover:bg-slate-100"
                >
                  前月
                </button>
                <button
                  onClick={() => {
                    if (currentMonth === 12) {
                      setCurrentYear(currentYear + 1);
                      setCurrentMonth(1);
                    } else {
                      setCurrentMonth(currentMonth + 1);
                    }
                  }}
                  className="px-3 py-1 border rounded text-sm hover:bg-slate-100"
                >
                  翌月
                </button>
              </div>
            </div>

            {/* 曜日のヘッダー */}
            <div className="grid grid-cols-7 gap-1.5 text-center font-medium text-xs text-slate-400 mb-2">
              <span className="text-red-500">日</span>
              <span>月</span>
              <span>火</span>
              <span>水</span>
              <span>木</span>
              <span>金</span>
              <span className="text-blue-500">土</span>
            </div>

            {/* 日付グリッド (正方形セル) */}
            <div className="grid grid-cols-7 gap-1.5">
              {calendarDays.map((dateStr, index) => {
                if (!dateStr) {
                  return <div key={index} className="aspect-square bg-transparent" />;
                }
                const dayNumber = parseInt(dateStr.split('-')[2], 10);
                const hasMemo = Boolean(entries[dateStr]);

                return (
                  <button
                    key={dateStr}
                    onClick={() => handleDateClick(dateStr)}
                    className={`aspect-square border rounded-lg flex flex-col justify-between p-2 transition-all relative ${
                      hasMemo
                        ? 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100 text-indigo-900 font-bold'
                        : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="text-xs">{dayNumber}</span>
                    {hasMemo && (
                      <span className="self-center w-1.5 h-1.5 bg-indigo-600 rounded-full mb-1"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* 過去のメモ確認用モーダル */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-lg">
            <h3 className="text-base font-bold text-slate-700 mb-3">
              📅 {selectedDate} の記録
            </h3>
            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100 whitespace-pre-wrap min-h-[80px]">
              {modalText}
            </p>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setSelectedDate(null)}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}