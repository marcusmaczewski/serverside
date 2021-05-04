const Player = require('./models/playerModels');


module.exports = (app) => {

	// Hent forsiden
	app.get('/', async (req, res) => {

		let players = await Player.find();

		// Render "Index"
		res.render('index', {
			title: 'Spillerplatform',
			message: 'Hello World',
			players
		});
	});


	// Hent en spiller ud fra hans ID
	app.get('/spiller/:id', async (req, res) => {
		let book = Player.findById(req.params.id);
		res.render('player', {
			player
		});
	});


	// Hent siden hvor alle spillere udskrives
	app.get('/players', async (req, res) => {
		let players = await Player.find();
		res.render('players', {
			players,
			player: new Player()
		});
	});


	// Opret ny spiller til vores esport system
	app.post('/players', async (req, res) => {

		// Istantier ny spiller "object".
		let player = new Player(req.body);

		console.dir(player);

		// Opret en array hvor i vi kan tilføje errors.
		let message = [];

		// Vi skal kende til personen så derfor skal vi bede om fuld navn
		if (player.fullname == "") {
			message.push('Udfyld fulde navn');
		}

		// Man er ikke rigtig proffesionnel før man har et "navn" som folk kender en fra.
		if (player.gamertag == "") {
			message.push('Udfyld gamertag');
		}

		// Spilleren skal have en gyldig alder som i dette tilfælde bare er over 0 fordi der findes
		// mange gode spillere i lav alder.
		if (player.age<= 13 || player.age == "") {
			message.push('Du skal minimum være 13 år.');
		}

		// Check om spilleren er medlem af et hold, kun spillere af et hold må tilmeldes!
		if (player.team == "") {
			message.push('Udfyld team');
		}

		// Konverter resultatet fra checkbox til true / false
		player.isAvailable = (req.body.isAvailable == "on" ? 1 : 0);

		if (message.length == 0) {
			if(req.files != undefined && req.files.image != undefined){
				await req.files.image.mv(`./public/images/${req.files.image.name}`)
				player.image = req.files.image.name;
			}

			// Gem splleren
			await player.save();
			res.redirect('/players');

		}
		else
		{
			let players = await Player.find();
			res.render('players', {
				player: req.body,
				players,
				message: message.join(', ')
			});
		}
	});


	app.get('/players/edit/:id', async (req, res) => {
		let players = await Player.find();
		let player = await Player.findById(req.params.id);
		res.render('players', {
			players,
			player
		});
	});

	app.post('/players/edit/:id', async (req, res) => {
		if(req.params.id){
			
			let player = await Player.findById(req.params.id);
	
	
			player.fullname = req.body.fullname;
			player.gamertag = req.body.gamertag;
			player.age = parseInt(req.body.age);
			player.team = req.body.team;
			player.status = req.body.status;
			await player.save();
			res.redirect('/players');

		}
		else{
			return 'Fejl under indhentning af ID';
		}
	});

	app.get('/players/delete/:id', async (req, res) => {
		await Player.findByIdAndDelete(req.params.id);
		res.redirect('/players');
	});

};