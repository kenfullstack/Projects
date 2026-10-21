// Declaring variables for countries infos
const tutorial = document.querySelector('.tutorial');
const flagContainer = document.getElementById('flag-container');
const countryDisplay = document.querySelector('.country-name h4');
const flagPic = document.getElementById('flag-pic');
const capital = document.getElementById('capital');
const region = document.getElementById('region');
const population = document.getElementById('population');
const currencies = document.getElementById('currencies');
const languages = document.getElementById('languages');
const area = document.getElementById('area');
const timezones = document.getElementById('timezones');
const callingCodes = document.getElementById('calling-codes');
const leftArrow = document.querySelector('.left-arrow');
const rightArrow = document.querySelector('.right-arrow');

// Create Tutorial Card
tutorial.addEventListener('click', () => {
  const existingTutorial = document.querySelector('.instructions');

  if (existingTutorial) {
    existingTutorial.remove();
    return;
  }

  const tutorialDiv = document.createElement('div');
  tutorialDiv.classList.add('instructions');
  tutorialDiv.style.backgroundColor = '#2d2b22';
  tutorialDiv.style.color = '#e2d6bc';
  tutorialDiv.style.padding = '2rem';
  tutorialDiv.style.borderRadius = '15px';
  tutorialDiv.style.width = '30rem';
  tutorialDiv.style.height = '35rem';
  tutorialDiv.style.zIndex = '20';
  tutorialDiv.style.position = 'fixed';
  tutorialDiv.style.top = '6rem';
  tutorialDiv.style.left = '1rem';
  tutorialDiv.innerHTML = `<h3>How to use:</h3>
        <p>1. On the image slider at the top center, click the right arrow or hover mouse over flag then scroll down to see the next country infos.</p>
        <p>2. On the image slider at the top center, click the left arrow or hover mouse over flag then scroll up to see the next country infos.</p>
        <p>3. Left-click the message bar once then type your message then press enter or click send button to send a message to the chat bot then kindly wait for response.</p>`;

  // Create Close Button For Tutorial Card
  const closeBtn = document.createElement('div');
  closeBtn.classList.add('close-btn');
  closeBtn.style.backgroundColor = '#d0610e';
  closeBtn.style.height = '2rem';
  closeBtn.style.width = '2rem';
  closeBtn.style.fontSize = '1.5rem';
  closeBtn.style.borderRadius = '5px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.display = 'flex';
  closeBtn.style.justifyContent = 'center';
  closeBtn.style.alignItems = 'center';
  closeBtn.style.position = 'fixed';
  closeBtn.textContent = 'X';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '1rem';
  closeBtn.style.right = '1rem';

  tutorialDiv.appendChild(closeBtn);
  document.body.appendChild(tutorialDiv);

  closeBtn.addEventListener('click', () => {
    tutorialDiv.remove();
  });

  closeBtn.addEventListener('mouseenter', () => {
    closeBtn.style.transform = 'scale(1.1)';
  });

  closeBtn.addEventListener('mouseleave', () => {
    closeBtn.style.transform = 'scale(1)';
  });
});

