// Require the necessary discord.js classes
const { Client, Intents, MessageEmbed, MessageAttachment } = require("discord.js");

//config.json
//token is for discord bot token
//riotApiKey is for riot developper api
//prefix is for the bot's command prefix (ex. !molesto)
const {
    token,
    riotApiKey,
    prefix,
} = require("./config.json");

// Require the necessary teemojs classes
const TeemoJS = require("teemojs");
let api = TeemoJS(riotApiKey);

const fs = require("fs");
const { info } = require("console");

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// When the client is ready, run this code (only once)
client.once("ready", () => {
	console.log("Ramène pas trop ta fraise, je n'aime que les FROOMPAS !!!");
    client.user.setActivity("!molesto", ({type: "LISTENING"}));
});

// Login to Discord with your client's token
client.login(token);

var rawQueueId = fs.readFileSync("./queueId.json", "utf-8");
var queueId = JSON.parse(rawQueueId);
var gameMode;

var loseResult = [["./assets/results_attachments/venom_dunking.gif", "gif"], ["./assets/results_attachments/gay_garfield.jpg", "jpg"], ["./assets/results_attachments/0_20.jpg", "jpg"]];
var winResult = [["./assets/results_attachments/rip_bozo.mp4", "mp4"], ["./assets/results_attachments/gigachad.mp4", "mp4"], ["./assets/results_attachments/il_me_fallait.mp4", "mp4"]];
var gayDarius = "./assets/results_attachments/gay_darius.jpg"
var winDarius = "./assets/results_attachments/darius_win.mp4"
var gayPantheon = "./assets/results_attachments/gay_pantheon.jpg"
var tacosLose = "./assets/results_attachments/tacos_lose.jpg"
var ggTacos = "./assets/results_attachments/gg_tacos.png"
const ggtacos = new MessageAttachment('./assets/results_attachments/gg_tacos.png');

function delay(n){
    return new Promise(function(resolve){
        setTimeout(resolve,n*1000);
    });
}

