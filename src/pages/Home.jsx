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

  useEffect(() => {
    if (selectedSurah) {
      fetchSurahAyahs(selectedSurah.number);
    }
  }, [selectedSurah, selectedTranslations]);

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
      const arabicResponse = await axios.get(
        `${mainURL}/surah/${surahNumber}/quran-uthmani`
      );
      let allAyahs = arabicResponse.data.data.ayahs.map((ayah) => ({
        numberInSurah: ayah.numberInSurah,
        arabic: ayah.text,
        translations: {},
      }));

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

  const handleSurahClick = (surah) => {
    setSelectedSurah(surah);
  };

  const handleCheckboxChange = (event) => {
    const { checked, value } = event.target;
    if (checked) {
      setSelectedTranslations((prev) => [...prev, value]);
    } else {
      setSelectedTranslations((prev) => prev.filter((t) => t !== value));
    }
  };

  return (
    <div className="home-containers">
      <div className="translator-containers">
        {authors.map((author) => (
          <div className="translators" key={author.id}>
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

      <div className="sidebars">
        <aside>
          {surahList.map((s) => (
            <button
              key={s.number}
              onClick={() => handleSurahClick(s)}
              className="surah-btns"
              style={{
                backgroundColor:
                  selectedSurah && selectedSurah.number === s.number
                    ? "#d4f4fa"
                    : undefined,
              }}
            >
              <p>{s.name}</p>
              <p> {s.number}</p>
            </button>
          ))}
        </aside>
      </div>

      <main className="mains">
        {!selectedSurah && (
          <div className="grid-containers">
            {surahList.map((surah) => (
              <button
                key={surah.number}
                onClick={() => handleSurahClick(surah)}
                className="surah-btns"
              >
                <p>{surah.name}</p>
                <p>totalAyah: {surah.numberOfAyahs}</p>
              </button>
            ))}
          </div>
        )}

        {selectedSurah && (
          <div className="ayahs-containers">
            <h2>
              {selectedSurah.number}. {selectedSurah.englishName}
            </h2>
            <h3 style={{ marginBottom: "20px" }}>Name: {selectedSurah.name}</h3>
            <h3 style={{ marginBottom: "20px" }}>
              TotalAyah: {selectedSurah.numberOfAyahs}
            </h3>

            {loading ? (
              <p>Loading...</p>
            ) : (
              ayahs.map((a, index) => (
                <div key={index} className="ayah-blocks">
                  <p className="arabic-texts">{a.arabic}</p>
                  {Object.keys(a.translations).map((translatorKey) => (
                    <p className="translation-texts" key={translatorKey}>
                      <strong>ترجمہ: </strong>
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