// Accessing Rest Country API
async function loadCountries(apiKey) {
  try {
    const baseUrl = 'https://api.restcountries.com/countries/v5';

    const allCountries = [];
    const limit = 100;
    let offset = 0;
    let hasMore = true;

    // Fetch every page
    while (hasMore) {
      const url =
        `${baseUrl}?limit=${limit}&offset=${offset}` +
        `&response_fields=` +
        `names.common,names.official,codes.alpha_2,flag,capitals,region,,` +
        `population,area,currencies,languages,timezones,calling_codes`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${apiKey}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        return;
      }

      const result = await response.json();

      const countries = result?.data?.objects || [];
      const meta = result?.data?.meta;

      console.log(
        `Loaded ${countries.length} countries starting at offset ${offset}`
      );

      allCountries.push(...countries);

      hasMore = meta?.more === true;
      offset += limit;
    }

    console.log(`Total countries loaded: ${allCountries.length}`);

    if (allCountries.length === 0) {
      console.error("No countries were returned.");
      return;
    }

    // Convert API data into the format my app uses
    const countriesData = allCountries.map(country => {
      const countryName =
        country.names?.common ||
        country.name?.common ||
        country.name ||
        'Unknown';

      const isoCode =
        country.codes?.alpha_2 ||
        country.iso2 ||
        country.cca2 ||
        country.code ||
        country.iso_3166_1_alpha2 ||
        '';

      let flagUrl =
        country.flag?.url_svg ||
        country.flag?.url_png ||
        country.flag?.svg ||
        country.flag?.png ||
        '';

      if ((!flagUrl || !flagUrl.startsWith('http')) && isoCode) {
        flagUrl = `https://flagcdn.com/w320/${isoCode.toLowerCase()}.png`;
      }

      if (!flagUrl || !flagUrl.startsWith('http')) {
        flagUrl =
          `https://images.placeholders.dev/?width=320&height=210` +
          `&text=${encodeURIComponent(countryName)}` +
          `&bgColor=%232d2b22&textColor=%23e2d6bc`;
      }

      let capitalName = 'N/A';

      if (
        Array.isArray(country.capitals) &&
        country.capitals.length > 0
      ) {
        const cap = country.capitals[0];

        capitalName =
          typeof cap === 'object'
            ? cap.name || cap.common || 'N/A'
            : cap;
      } else if (typeof country.capital === 'string') {
        capitalName = country.capital;
      }

      let phoneCode = 'N/A';

      if (
        Array.isArray(country.calling_codes) &&
        country.calling_codes.length > 0
      ) {
        const code = country.calling_codes[0];

        phoneCode =
          typeof code === 'object'
            ? `${code.root || ''}${code.suffixes?.[0] || ''}`
            : String(code);
      }

      return {
        name: countryName,
        flag: flagUrl,
        capital: capitalName,
        region: country.region || 'N/A',
        population: typeof country.population === 'number' ? country.population : 0,
        currencies: country.currencies || {},
        languages: country.languages || {},
        area: typeof country.area === 'number' ? country.area : (country.area?.kilometers || 0),
        timezones: country.timezones || [],
        callingCode: phoneCode
      };
    });

    countriesData.sort((a, b) =>
      a.name.localeCompare(b.name)
    );

    let currentIndex = 0;

    function displayCountry() {
      const country = countriesData[currentIndex];

      flagPic.src = country.flag;
      flagPic.alt = `Flag of ${country.name}`;

      countryDisplay.textContent = country.name;

      capital.textContent =
        `Capital: ${country.capital}`;

      region.textContent =
        `Region: ${country.region}`;

      population.textContent =
        `Population: ${country.population
          ? country.population.toLocaleString()
          : 'N/A'
        }`;

      area.textContent =
        `Area: ${country.area
          ? country.area.toLocaleString()
          : 'N/A'
        } km²`;

      currencies.textContent =
        `Currencies: ${Object.values(country.currencies)
          .map(c =>
            typeof c === 'object'
              ? c.name
              : c
          )
          .filter(Boolean)
          .join(', ') || 'N/A'
        }`;

      languages.textContent =
        `Languages: ${Object.values(country.languages)
          .map(lang =>
            typeof lang === 'object'
              ? lang.name
              : lang
          )
          .filter(Boolean)
          .join(', ') || 'N/A'
        }`;

      timezones.textContent =
        `Timezones: ${Array.isArray(country.timezones)
          ? country.timezones.join(', ')
          : country.timezones || 'N/A'
        }`;

      callingCodes.textContent =
        `Calling Code: ${country.callingCode}`;
    }

    function updateArrows() {
      leftArrow.style.opacity =
        currentIndex === 0 ? "0.5" : "1";

      rightArrow.style.opacity =
        currentIndex === countriesData.length - 1
          ? "0.5"
          : "1";
    }

    displayCountry();
    updateArrows();

    leftArrow.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        displayCountry();
        updateArrows();
      }
    });

    rightArrow.addEventListener('click', () => {
      if (currentIndex < countriesData.length - 1) {
        currentIndex++;
        displayCountry();
        updateArrows();
      }
    });

    flagContainer.addEventListener('wheel', event => {
      event.preventDefault();

      if (event.deltaY > 0) {
        if (currentIndex < countriesData.length - 1) {
          currentIndex++;
        }
      } else {
        if (currentIndex > 0) {
          currentIndex--;
        }
      }

      displayCountry();
      updateArrows();
    });

  } catch (error) {
    console.error("Error fetching countries:", error);
  }
}

// Declaring Variables for Chat Bot
const chatArea = document.querySelector(".chat-area");
const messageBar = document.querySelector(".message-bar");
const sendBtn = document.querySelector(".send-btn");

let apiKey;
let API_URL;

async function startApp() {
  try {
    const configResponse = await fetch('config.json');
    if (!configResponse.ok) throw new Error('config.json could not be loaded.');

    const config = await configResponse.json();

    API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${config.GEMINI_API_KEY}`;

    await loadCountries(config.REST_COUNTRIES_API_KEY);

    initApp();

  } catch (err) {
    console.error("Could not load config or startup failed:", err);
  }
}

startApp();

function initApp() {
  addMessage(`Is there anything you would like to know further?`, "bot");

  sendBtn.addEventListener("click", sendMessage);
  messageBar.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      sendMessage();
    }
  });
}

function addMessage(message, user) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message");
  messageDiv.classList.add(user);
  messageDiv.textContent = message;
  chatArea.appendChild(messageDiv);
  chatArea.scrollTop = chatArea.scrollHeight;
}

async function sendMessage() {
  const message = messageBar.value;
  if (message.trim() === "" || !API_URL) return;

  addMessage(message, "user");
  messageBar.value = "";

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `Answer concisely in 2-3 sentences. Do not use markdown or asterisks like **. User says: ${message}` }] }]
      })
    });

    const data = await response.json();
    const botMessage = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't generate a response.";

    addMessage(botMessage, "bot");

  } catch (error) {
    console.error("Gemini Error:", error);
    addMessage("Error connecting to Gemini API", "bot");
  }
}