import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TotalSurah.css";

function SurahList() {
  const [surahsData, setSurahsData] = useState([]);
  const [metaData, setMetaData] = useState(null); // meta API کے ڈیٹا کے لیے state
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllSurahs();
  }, []);

  const fetchAllSurahs = async () => {
    setLoading(true);
    try {
     
      const mainResponse = await axios.get("https://api.alquran.cloud/v1/quran/quran-uthmani");
      const mainSurahs = mainResponse.data.data.surahs;

      
      const metaResponse = await axios.get("https://api.alquran.cloud/v1/meta");
      setMetaData(metaResponse.data.data); 

      const metaSurahs = metaResponse.data.data.surahs.references;

    
      const combinedSurahs = mainSurahs.map((mainSurah) => {
        const metaSurah = metaSurahs.find((s) => s.number === mainSurah.number);

        // پراسیسنگ اور اضافی معلومات
        const ayahs = mainSurah.ayahs || [];
        const juzSet = new Set();
        const rukuSet = new Set();
        let hasSajda = false;

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

        const juzArray = Array.from(juzSet).sort((a, b) => a - b);
        const juzRange =
          juzArray.length === 1
            ? juzArray[0].toString()
            : `${juzArray[0]} - ${juzArray[juzArray.length - 1]}`;

        // مکمل ڈیٹا واپس کریں
        return {
          surahNumber: mainSurah.number,
          surahName: mainSurah.name,
          revelationType: mainSurah.revelationType,
          numberOfAyahs: metaSurah ? metaSurah.numberOfAyahs : "N/A",
          juzRange: juzRange,
          rukuCount: rukuSet.size,
          hasSajda: hasSajda,
        };
      });

      setSurahsData(combinedSurahs);
    } catch (error) {
      console.error("Error fetching Quran data", error);
    }
    setLoading(false);
  };

  return (
    <div className="surah-list-container">
      
      <div className="meta-data-container">
  {metaData ? (
    <div className="meta-data">
      <h2>Quran Meta Information</h2>
      <table>
        <thead>
          <tr>
            <th>Total Ayahs</th>
            <th>Total Juzs</th>
            <th>Total Manzils</th>
            <th>Total Rukus</th>
            <th>Total Sajdas</th>
            <th>Total Surahs</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{metaData.ayahs.count}</td>
            <td>{metaData.juzs.count}</td>
            <td>{metaData.manzils.count}</td>
            <td>{metaData.rukus.count}</td>
            <td>{metaData.sajdas.count}</td>
            <td>{metaData.surahs.count}</td>
          </tr>
        </tbody>
      </table>
    </div>
  ) : (
    <p>Loading meta information...</p>
  )}
</div>


      {/* سورہ کی معلومات */}
      <h1 className="one">All Surahs (1-114)</h1>
      {loading ? (
        <p>Loading Surah info...</p>
      ) : (
        <div className="grid-container">
          {surahsData.map((surah) => (
            <button className="surah-card" key={surah.surahNumber}>
              <h3>{surah.surahName}</h3>
              <p className="type-info">
                <strong>Surah Number:</strong>
                <span>{surah.surahNumber}</span>
              </p>
              <p className="type-info">
                <strong>Type: </strong>
                <span>{surah.revelationType}</span>
              </p>
              <p className="type-info">
                <strong>Total Ayahs: </strong>
                <span>{surah.numberOfAyahs}</span>
              </p>
              <p className="type-info">
                <strong>Juz: </strong>
                <span>{surah.juzRange}</span>
              </p>
              <p className="type-info">
                <strong>Rukus: </strong>
                <span>{surah.rukuCount}</span>
              </p>
              <p className="type-info">
                <strong>Sajda: </strong>
                <span>{surah.hasSajda ? "Yes" : "No"}</span>
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default SurahList;
