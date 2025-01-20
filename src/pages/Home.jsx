import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.css";

function Home() {
  const [surahList, setSurahList] = useState([]);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [ayahs, setAyahs] = useState([]);
  const [selectedTranslations, setSelectedTranslations] = useState([]);
  const [authors, setAuthors] = useState([
    { id: "maududi", name: "Abul Ala Maududi", identifier: "ur.maududi" },
    { id: "ahmedali", name: "Ahmed Ali", identifier: "en.ahmedali" },
    { id: "jalandhry", name: "Fateh M. Jalandhry", identifier: "ur.jalandhry" },
  ]);
  const [loading, setLoading] = useState(false);

  const mainURL = "https://api.alquran.cloud/v1";


  useEffect(() => {
    fetchSurahList();
  }, []);

  // جب بھی selectedSurah یا selectedTranslations اپڈیٹ ہوں، آیات دوبارہ لوڈ
  useEffect(() => {
    if (selectedSurah) {
      fetchSurahAyahs(selectedSurah.number);
    }
  }, [selectedSurah, selectedTranslations]);

  // جب بھی کوئی سورت بدلے تو سائیڈبار کو ٹاپ پر اسکرول کریں
  useEffect(() => {
    const asideElement = document.querySelector(".sidebar aside");
    if (asideElement) {
      asideElement.scrollTop = 0;
    }
  }, [selectedSurah]);

  const fetchSurahList = async () => {
    try {
      const response = await axios.get(`${mainURL}/surah`);
      if (response.data.data) {
        setSurahList(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching Surah list.", error);
    }
  };

  const fetchSurahAyahs = async (surahNumber) => {
    setLoading(true);
    try {
      // عربی متن
      const arabicResponse = await axios.get(
        `${mainURL}/surah/${surahNumber}/quran-uthmani`
      );
      let allAyahs = arabicResponse.data.data.ayahs.map((ayah) => ({
        numberInSurah: ayah.numberInSurah,
        arabic: ayah.text,
        translations: {},
      }));

      // جتنے مترجمین منتخب ہیں ان کے تراجم شامل کریں
      for (let translator of selectedTranslations) {
        const translationRes = await axios.get(
          `${mainURL}/surah/${surahNumber}/${translator}`
        );
        const translationAyahs = translationRes.data.data.ayahs;

        allAyahs = allAyahs.map((oneAyah, index) => ({
          ...oneAyah,
          translations: {
            ...oneAyah.translations,
            [translator]: translationAyahs[index].text,
          },
        }));
      }

      setAyahs(allAyahs);
    } catch (error) {
      console.error("Error fetching surah ayahs", error);
    }
    setLoading(false);
  };

  // جب سورت پر کلک کریں تو selectedSurah سیٹ کردیں
  const handleSurahClick = (surah) => {
    setSelectedSurah(surah);
  };

  // ✔ چیک باکس لاجک
  const handleCheckboxChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setSelectedTranslations((prev) => [...prev, value]);
    } else {
      setSelectedTranslations((prev) => prev.filter((t) => t !== value));
    }
  };

  return (
    <div className="home-container">
      {/* ---------- ہیڈر ایریا (مترجمین کے چیک باکس) ---------- */}
      <div className="small-header">
        {authors.map((author) => (
          <div className="header" key={author.id}>
            <input
              type="checkbox"
              id={author.id}
              value={author.identifier}
              checked={selectedTranslations.includes(author.identifier)}
              onChange={handleCheckboxChange}
            />
            <label htmlFor={author.id}>{author.name}</label>
          </div>
        ))}
      </div>

      {/* ---------- سائیڈبار ---------- */}
      <div className="sidebar">
        <aside>
          {/* ہمہ وقت تمام سورتیں دکھائیں */}
          <h4>All Surahs</h4>
          {surahList.map((s) => (
            <button
              key={s.number}
              onClick={() => handleSurahClick(s)}
              className="surah-btn"
              style={{
                backgroundColor:
                  selectedSurah && selectedSurah.number === s.number
                    ? "#d4f4fa" // منتخب شدہ سورت کا ہلکا سا مختلف رنگ
                    : undefined,
              }}
            >
              
              <p>{s.name}</p>
              <p> {s.number}</p>
            </button>
          ))}
        </aside>
      </div>

      {/* ---------- مین سیکشن ---------- */}
      <main className="main">
        {/* اگر ابھی تک کوئی سورت منتخب نہ ہوئی ہو تو گرڈ میں سارے بٹن بھی دکھا سکتے ہیں
            (آپ چاہیں تو اسے ہٹا بھی سکتے ہیں کیونکہ سائیڈبار میں اب ساری سورتیں موجود ہیں) */}
        {!selectedSurah && (
          <div className="grid-container">
            {surahList.map((surah) => (
              <button
                key={surah.number}
                onClick={() => handleSurahClick(surah)}
                className="surah-btn"
              >
                {/* <p>{surah.englishName}</p> */}
                <p>{surah.name}</p>
                {/* <p>SurahNumber: {surah.number}</p> */}
                <p>totalAyah: {surah.numberOfAyahs}</p>
              </button>
            ))}
          </div>
        )}

        {/* اگر کوئی سورت منتخب ہو تو اس کی آیات دکھائیں */}
        {selectedSurah && (
          <div className="ayahs-container">
            {/* سورت کا انگلش نام اور نمبر */}
            <h2>
              {selectedSurah.number}. {selectedSurah.englishName}
              
            </h2>

            {/* سورت کا عربی نام */}
            <h3 style={{ marginBottom: "20px"}}>Name: {selectedSurah.name}</h3>
            <h3 style={{ marginBottom: "20px" }}>TotalAyah: {selectedSurah.numberOfAyahs}</h3>
            

            {loading ? (
              <p>Loading...</p>
            ) : (
              ayahs.map((a, index) => (
                <div key={index} className="ayah-block">
                  <p className="arabic-text">{a.arabic}</p>
                  {Object.keys(a.translations).map((translatorKey) => (
                    <p className="translation-text" key={translatorKey}>
                      <strong>{translatorKey}: </strong>
                      {a.translations[translatorKey]}
                    </p>
                  ))}
                </div>
              ))
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
