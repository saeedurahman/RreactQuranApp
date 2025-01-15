import React from 'react'
import { useState,useEffect } from 'react'
import axios from 'axios'
import './SearchAyah.css'
function SearchAyah() {
  const [ayahs, setAyahs] = useState([]);
  const [surahNumber, setSurahNumber] = useState(1);
  const [ayahStart, setAyahStart] = useState(1);
  const [ayahEnd, setAyahEnd] = useState(1);
  const [error, setError] = useState(null);
  const [surahList, setSurahList] = useState([]);
  const [translationList, setTranslationList] = useState([]);
  const [selectedTranslation, setSelectedTranslation] = useState("");
  const [loading, setLoading] = useState(false);

  const mainURL = "https://api.alquran.cloud/v1";

  // Fetch Surah list
  const fetchSurahList = async () => {
      try {
          const response = await axios.get(`${mainURL}/surah`);
          setSurahList(response.data.data);
      } catch (err) {
          setError("Error fetching Surah list.");
          console.log(err)
      }
  };

  // Fetch Translations list
  const fetchEditions = async () => {
      try {
          const response = await axios.get(`${mainURL}/edition`);
          const allEditions = response.data.data;

          setTranslationList(allEditions.filter((edition) => edition.language === "ur" && edition.format === "text" && edition.type === "translation"));
      } catch (err) {
          setError("Error fetching editions.");
      }
  };

  // Fetch Ayahs with selected Translation
  const fetchAyahs = async () => {
      if (ayahStart > 0 && ayahEnd >= ayahStart) {
          setLoading(true);
          try {
              const fetchedAyahs = [];
              for (let i = ayahStart; i <= ayahEnd; i++) {
                  const arabicResponse = await axios.get(`${mainURL}/ayah/${surahNumber}:${i}/quran-uthmani`);
                  const translationResponse = await axios.get(`${mainURL}/ayah/${surahNumber}:${i}/${selectedTranslation}`);

                  fetchedAyahs.push({
                      arabic: arabicResponse.data.data.text,
                      translation: translationResponse.data.data.text,
                      translatorName: translationResponse.data.data.edition.name,
                      ayahNumber: i,
                  });
              }
              setAyahs(fetchedAyahs);
              setError(null);
          } catch (err) {
              setError("Error fetching Ayahs.");
          }
          setLoading(false);
      } else {
          setError("Please enter a valid Ayah number range.");
      }
  };

  useEffect(() => {
      fetchSurahList();
      fetchEditions();
  }, []);

  return (
      <div className="ayah-container">
          

          <div className="input-group">
              
              <select value={surahNumber} onChange={(e) => setSurahNumber(e.target.value)} className="surah-select">
              <option value="">Select Surah Name</option>
                  {surahList.map((surah) => (
                      <option key={surah.number} value={surah.number}>
                          {surah.englishName}
                      </option>
                  ))}
              </select>
                  
              <select value={selectedTranslation} onChange={(e) => setSelectedTranslation(e.target.value)} className="surah-select">
                  <option value="">Select Translation</option>
                  {translationList.map((translation) => (
                      <option key={translation.identifier} value={translation.identifier}>
                          {translation.name}
                      </option>
                  ))}
              </select>
              <div className="lableone">
              <label>Starting Ayah</label>
              <input
                  type="number"
                  value={ayahStart}
                  onChange={(e) => setAyahStart(e.target.value)}
                  placeholder="Starting Ayah"
                  className="ayah-input"
              />
              </div>
              <div className="lableone">
              <label>Ending Ayah</label>
              <input
                  type="number"
                  value={ayahEnd}
                  onChange={(e) => setAyahEnd(e.target.value)}
                  placeholder="Ending Ayah"
                  className="ayah-input"
              />
              </div>
          </div>
          <div className="button">
              <button onClick={fetchAyahs} className="fetch-button">
                  Fetch Ayahs
              </button>
              </div>

          {error && <p className="error">{error}</p>}
          {loading && <p className="loading">Loading...</p>}

          {ayahs.length > 0 && !loading && (
              <div className="ayah-list " >

                  <h3>Surah: {surahList.find((surah) => surah.number == surahNumber)?.englishName}</h3>

                  <h3>Ayah Range: {ayahStart} - {ayahEnd}</h3>
                  {ayahs.map((ayah, index) => (
                      <div key={index} className="ayah-card ">
                          <p>{ayah.arabic}</p>
                          <p lang="ur">ترجمہ: {ayah.translation}</p>
                      <div className="LastTwoparagraph">
                          <p >مترجم: {ayah.translatorName}</p>
                          <p>آیت نمبر: {ayah.ayahNumber}</p>
                      </div>
                      </div>
                  ))}
              </div>
          )}
      </div>
  );
};


export default SearchAyah
