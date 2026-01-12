let currentTabId = null;
let cachedRecommendations = [];

document.addEventListener("DOMContentLoaded", async () => {
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");

  loading.classList.remove("hidden");

  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTabId = tab.id;

    if (!tab.url?.includes("youtube.com/watch")) {
      loading.classList.add("hidden");
      error.classList.remove("hidden");
      return;
    }

    const videoId = new URL(tab.url).searchParams.get("v");
    if (!videoId) {
      loading.classList.add("hidden");
      error.classList.remove("hidden");
      return;
    }

    // Fetch recommendations from FastAPI
    cachedRecommendations = await getRecommendationsFromHF(videoId);

    await updateNowPlayingFromTab(tab.id);

    loading.classList.add("hidden");
  } catch (err) {
    console.error(err);
    loading.classList.add("hidden");
    error.classList.remove("hidden");
  }
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (
    tabId === currentTabId &&
    changeInfo.url &&
    changeInfo.url.includes("youtube.com/watch")
  ) {
    // Show loading indicator while fetching new recommendations
    const loading = document.getElementById("loading");
    loading?.classList.remove("hidden");

    await updateNowPlayingFromTab(tabId);
    
    // Hide loading indicator after update
    loading?.classList.add("hidden");
  }
});

async function updateNowPlayingFromTab(tabId) {
  const tab = await chrome.tabs.get(tabId);
  if (!tab.url) return;

  const videoId = new URL(tab.url).searchParams.get("v");
  if (!videoId) return;

  const meta = await fetchVideoMetadata(videoId);

  const currentVideo = {
    id: videoId,
    title: meta.title, 
    thumbnail: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`
  };

  // Fetch new recommendations for the current video
  cachedRecommendations = await getRecommendationsFromHF(videoId);

  renderUI(currentVideo, cachedRecommendations);
}

function renderUI(currentVideo, recommendations) {
  const content = document.getElementById("content");

  content.innerHTML = `
    <div class="content-section">
      <h2 class="section-title">Now Playing</h2>
      <div class="now-playing">
        <img src="${currentVideo.thumbnail}" class="now-playing-thumbnail">
        <div class="now-playing-info">
          <div class="now-playing-title">${currentVideo.title}</div>
        </div>
      </div>
    </div>

    <div class="content-section">
      <h2 class="section-title">Recommended Songs</h2>
      <div class="recommendations-container" id="recommendations"></div>
    </div>
  `;

  renderRecommendations(recommendations);
}

async function getRecommendationsFromHF(youtubeId) {
  const url = "https://nandandkl-tp-recommender.hf.space/recommend";

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ youtubeId }) // Match FastAPI body
    });

    const data = await res.json();
    console.log("HF Response Raw:", data);
    return data || [];
  } catch (err) {
    console.error("Error fetching recommendations:", err);
    return [];
  }
}

async function fetchVideoMetadata(videoId) {
  try {
    const res = await fetch(
      `https://noembed.com/embed?url=https://www.youtube.com/watch?v=${videoId}`
    );
    const data = await res.json();

    return {
      title: data.title?.replace(/\s*\([^)]*\)/g, "").trim() || "Unknown",
      channel: data.author_name || "Unknown"
    };
  } catch {
    return { title: "Unknown", channel: "Unknown" };
  }
}

function renderRecommendations(recs) {
  const container = document.getElementById("recommendations");
  container.innerHTML = "";

  if (!recs.length) {
    container.innerHTML = "<div class='no-recs'>No recommendations found.</div>";
    return;
  }

  recs.forEach((rec) => {
    const item = document.createElement("div");
    item.className = "recommendation-item";

    item.innerHTML = `
      <img src="https://i.ytimg.com/vi/${rec.youtube_id}/mqdefault.jpg" class="rec-thumbnail">
      <div class="rec-info">
        <div class="rec-title">${rec.title}</div>
        <div class="rec-artist">${rec.artist}</div>
      </div>
    `;

    item.addEventListener("click", async () => {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      chrome.tabs.update(tab.id, {
        url: `https://www.youtube.com/watch?v=${rec.youtube_id}`
      });
    });

    container.appendChild(item);
  });
}