client.on("message", async function(message) {
    if(!message.content.startsWith(prefix) || message.author.bot) return;
    var rawArgs = message.content.slice(prefix.length).trim().split(/ +/);
    var args = rawArgs.slice(1).join(" ");
    var command = rawArgs.shift().toLowerCase();

    if (args.startsWith("<@")){
        console.log("valid!!!");
        var jsonString = fs.readFileSync("./nameAssociations.json", "utf-8");
        var associations = JSON.parse(jsonString);
        associations.forEach(element => {
            if(element.discordID === args){
                console.log(element.summonerName)
                args = element.summonerName;
            }
        })
    }
    else{
        args = args;
    }

    //const exampleEmbed = new MessageEmbed()
    //    .setColor('#2a8aeb')
    //    .setTitle("Last game, " + "**" + results.summonerName + "**" + " played " + results.championName + " (again...) and lost ! (again...)\n\n" + "**" + results.summonerName + "**" + " is a **LOSER** !!!")
    //    .setImage(rand[0])

    if(command === "molesto"){
        if(!rawArgs.length){
            return message.channel.send(`Please input a valid Summoner Name, ${message.author}! `);
        }

        getSummonerResults(args);
        await delay(1.5);
    
        var jsonString = fs.readFileSync("./summonerResults.json", "utf-8");
        var results = JSON.parse(jsonString);

        var jsonString1 = fs.readFileSync("./lastMatch.json", "utf-8");
        var matchInfo = JSON.parse(jsonString1);
        console.log(matchInfo.info.queueId);

        var winStatus

        var timestamp = matchInfo.info.gameStartTimestamp;
        var date = new Date(timestamp);
        console.log(date.getDate());

        queueId.forEach(id => {
            if(id.queueId === matchInfo.info.queueId) {
                console.log(id.name);
                gameMode = (id.name);
            }
        })

        if(results.win === false){
            winStatus = "Defeat";
        }
        else{
            winStatus = "Victory";
        }


        const file = new MessageAttachment(`./assets/data_dragon/img/champion/tiles/${results.championName}_0.jpg`);
        const exampleEmbed = new MessageEmbed()
            .setColor('#2a8aeb')
            .setAuthor({name: `${gameMode}`})
            .setTitle(`${results.summonerName}'s last game`)
            .setDescription(`**${results.summonerName}** has played **${results.championName}**`)
            .setThumbnail(`attachment://${results.championName}_0.jpg`)
            .addFields(
                { name: 'K/D/A', value: `${results.kills}/${results.deaths}/${results.assists}`, inline: true },
                { name: 'CS', value: `${results.totalMinionsKilled}`, inline: false },
                { name: '\u200b', value: `\u200b`, inline: false },
                { name: `${winStatus}`, value: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`, inline: true },
            )

        message.channel.send({ embeds: [exampleEmbed], files: [file] });

        if(results.win == false){
            var rand = loseResult[(Math.random() * loseResult.length) | 0]

            if(results.summonerName === "DimedMc" && results.championName === "Darius"){
                message.channel.send({
                    files: [{
                        attachment: gayDarius,
                        name: "gay_darius.jpg"
                    }],
                    content: "<@330340428702547969>\n" + "Last game, " + "**" + results.summonerName + "**" + " played " + results.championName + " (again...) and lost ! (again...)\n\n" + "**" + results.summonerName + "**" + " is a **LOSER** !!!",
                });
            }

            else if(results.summonerName === "Echo3s Act 3"){
                message.channel.send({
                    files: [{
                        attachment: gayPantheon,
                        name: "gay_pantheon.jpg"
                    }],
                    content: "<@677340959570133023>\n" + "Last game, " + "**" + results.summonerName + "**" + " played " + results.championName + " and lost !\n\n" + "**" + results.summonerName + "**" + " is a **LOSER** !!!",
                });
            }

            else if(results.summonerName === "Tacosmerguezz"){
                message.channel.send({
                    files: [{
                        attachment: tacosLose,
                        name: "tacos_lose.jpg"
                    }],
                    content: "<@356101434451820564>\n" + "Last game, " + "**" + results.summonerName + "**" + " played " + results.championName + " and lost !\n\n" + "**" + results.summonerName + "**" + " is a **LOSER** !!!\n" + "*(maybe you should try to improve at the game, KAI'SA OTP ! :smirk_cat:)*",
                });
            }

            else{
                message.channel.send({
                    files: [{
                        attachment: rand[0],
                        name: "loseImage." + rand[1]
                    }],
                    content: "Last game, " + "**" + results.summonerName + "**" + " played " + results.championName + " and lost !\n\n" + "**" + results.summonerName + "**" + " is a **LOSER** !!!",
                });
            }
       
        }
        else{
            var rand = winResult[(Math.random() * winResult.length) | 0]

            if(results.summonerName === "DimedMc" && results.championName === "Darius"){
                message.channel.send({
                    files: [{
                        attachment: winDarius,
                        name: "darius_win.mp4"
                    }],
                    content: "<@330340428702547969>\n" + "Last game, " + "**" + results.summonerName + "**" + " played " + results.championName + " (again...) and won ! (finally...)\n\n" + "**" + results.summonerName + "**" + " is a **WINNER** !!!",
                });
            }

            else if(results.summonerName === "Tacosmerguezz"){
                message.channel.send({
                    files: [{
                        attachment: ggTacos,
                        name: "gg_tacos.png"
                    }],
                    content: "<@356101434451820564>\n" + "Last game, " + "**" + results.summonerName + "**" + " played " + results.championName + " and won !!!\n\n" + "**" + results.summonerName + "**" + " is a **WINNER** !!!",
                });
            }

            else{
                message.channel.send({
                    files: [{
                        attachment: rand[0],
                        name: "winImage." + rand[1]
                    }],
                    content: "Last game, " + "**" + results.summonerName + "**" + " played " + results.championName + " and won !\n\n" + "**" + results.summonerName + "**" + " is a **WINNER** !!!",
                });
            }
        }
    }

    if(command === "test"){
        if(!rawArgs.length){
            return message.channel.send(`Please input a valid Summoner Name, ${message.author}! `);
        }

        getSummonerResults(args);
        await delay(1.5);
    
        var jsonString = fs.readFileSync("./summonerResults.json", "utf-8");
        var results = JSON.parse(jsonString);

        var jsonString1 = fs.readFileSync("./lastMatch.json", "utf-8");
        var matchInfo = JSON.parse(jsonString1);
        console.log(matchInfo.info.queueId);

        var winStatus

        var timestamp = matchInfo.info.gameStartTimestamp;
        var date = new Date(timestamp);
        console.log(date.getDate());

        queueId.forEach(id => {
            if(id.queueId === matchInfo.info.queueId) {
                console.log(id.name);
                gameMode = (id.name);
            }
        })

        if(results.win === false){
            winStatus = "Defeat";
        }
        else{
            winStatus = "Victory";
        }


        const file = new MessageAttachment(`./assets/data_dragon/img/champion/tiles/${results.championName}_0.jpg`);
        const exampleEmbed = new MessageEmbed()
            .setColor('#2a8aeb')
            .setAuthor({name: `${gameMode}`})
            .setTitle(`${results.summonerName}'s last game`)
            .setDescription(`**${results.summonerName}** has played **${results.championName}**`)
            .setThumbnail(`attachment://${results.championName}_0.jpg`)
            .addFields(
                { name: 'K/D/A', value: `${results.kills}/${results.deaths}/${results.assists}`, inline: true },
                { name: 'CS', value: `${results.totalMinionsKilled}`, inline: false },
                { name: '\u200b', value: `\u200b`, inline: false },
                { name: `${winStatus}`, value: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`, inline: true },
            )

        message.channel.send({ embeds: [exampleEmbed], files: [file] });
    }
});

// Function to get all infos we need on Summoner with Riot API (League of Legends)
function getSummonerResults(summonerName){

    // Obtain Summoner's PUUID from Summoner Name to obtain all matches infos
    api.get('euw1', 'summoner.getBySummonerName', summonerName).then(function(data){
        const summonerId = data.puuid;
        console.log(summonerName + "'s ID is : " + summonerId);

        //  Get the latest 20 matches of the Summoner
        api.get('europe', "match.getMatchIdsByPUUID", summonerId, {start: 0, count: 5}).then(function(data){
            const latestMatches = data;
            //console.log(summonerName + "'s latest matches : ");
            //console.log(latestMatches);

            // Check the latest match and get all infos about
            api.get("europe", "match.getMatch", latestMatches[0]).then(function(match){
                //console.log("Latest match infos : ");
                //console.log(match);
                fs.writeFile("./lastMatch.json", JSON.stringify(match), err => {
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("Match infos have been successfully written !");
                    }
                });
                match.info.participants.forEach(summonerData => {
                    if(summonerData.summonerName == summonerName){
                        //console.log(summonerName + "'s recap on that match : ");
                        //console.log(summonerData);
                        fs.writeFile("./summonerResults.json", JSON.stringify(summonerData), err => {
                            if(err){
                                console.log(err);
                            }
                            else{
                                console.log("Summoner Results have been successfully written !");
                            }
                        });
                    }
                })
            })
        })
    })
}