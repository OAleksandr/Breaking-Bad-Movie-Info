(() => 
{
    // The Breaking Bad API (breakingbadapi.com) has been shut down, so the data
    // it used to return is bundled in js/data.js (window.BREAKING_BAD_DATA).
    const { characters: allCharacters, deaths: allDeaths, quotes: allQuotes } = window.BREAKING_BAD_DATA;

    // Same as the old /api/quote?author=<name> endpoint.
    const getQuotesByAuthor = (name) => allQuotes.filter((q) => q.author === name);

    // Same as the old /api/death-count?name=<name> endpoint: total deaths where
    // the "responsible" field contains the name.
    const getDeathCount = (name) => [{
        name,
        deathCount: allDeaths
            .filter((d) => d.responsible.includes(name))
            .reduce((sum, d) => sum + d.number_of_deaths, 0)
    }];

    const FALLBACK_IMAGE = "img/breaking-bad-logo.png";

    const displayCharacters = (characters) => {
        //console.log(characters, "Characters")

        let dropdownList = document.querySelector("#character-select");
        let option;

        // Placeholder so the first character can be chosen too (a "change" event
        // never fires for the option that is already selected).
        option = document.createElement("option");
        option.text = "Choose a character...";
        option.value = "";
        option.disabled = true;
        option.selected = true;
        dropdownList.add(option);

        characters.map((char, i) => {
            option = document.createElement("option");
            option.text = char.name;
            option.value = i;
            dropdownList.add(option);
        })

        dropdownList.addEventListener("change", (e) => {
            e.preventDefault();

            let optionValue = e.target.value;

            let selectedCharacterData = characters[optionValue];

            let {appearance: seasonAppearance,
                better_call_saul_appearance: betterCallSoulAppearance, 
                birthday: birthDay, 
                category: movieName, 
                img: characterImage, 
                name: characterName, 
                nickname: characterNickname, 
                occupation: occuPation,
                portrayed: actor, 
                status: movieStatus } = selectedCharacterData;

            // [1, 2, 3] -> "Seasons 1, 2, 3"; [] -> "None"
            const formatSeasons = (seasons) => seasons.length === 0
                ? "None"
                : `Season${seasons.length > 1 ? "s" : ""} ${seasons.join(", ")}`;

            let displayCharInfo = document.querySelector(".display-char-info");

            displayCharInfo.innerHTML = `
                                        <div class="col-md-5 col-lg-4 image-info cssanimation fadeInLeft">
                                            <h2>${characterName}</h2>
                                            <img src="${characterImage}" alt="${characterName} Photo" class="img-thumbnail" referrerpolicy="no-referrer" onerror="this.onerror=null; this.src='${FALLBACK_IMAGE}';">
                                        </div>
                                        <div class="col-md-6 col-lg-7 char-info cssanimation fadeInRight">
                                            <h2>${characterName}'s Info</h2>
                                            <hr>
                                            <p><span>Series:</span> ${movieName}</p>
                                            <p><span>Birthday:</span> ${birthDay}</p>
                                            <p><span>Occupation:</span> ${occuPation.join(", ")}</p>
                                            <p><span>Nickname:</span> ${characterNickname}</p>
                                            <p><span>Status:</span> ${movieStatus}</p>
                                            <p class="number-of-kills"></p>
                                            <hr>
                                            <p><span>Breaking Bad Appearance:</span> ${formatSeasons(seasonAppearance)}</p>
                                            <p><span>Better Call Saul Appearance:</span> ${formatSeasons(betterCallSoulAppearance)}</p>
                                            <hr>
                                            <p><span>Portrayed by:</span> ${actor}</p>
                                        </div>
                                   `;

            displayCharacterQuote(getQuotesByAuthor(characterName));

            // Death Count by Individual:
            displayIndividualDeathCount(getDeathCount(characterName));

        })
    }//displayCharacters End

    const displayCharacterQuote = (quote) => {
        //console.log(quote,"CHAR QUOTES");

        let displayQuote = document.querySelector(".display-quotes");

        if (quote.length === 0)
        {
            displayQuote.innerHTML = `<p class="no-quotes">No quotes for this character yet.</p>`;
            return;
        }

        displayQuote.innerHTML = quote.map((q) => `
                                        <div class="col-md-6 col-lg-4 mb-4">
                                            <div class="card quote-container cssanimation pushReleaseFrom">
                                                <div class="card-body">
                                                    <h5 class="card-title">${q.author}</h5>
                                                    <p class="card-text">&ldquo;${q.quote}&rdquo;</p>
                                                </div>
                                                <div class="card-footer">${q.series}</div>
                                            </div>
                                        </div>
                                    `).join("");
    }//displayCharacterQuote End

    const displayMovieDeaths = (deaths) => {
        //console.log(deaths, "DEATHS");

        let displayDeaths = document.querySelector("main .display-episod-deaths .collapse-container .card-body-container");

        // Each card opens and closes on its own (no data-parent), so several can be read at once.
        displayDeaths.innerHTML = deaths.map((d) => {
            const hasLastWords = d.last_words && d.last_words !== "Unknown";

            return `
                        <div class="card death-card">
                            <div class="card-header" id="death-heading-${d.death_id}">
                                <h2 class="mb-0">
                                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#death-${d.death_id}" aria-expanded="true" aria-controls="death-${d.death_id}">
                                        Responsible for death <span>${d.responsible}</span>
                                    </button>
                                </h2>
                            </div>

                            <div id="death-${d.death_id}" class="collapse show" aria-labelledby="death-heading-${d.death_id}">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-md-5">
                                            <p><span>Victims:</span> ${d.death}</p>
                                            <p><span>Number of Deaths:</span> ${d.number_of_deaths}</p>
                                        </div>
                                        <div class="col-md-7">
                                            <p><span>Death Cause:</span> ${d.cause}</p>
                                            <p><span>When:</span> Season ${d.season}, Episode ${d.episode}</p>
                                        </div>
                                    </div>
                                    ${hasLastWords ? `<p class="last-words">Last words: &ldquo;${d.last_words}&rdquo;</p>` : ""}
                                </div>
                            </div>
                        </div>
            `;
        }).join("");

    }//displayMovieDeaths End

    const displayIndividualDeathCount = (count) => {
        //console.log(count[0].deathCount, "Number Of Kills")

        let displayNumOfKills = document.querySelector(".display-char-info");

        let numOfKills = displayNumOfKills.querySelector(".char-info .number-of-kills");

        numOfKills.innerHTML = `<span>Number of Kills:</span> ${count[0].deathCount}`;

    }//displayIndividualDeathCount End

    displayCharacters(allCharacters);
    displayMovieDeaths(allDeaths);

})();
