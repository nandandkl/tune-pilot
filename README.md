# 🎧 TunePilot – YouTube Music Recommender

TunePilot is a smart YouTube music recommendation system that suggests similar songs based on the currently playing YouTube video.  
It uses **semantic similarity (Sentence Transformers)** and works via a **Chrome Extension** connected to a hosted ML backend.


## 🚀 Features

- 🎵 Recommends similar YouTube songs
- 🧠 ML-powered semantic similarity (Sentence Transformers)
- 🔁 Auto-refreshes recommendations when video changes
- 🌐 Backend hosted on **Hugging Face Spaces**
- ⚡ FastAPI-based REST API
- 🧩 Chrome Extension frontend


> **Note:** TunePilot currently supports recommendations for **approximately 25,000 YouTube music videos**.
> This limitation exists because the model relies on a **publicly available, curated dataset**, not the entire YouTube catalog. If a currently playing video is **not present in the dataset**, recommendations may not appear.


## 🏗 Tech Stack

### Backend (Hosted)
- Python
- FastAPI
- Sentence Transformers
- PyTorch
- Pandas
- Hugging Face Datasets
- Docker

### Frontend
- JavaScript
- Chrome Extension APIs
- HTML / CSS


## 🧠 Recommendation Flow

1. User plays a YouTube video
2. Chrome Extension extracts the **YouTube video ID**
3. Video ID is sent to the backend API
4. Backend:
   - Finds the song in dataset
   - Computes similarity using embeddings
   - Returns top recommendations
5. Extension updates recommendations automatically


## 🌍 Backend (Hugging Face Space)

👉 **Backend code & deployment are hosted here:**

🔗 **https://huggingface.co/spaces/nandandkl/tp-recommender**

### API Endpoint

``` POST https://nandandkl-tp-recommender.hf.space/recommend ```


### Request Body
```JSON
{
  "youtube_id": "VIDEO_ID"
}
```

### Response
```JSON
[
  {
    "youtube_id": "xxxx",
    "title": "Song Name",
    "artist": "Artist",
    "genre": "Pop",
    "year": 2020,
    "views": 123456789
  }
]
```

## 🧩 Chrome Extension Setup
1. Open Chrome → `chrome://extensions`
2. Enable **Developer Mode**
3. Click **Load Unpacked**
4. Select the extension folder
5. Open YouTube and play a song


## 🙌 Credits
- Dataset: `akbargherbal/youtube-music-hits`
- Model: `all-MiniLM-L6-v2`
- Hosting: Hugging Face Spaces

## 💬 Feedback
- Found a bug? Have a feature request?
- Open an issue
- Or reach out via GitHub

## 🤝 Contributing
Contributions are welcome!<br>
Feel free to fork the repo, create branches, and submit pull requests.
