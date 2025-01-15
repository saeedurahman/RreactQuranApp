import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TotalSurah.css";

function SurahList() {
  // پورے قرآن کے پروسیسڈ ڈیٹا کی اسٹیٹ
  const [surahsData, setSurahsData] = useState([]);
  const [loading, setLoading] = useState(false);

  // پہلی بار رینڈر کے بعد قرآن لانے کی کال
  useEffect(() => {
    fetchAllSurahs();
  }, []);

  // پورے قرآن کی API کال
  const fetchAllSurahs = async () => {
    setLoading(true);
    try {
      const response = await axios.get("https://api.alquran.cloud/v1/quran/quran-uthmani");
      // response.data.data.surahs میں ساری 114 سورتیں آجائیں گی (ایک بڑا آبجیکٹ)
      const allSurahs = response.data.data.surahs;

      // ہر سورت کی آیات میں سے پارہ (juz)، رکوع (ruku)، سجدہ (sajda) وغیرہ نکالیں
      const processed = allSurahs.map((surah) => {
        const ayahs = surah.ayahs || [];

        const juzSet = new Set();
        const rukuSet = new Set();
        let hasSajda = false;

        // آیات پر لوپ چلائیں اور مطلوبہ معلومات نکالیں
        ayahs.forEach((ayah) => {
          if (ayah.juz) {
            juzSet.add(ayah.juz);
          }
          if (ayah.ruku) {
            rukuSet.add(ayah.ruku);
          }
          if (ayah.sajda === true) {
            hasSajda = true;
          }
        });

        // پاروں کی کم سے کم اور زیادہ سے زیادہ ویلیو نکال کر ایک رینج مثلاً "1 - 3" بنائیں
        const juzArray = Array.from(juzSet).sort((a, b) => a - b);
        let juzRange = "";
        if (juzArray.length === 1) {
          juzRange = juzArray[0].toString();
        } else if (juzArray.length > 1) {
          juzRange = `${juzArray[0]} - ${juzArray[juzArray.length - 1]}`;
        } else {
          juzRange = "N/A";
        }

        // رکوع کی تعداد
        const rukuCount = rukuSet.size;

        // اب ایک آبجیکٹ بنا دیتے ہیں جس میں ہمارے مطلوبہ تمام ڈیٹا ہو
        return {
          surahNumber: surah.number,
          surahName: surah.name,               // عربی نام (مثلاً سُورَةُ البَقَرَةِ)
          revelationType: surah.revelationType, // Meccan یا Medinan
          numberOfAyahs: surah.numberOfAyahs,
          juzRange: juzRange,
          rukuCount: rukuCount,
          hasSajda: hasSajda,
        };
      });

      setSurahsData(processed);
    } catch (error) {
      console.error("Error fetching Quran data", error);
    }
    setLoading(false);
  };

  return (
    <div className="surah-list-container">
      <h1>All Surahs (1-114)</h1>
      {loading ? (
        <p>Loading Surah info...</p>
      ) : (
        <div className="grid-container">
          {surahsData.map((surah) => (
            <button className="surah-card" key={surah.surahNumber}>
              <h3>
                {surah.surahNumber}. {surah.surahName}
              </h3>
              <p>
                <strong>Type:</strong> {surah.revelationType}
              </p>
              <p>
                <strong>Total Ayahs:</strong> {surah.numberOfAyahs}
              </p>
              <p>
                <strong>Juz:</strong> {surah.juzRange}
              </p>
              <p>
                <strong>Rukus:</strong> {surah.rukuCount}
              </p>
              <p>
                <strong>Sajda:</strong> {surah.hasSajda ? "Yes" : "No"}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SurahList;
