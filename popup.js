const chatGptApiKey = "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";
const bingSearchApiKey = "85587247401c4937a2ec73bed9ef8e25";

async function search(query) {
  const response = await fetch(
    `https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(
      query
    )}&count=3`,
    {
      headers: {
        "Ocp-Apim-Subscription-Key": bingSearchApiKey,
      },
    }
  );

  const data = await response.json();
  console.log("Search API response:", data);
  if (data && data.webPages && data.webPages.value) {
    const results = data.webPages.value
      .map((result) => result.snippet)
      .join("\n");
    return results;
  }
  return "PROBLEMES";
}

async function chatGpt(prompt) {
  const response = await fetch(
    "https://api.openai.com/v1/engines/text-davinci-003/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${chatGptApiKey}`,
      },

      body: JSON.stringify({
        prompt: prompt,
        max_tokens: 500,
        n: 1,
        stop: null,
        temperature: 1,
      }),
    }
  );

  const data = await response.json();
  console.log("ChatGPT API response:", data);
  if (data && data.choices && data.choices.length > 0) {
    return data.choices[0].text.trim();
  }
  return "Il y a un soucis";
}

document.getElementById("sendMessage").onclick = async function () {
  const inputMessage = document.getElementById("inputMessage").value;
  const responseElement = document.getElementById("response");

  responseElement.textContent = "Recherche d'informations...";
  const searchResults = await search(inputMessage);

  responseElement.textContent = "En attente de réponse de ChatGPT...";
  const prompt = `Question: ${inputMessage}\nRésultats de recherche:\n${searchResults}\nRéponse: `;
  const chatGptResponse = await chatGpt(prompt);

  responseElement.textContent = chatGptResponse;
};
