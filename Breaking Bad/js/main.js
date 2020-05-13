(() => 
{
    const BREAKING_BAD_API = "https://www.breakingbadapi.com/api/";

    fetch(BREAKING_BAD_API).then((response) => {
        return response.json()
    }).then((movieData) => {
        fetchCharacters(movieData);
        fetchMovieDeaths(movieData);
    }).catch((err) => {
        console.log(`Some error(s) occured: ${err}`);
    });

    const fetchCharacters = (data) => {
        fetch(data.characters).then((response) => {
            return response.json()
        }).then((movieCharacters) => {
           displayCharacters(movieCharacters);
        }).catch((err) => {
            console.log(`Some error(s) occured: ${err}`);
        });
    }//fetchCharacters End

    const fetchMovieDeaths = (data) => {
        fetch(data.deaths).then((response) => {
            return response.json()
        }).then((movieDeaths) => {
           displayMovieDeaths(movieDeaths);
        }).catch((err) => {
            console.log(`Some error(s) occured: ${err}`);
        });
    }//fetchMovieDeaths End

    const displayCharacters = (characters) => {
        //console.log(characters, "Characters")

        let dropdownList = document.querySelector("#character-select");
        let option;

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

            if(seasonAppearance.length !== 0)
            {
                seasonAppearance;
            }
            else
            {
                seasonAppearance = "none";
            }

            if(betterCallSoulAppearance.length !== 0)
            {
                betterCallSoulAppearance;
            }
            else
            {
                betterCallSoulAppearance = "none";
            }    

            let displayCharInfo = document.querySelector(".display-char-info");

            displayCharInfo.innerHTML = `
                                    
                                        <div class="col-md-4 image-info cssanimation fadeInLeft">
                                            <h2>${characterName}</h2>
                                            <img src="${characterImage}" alt="${characterName} Photo" class="img-thumbnail">
                                        </div>
                                        <div class="col-md-7 char-info cssanimation fadeInRight">
                                            <h2>${characterName}'s Info</h2>
                                            <hr>
                                            <p><span>Movie Appearance:</span> ${movieName}</p>
                                            <p><span>Birthday:</span> ${birthDay}</p>
                                            <p><span>Occupation:</span> ${occuPation}</p>
                                            <p><span>Nickname:</span> ${characterNickname}</p>
                                            <p><span>Movie Status:</span> ${movieStatus}</p>
                                            <p class="number-of-kills"></p>                                          
                                            <hr>
                                            <p><span>Breaking Bad Appearance:</span> season ${seasonAppearance}</p>
                                            <p><span>Better Call Saul Appearance:</span> season ${betterCallSoulAppearance}</p>
                                            <hr>
                                            <p><span>Portrayed:</span> ${actor}</p>
                                        </div>
                                   `;

            const BREAKING_BAD_QUOTES_API = `https://www.breakingbadapi.com/api/quote?author=${characterName}`;
            const BREAKING_BAD_DEATH_COUNT_API = `https://www.breakingbadapi.com/api/death-count?name=${characterName}`;

            fetch(BREAKING_BAD_QUOTES_API).then((response) => {
                return response.json()
            }).then((characterQuote) => {
               displayCharacterQuote(characterQuote);
            }).catch((err) => {
                console.log(`Some error(s) occured: ${err}`);
            });

            // Death Count by Individual:
            fetch(BREAKING_BAD_DEATH_COUNT_API).then((response) => {
                return response.json()
            }).then((count) => {
               displayIndividualDeathCount(count);
            }).catch((err) => {
                console.log(`Some error(s) occured: ${err}`);
            });
            
        })
    }//displayCharacters End

    const displayCharacterQuote = (quote) => {
        //console.log(quote,"CHAR QUOTES");

        let displayQuote = document.querySelector(".display-quotes");

        displayQuote.innerHTML = "";

        quote.map((q) => {
            displayQuote.innerHTML += `
                                        <div class="col-sm-4 mb-3">
                                            <div class="card quote-container cssanimation pushReleaseFrom">
                                                <div class="card-body">
                                                    <h5 class="card-title">${q.author} Quote</h5>
                                                    <p class="card-text">${q.quote}</p>                                                 
                                                </div>
                                                <hr>
                                                <p>${q.series}</p>
                                            </div>
                                        </div>
                                    `;
        })
    }//displayCharacterQuote End

    const displayMovieDeaths = (deaths) => {
        //console.log(deaths, "DEATHS");

        let displayDeaths = document.querySelector("main .display-episod-deaths .collapse-container .card-body-container");

        deaths.map((d) => {
            displayDeaths.innerHTML += 
            `
                        <div class="accordion" id="accordionEpisods">
                            <div class="card">
                                <div class="card-header" id="de${d.death_id}">
                                    <h2 class="mb-0">
                                    <button class="btn btn-link" type="button" data-toggle="collapse" data-target="#d${d.death_id}" aria-expanded="false" aria-controls="de${d.death_id}">
                                        Responsible for death <span>${d.responsible}</span>
                                    </button>
                                    </h2>
                                </div>
                            
                                <div id="d${d.death_id}" class="collapse show" aria-labelledby="de${d.death_id}" data-parent="#accordionEpisods">
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
                                    </div>
                                </div>
                            </div>
                            <hr>
                        </div>
            `;
        })

    }//displayMovieDeaths End

    const displayIndividualDeathCount = (count) => {
        //console.log(count[0].deathCount, "Number Of Kills")

        let displayNumOfKills = document.querySelector(".display-char-info");

        let numOfKills = displayNumOfKills.querySelector(".char-info .number-of-kills");

        numOfKills.innerHTML = `<span>Number of Kills:</span> ${count[0].deathCount}`;

    }//displayIndividualDeathCount End
    
})();
