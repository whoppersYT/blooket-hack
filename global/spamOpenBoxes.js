const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
(async (args) => {
    let [box, amount] = args
    var name = JSON.parse(atob(localStorage.token.split('.')[1])).name,
        tokens = await fetch("https://api.blooket.com/api/users/tokens?name=" + name, {
            headers: {
                "referer": "https://www.blooket.com/",
                "content-type": "application/json",
                "authorization": localStorage.token
            }
        }),
        price = ({
            blizzard: 25,
            spooky: 25,
            blizzard: 25,
            aquatic: 25,
            bot: 20,
            space: 20,
            breakfast: 15,
            medieval: 15,
            wonderland: 20
        })[box],
        opens = amount > Math.floor(tokens / price) ? Math.floor(tokens / price) : amount;
    let interval = new Promise((resolve) => {
        inv = [],
            end = (a) => {
                clearInterval(a)
                resolve({ fail: false, blooks: inv })
            };
        let Interval = setInterval(() => {
            if (!opens) return end(Interval)
            fetch("https://api.blooket.com/api/users/unlockblook", {
                headers: {
                    authorization: localStorage.token,
                    "content-type": "application/json;charset=UTF-8",
                },
                referrer: "https://www.blooket.com/",
                body: JSON.stringify({ name, box }),
                method: "PUT"
            }).then(async (response) => {
                if (response.status != 200) return end(Interval);
                else inv.push(await response.json());
                opens--;
                if (!opens) return end(Interval)
            }).catch((e) => end(Interval));
        }, 128)
    });
    interval.then(async (x) => {
        if (x.fail) return alert("You don't have enough coins to open this box!");
        let count = {};
        Promise.all(x.blooks).then(Blooks => {
            Blooks.map(e => e.unlockedBlook).forEach((i) => {
                count[i] = (count[i] || 0) + 1;
            });
            alert('Results:\n' + Object.entries(count).map(x => `    ${x[1]} ${x[0]}`).join('\n'))
        })
    })
})([((text) => text.charAt(0).toUpperCase() + text.slice(1))(prompt('What box do you want to open? (e.g. "Space") The limited boxes will not open if they are not avaible')) , Number(prompt('How many do you want to open?'))])
