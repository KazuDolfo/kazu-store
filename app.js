/**
 * Torneo de Openings - Kazuya Store
 * Motor con Proxy Streaming para saltar bloqueo 403 de AnimeThemes
 */
const App = (() => {
  const state = {
    currentOpenings: [],
    tournamentQueue: [],
    nextRoundQueue: [],
    tournamentHistory: [],
    currentRound: 1,
    currentMatchIndex: 1,
    totalMatchesInRound: 1,
    activeAnimeTitle: "",
    currentContenderA: null,
    currentContenderB: null,
  };

  const dom = {
    animeInput: document.getElementById("anime-input"),
    searchBtn: document.getElementById("search-btn"),
    searchStatus: document.getElementById("search-status"),
    animeResults: document.getElementById("anime-results"),
    openingsContainer: document.getElementById("openings-container"),
    selectedAnimeTitle: document.getElementById("selected-anime-title"),
    openingsCount: document.getElementById("openings-count"),
    openingsList: document.getElementById("openings-list"),
    startTournamentBtn: document.getElementById("start-tournament-btn"),
    setupSection: document.getElementById("setup-section"),
    tournamentSection: document.getElementById("tournament-section"),
    winnerSection: document.getElementById("winner-section"),
    cardA: document.getElementById("card-a"),
    cardB: document.getElementById("card-b"),
    roundTitle: document.getElementById("round-title"),
    matchTitle: document.getElementById("match-title"),
    nameA: document.getElementById("name-a"),
    nameB: document.getElementById("name-b"),
    videoA: document.getElementById("video-a"),
    videoB: document.getElementById("video-b"),
    winnerVideo: document.getElementById("winner-video"),
    voteABtn: document.getElementById("vote-a-btn"),
    voteBBtn: document.getElementById("vote-b-btn"),
    cancelTournamentBtn: document.getElementById("cancel-tournament-btn"),
    winnerName: document.getElementById("winner-name"),
    bracketContainer: document.getElementById("bracket-container"),
    newTournamentBtn: document.getElementById("new-tournament-btn"),
  };

  // Resuelve la URL para saltar el bloqueo 403 de AnimeThemes
  const getProxiedUrl = (url) => {
    if (!url) return "";
    // En Vercel usa la función /api/proxy automática
    if (window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1" && window.location.protocol.startsWith("http")) {
      return `/api/proxy?url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  const showStatus = (text, type = "info") => {
    dom.searchStatus.textContent = text;
    dom.searchStatus.className = `text-xs sm:text-sm font-cyber font-medium block anim-fade-up ${
      type === "error" ? "text-red-400" : type === "success" ? "text-cyan-400 glow-text-cyan" : "text-pink-400 glow-text-pink"
    }`;
  };

  const searchAnime = async () => {
    const query = dom.animeInput.value.trim();
    if (!query) return;

    showStatus("Buscando anime en la base de datos...", "info");
    dom.animeResults.innerHTML = "";
    dom.animeResults.classList.remove("hidden");

    let animeList = [];

    try {
      const url = `https://api.animethemes.moe/anime?q=${encodeURIComponent(query)}&include=images,animethemes.animethemeentries.videos,animethemes.song`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        animeList = data.anime || [];
      }
    } catch (e) {}

    if (animeList.length === 0) {
      showStatus("No se encontraron animes para esa búsqueda.", "error");
      return;
    }

    showStatus("✓ Selecciona tu anime:", "success");
    dom.animeResults.innerHTML = animeList
      .map((anime, idx) => {
        const cover = anime.images?.[0]?.link || "https://via.placeholder.com/150x200?text=No+Image";
        return `
          <div data-idx="${idx}" class="anime-card bg-gray-950/80 border border-pink-500/20 hover:border-cyan-400 rounded-xl p-2.5 cursor-pointer transition transform hover:-translate-y-1 flex flex-col items-center text-center shadow-lg group anim-fade-up">
            <img src="${cover}" class="w-full h-32 sm:h-36 object-cover rounded-lg mb-2 group-hover:opacity-90 border border-gray-800" alt="${anime.name}" />
            <h4 class="text-xs font-bold text-gray-200 line-clamp-2">${anime.name}</h4>
            <span class="text-[9px] sm:text-[10px] font-cyber text-pink-400 mt-1 font-semibold">${anime.year || "ANIME"}</span>
          </div>
        `;
      })
      .join("");

    dom.animeResults.querySelectorAll(".anime-card").forEach((card) => {
      card.addEventListener("click", () => loadThemes(animeList[card.dataset.idx]));
    });
  };

  const loadThemes = (anime) => {
    state.activeAnimeTitle = anime.name;
    dom.animeResults.classList.add("hidden");

    const themes = anime.animethemes || [];
    const openings = themes.filter(t => t.type === "OP");

    if (openings.length === 0) {
      showStatus(`No se encontraron Openings registrados para "${anime.name}".`, "error");
      return;
    }

    const ops = [];
    openings.forEach((op, idx) => {
      const songTitle = op.song?.title ? ` - ${op.song.title}` : ` Opening ${idx + 1}`;
      const artist = op.song?.artists?.length ? ` (${op.song.artists[0].name})` : "";
      const video = op.animethemeentries?.[0]?.videos?.[0]?.link;

      if (video) {
        ops.push({
          id: op.id || idx + 1,
          name: `OP ${op.sequence || idx + 1}${songTitle}${artist}`,
          videoUrl: video
        });
      }
    });

    if (ops.length === 0) {
      showStatus("Los openings encontrados no tienen enlaces de video activos.", "error");
      return;
    }

    state.currentOpenings = ops;
    showStatus("✓ Openings listos para la batalla", "success");
    renderOpenings();
  };

  const renderOpenings = () => {
    dom.selectedAnimeTitle.textContent = state.activeAnimeTitle;
    dom.openingsCount.textContent = `${state.currentOpenings.length} openings listos`;
    dom.openingsList.innerHTML = "";

    state.currentOpenings.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = "flex items-center justify-between gap-2.5 bg-gray-950/80 border border-pink-500/20 hover:border-pink-500/50 px-3.5 py-2.5 rounded-xl transition shadow-md anim-fade-up";
      li.innerHTML = `
        <div class="flex items-center gap-2.5 flex-1 min-w-0">
          <span class="text-[10px] sm:text-xs font-cyber font-bold px-2 py-0.5 bg-pink-900/60 border border-pink-500/40 text-pink-300 rounded shrink-0">OP ${index + 1}</span>
          <input type="text" value="${item.name.replace(/"/g, "&quot;")}" class="bg-transparent border-b border-transparent hover:border-gray-600 focus:border-cyan-400 focus:outline-none text-xs sm:text-sm text-gray-200 w-full font-medium" />
        </div>
        <button class="delete-btn text-gray-500 hover:text-red-400 px-2 py-1 transition font-bold text-xs" title="Eliminar">✕</button>
      `;

      li.querySelector("input").addEventListener("change", (e) => {
        state.currentOpenings[index].name = e.target.value;
      });

      li.querySelector(".delete-btn").addEventListener("click", () => {
        state.currentOpenings.splice(index, 1);
        renderOpenings();
      });

      dom.openingsList.appendChild(li);
    });

    dom.openingsContainer.classList.remove("hidden");
  };

  const startTournament = () => {
    if (state.currentOpenings.length < 2) {
      alert("Se necesitan al menos 2 openings para iniciar el torneo.");
      return;
    }

    state.tournamentQueue = [...state.currentOpenings].sort(() => Math.random() - 0.5);
    state.nextRoundQueue = [];
    state.tournamentHistory = [];
    state.currentRound = 1;
    state.currentMatchIndex = 1;
    state.totalMatchesInRound = Math.ceil(state.tournamentQueue.length / 2);

    dom.setupSection.classList.add("hidden");
    dom.tournamentSection.classList.remove("hidden");
    nextMatch();
  };

  const setVideo = (videoEl, url) => {
    videoEl.src = getProxiedUrl(url);
    videoEl.load();
  };

  const stopVideos = () => {
    [dom.videoA, dom.videoB, dom.winnerVideo].forEach(v => {
      v.pause();
      v.removeAttribute("src");
      v.load();
    });
  };

  const nextMatch = () => {
    if (state.tournamentQueue.length === 0) {
      if (state.nextRoundQueue.length === 1) {
        showWinner(state.nextRoundQueue[0]);
        return;
      }
      state.tournamentQueue = [...state.nextRoundQueue];
      state.nextRoundQueue = [];
      state.currentRound++;
      state.currentMatchIndex = 1;
      state.totalMatchesInRound = Math.ceil(state.tournamentQueue.length / 2);
    }

    if (state.tournamentQueue.length === 1) {
      const passed = state.tournamentQueue.shift();
      state.nextRoundQueue.push(passed);
      state.tournamentHistory.push({ round: state.currentRound, type: "pass", winner: passed });
      nextMatch();
      return;
    }

    state.currentContenderA = state.tournamentQueue.shift();
    state.currentContenderB = state.tournamentQueue.shift();

    dom.roundTitle.textContent = `ROUND ${state.currentRound}`;
    dom.matchTitle.textContent = `DUELO ${state.currentMatchIndex} / ${state.totalMatchesInRound}`;
    state.currentMatchIndex++;

    dom.nameA.textContent = state.currentContenderA.name;
    setVideo(dom.videoA, state.currentContenderA.videoUrl);

    dom.nameB.textContent = state.currentContenderB.name;
    setVideo(dom.videoB, state.currentContenderB.videoUrl);

    [dom.cardA, dom.cardB].forEach(card => {
      card.style.animation = 'none';
      card.offsetHeight;
      card.style.animation = '';
    });
  };

  const handleVote = (winnerContender) => {
    state.tournamentHistory.push({
      round: state.currentRound,
      type: "match",
      a: state.currentContenderA,
      b: state.currentContenderB,
      winner: winnerContender,
    });
    state.nextRoundQueue.push(winnerContender);
    stopVideos();
    nextMatch();
  };

  const renderBracket = (finalWinner) => {
    dom.bracketContainer.innerHTML = "";
    const rounds = {};

    state.tournamentHistory.forEach((item) => {
      if (!rounds[item.round]) rounds[item.round] = [];
      rounds[item.round].push(item);
    });

    const totalRounds = Object.keys(rounds).length;

    Object.keys(rounds).forEach((r) => {
      const isFinal = parseInt(r) === totalRounds;
      const col = document.createElement("div");
      col.className = "bracket-round anim-fade-up";
      
      const headerTitle = isFinal ? "🏆 GRAN FINAL" : `RONDA ${r}`;
      col.innerHTML = `<div class="font-cyber font-black text-center text-pink-400 pb-2.5 text-xs tracking-widest glow-text-pink">${headerTitle}</div>`;

      rounds[r].forEach((m) => {
        const matchWrapper = document.createElement("div");
        matchWrapper.className = "bracket-match";

        const node = document.createElement("div");
        node.className = "bracket-node text-xs space-y-1.5";

        if (m.type === "pass") {
          node.innerHTML = `
            <div class="text-[9px] font-cyber text-gray-500 uppercase font-semibold">PASE DIRECTO</div>
            <div class="font-bold text-cyan-300 truncate flex items-center justify-between">
              <span class="truncate">${m.winner.name}</span>
              <span class="ml-1 text-[9px] font-cyber bg-cyan-950 border border-cyan-500/40 text-cyan-300 px-1.5 py-0.5 rounded">AVANZA</span>
            </div>
          `;
        } else {
          const isAWinner = m.winner.id === m.a.id;
          node.innerHTML = `
            <div class="flex justify-between items-center py-1 px-2 rounded ${isAWinner ? 'bg-pink-950/70 border border-pink-500/50 text-pink-300 font-bold glow-box-pink' : 'text-gray-500 line-through opacity-50'}">
              <span class="truncate pr-1">${m.a.name}</span>
              <span class="font-cyber text-[10px]">${isAWinner ? 'WIN' : 'KO'}</span>
            </div>
            <div class="flex justify-between items-center py-1 px-2 rounded ${!isAWinner ? 'bg-cyan-950/70 border border-cyan-500/50 text-cyan-300 font-bold glow-box-cyan' : 'text-gray-500 line-through opacity-50'}">
              <span class="truncate pr-1">${m.b.name}</span>
              <span class="font-cyber text-[10px]">${!isAWinner ? 'WIN' : 'KO'}</span>
            </div>
          `;
        }

        matchWrapper.appendChild(node);
        col.appendChild(matchWrapper);
      });

      dom.bracketContainer.appendChild(col);
    });

    const champCol = document.createElement("div");
    champCol.className = "bracket-round flex flex-col justify-center items-center anim-winner-pop";
    champCol.innerHTML = `
      <div class="font-cyber font-black text-center text-yellow-400 pb-2.5 text-xs tracking-widest glow-text-pink">👑 CAMPEÓN</div>
      <div class="bracket-node border-2 border-yellow-400 bg-yellow-950/50 text-xs p-3.5 text-center glow-box-gold w-full">
        <div class="font-black text-yellow-300 truncate text-xs sm:text-sm">${finalWinner.name}</div>
        <span class="text-[9px] sm:text-[10px] font-cyber text-yellow-400 font-black uppercase tracking-wider">#1 CHAMPION</span>
      </div>
    `;
    dom.bracketContainer.appendChild(champCol);
  };

  const showWinner = (winner) => {
    dom.tournamentSection.classList.add("hidden");
    dom.winnerSection.classList.remove("hidden");
    dom.winnerName.textContent = winner.name;
    setVideo(dom.winnerVideo, winner.videoUrl);
    renderBracket(winner);
  };

  const init = () => {
    dom.searchBtn.addEventListener("click", searchAnime);
    dom.animeInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") searchAnime();
    });

    dom.startTournamentBtn.addEventListener("click", startTournament);
    dom.voteABtn.addEventListener("click", () => handleVote(state.currentContenderA));
    dom.voteBBtn.addEventListener("click", () => handleVote(state.currentContenderB));

    dom.cancelTournamentBtn.addEventListener("click", () => {
      stopVideos();
      dom.tournamentSection.classList.add("hidden");
      dom.setupSection.classList.remove("hidden");
    });

    dom.newTournamentBtn.addEventListener("click", () => {
      stopVideos();
      dom.winnerSection.classList.add("hidden");
      dom.setupSection.classList.remove("hidden");
    });
  };

  return { init };
})();

document.addEventListener("DOMContentLoaded", App.init);
