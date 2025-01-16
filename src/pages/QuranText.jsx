import React, { useState, useEffect } from "react";
import axios from "axios";
import "./QuranText.css";

function QuranText() {
  // جُز کی فہرست
  const juzList = Array.from({ length: 30 }, (_, i) => i + 1);

  // منتخب شدہ جُز
  const [selectedJuz, setSelectedJuz] = useState(null);

  // اس جُز کی آیات
  const [ayahs, setAyahs] = useState([]);

  // لوڈنگ اسٹیٹ
  const [loading, setLoading] = useState(false);

  // جب بھی selectedJuz تبدیل ہو تو متعلقہ آیات لوڈ کریں
  useEffect(() => {
    if (selectedJuz !== null) {
      fetchJuzAyahs(selectedJuz);
    }
  }, [selectedJuz]);

  // جُز کی آیات لانے کا فنکشن
  const fetchJuzAyahs = async (juzNumber) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.alquran.cloud/v1/juz/${juzNumber}/quran-uthmani`
      );
      // response.data.data کے اندر number, ayahs وغیرہ ہوتا ہے
      const dataObj = response.data.data; 
      if (dataObj && dataObj.ayahs) {
        setAyahs(dataObj.ayahs); // صرف آیات درکار ہیں
      }
    } catch (error) {
      console.error("Error fetching Juz data:", error);
    }
    setLoading(false);
  };

  // جُز بٹن پر کلک
  const handleJuzClick = (jNumber) => {
    setSelectedJuz(jNumber);
  };

  return (
    <div className="quran-container">
      {/* ---------- سائیڈبار ---------- */}
      <div className="sidebar">
        <h4>All Juz</h4>
        {juzList.map((j) => (
          <button
            key={j}
            onClick={() => handleJuzClick(j)}
            // اگر یہ جُز منتخب ہے تو کلاس میں "active" بھی شامل
            className={
              j === selectedJuz ? "juz-btn juz-selected" : "juz-btn"
            }
          >
            <p>Juz {j}</p>
          </button>
        ))}
      </div>

      {/* ---------- مین سیکشن ---------- */}
      <main className="main">
        
        {!selectedJuz && (
          <div className="mainButtonWrapper">
            <button className="mainButton">
              Select Juz to Read
            </button>
          </div>
      )}


        {/* اگر جُز منتخب ہے تو آیات دکھائیں */}
        {selectedJuz && (
          <div className="ayahs-container">
            <h2>Juz {selectedJuz}</h2>
            {loading ? (
              <p style={{color:'red'}}>Loading...</p>
            ) : (
              ayahs.map((ayah, index) => (
                
                <div key={ayah.number || index} className="ayah-block">
      
                  <p className="arabic-text">{ayah.text}</p>
                  <p className="AyahNumber">{ayah.number}</p>
                  {/* سورہ کا نام دکھانا چاہیں تو: */}
                  {ayah.surah && (
                    <p style={{ fontSize: "14px", color: "#666" }}>
                      {ayah.surah.name}
                    </p>
                  )}
                  <hr />
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default QuranText;
