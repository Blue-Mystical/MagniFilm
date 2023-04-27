var catsscore = 10 / 3;
var samples = {};

samples.movielist = [
    {
        moviename: 'Iron man',
        airdate: '31 April 2021',
        image: 'https://m.media-amazon.com/images/M/MV5BMTczNTI2ODUwOF5BMl5BanBnXkFtZTcwMTU0NTIzMw@@._V1_FMjpg_UX1000_.jpg',
        trailer: '8hYlB38asDY',
        desc: 'After being held captive in an Afghan cave, billionaire engineer Tony Stark creates a unique weaponized suit of armor to fight evil. Credit: IMDb',
        length: 126,
        genre: ['action'],
        avgrating: 8,
        reviewcount: 1,
        sumrating: 8,
        movierating: 'pg',
        likecount: 1
    },
    {
        moviename: 'Mortal Kombat',
        airdate: '3 May 2021', 
        image: 'https://www.brighttv.co.th/wp-content/uploads/2021/04/mortal-kombat-movie-scorpion-poster-1257057.jpeg',
        trailer: '-BQPKD7eozY',
        desc: 'In "Mortal Kombat," MMA fighter Cole Young, accustomed to taking a beating for money, is unaware of his heritage -- or why Outworld\'s Emperor Shang Tsung has sent his best warrior, Sub-Zero, an otherworldly Cryomancer, to hunt Cole down. Fearing for his family\'s safety, Cole goes in search of Sonya Blade at the direction of Jax, a Special Forces Major who bears the same strange dragon marking Cole was born with. Soon, he finds himself at the temple of Lord Raiden, an Elder God and the protector of Earthrealm, who grants sanctuary to those who bear the mark. Here, Cole trains with experienced warriors Liu Kang, Kung Lao and rogue mercenary Kano, as he prepares to stand with Earth\'s greatest champions against the enemies of Outworld in a high stakes battle for the universe. But will Cole be pushed hard enough to unlock his arcana -- the immense power from within his soul -- in time to save not only his family, but to stop Outworld once and for all?',
        length: 110,
        genre: ['action', 'adventure', 'fantasy'],
        avgrating: -1,
        reviewcount: 0,
        sumrating: 0,
        movierating: 'pg13',
        likecount: 2   
    },
    {
        moviename: 'The Conjuring 2',
        airdate: '3 June 2021', 
        image: 'https://cdn.majorcineplex.com/uploads/movie/1506/thumb_1506.jpg?230520210601',
        trailer: 'VFsmuRPClr4',
        desc: 'The film was written by Carey Hayes, Chad Hayes, Wan, and David Leslie Johnson. It is the sequel to the horror film The Conjuring, which was released on July 19, 2013. Patrick Wilson and Vera Farmiga reprise their roles as paranormal investigators and authors Ed and Lorraine Warren, who travel to England to investigate poltergeist activity at a council house in Enfield.',
        length: 133,
        genre: ['horror'],
        avgrating: -1,
        reviewcount: 0,
        sumrating: 0,
        movierating: 'r',
        likecount: 0
    },
    {
        moviename: 'A Quiet Place Part II',
        airdate: '24 June 2021', 
        image: 'https://cdn.majorcineplex.com/uploads/movie/2747/thumb_2747.jpg?060520211115',
        trailer: 'BpdDN9d9Jio',
        desc: 'Following the deadly events at home, the Abbott family (Emily Blunt, Millicent Simmonds, Noah Jupe) must now face the terrors of the outside world as they continue their fight for survival in silence. Forced to venture into the unknown, they quickly realize that the creatures that hunt by sound are not the only threats that lurk beyond the sand path.',
        length: 97,
        genre: ['horror','thriller'],
        avgrating: -1,
        reviewcount: 0,
        sumrating: 0,
        movierating: 'r',
        likecount: 0
    },
    {
        moviename: 'Stand by Me Doraemon 2',
        airdate: '6 April 2021', 
        image: 'https://cdn.majorcineplex.com/uploads/movie/3011/thumb_3011.jpg?280420210500',
        desc: 'The film\'s story will largely be based on the franchise\'s 2000 film Doraemon: Obāchan no Omoide, but will add original elements, including the love story of Shizuka and Nobita that was also present in the previous Stand By Me Doraemon film.',
        length: 96,
        genre: ['animation'],
        avgrating: -1,
        reviewcount: 0,
        sumrating: 0,
        movierating: 'g',
        likecount: 0
    },
    {
        moviename: 'Minari',
        airdate: '21 May 2021', 
        image: 'https://cdn.majorcineplex.com/uploads/movie/3169/thumb_3169.jpg?280420210500',
        trailer: 'KQ0gFidlro8',
        desc: 'A Korean family moves to Arkansas to start a farm in the 1980s. Credit: IMDb',
        length: 115,
        genre: ['drama'],
        avgrating: -1,
        reviewcount: 0,
        sumrating: 0,
        movierating: 'g',
        likecount: 0
    },
    {
        moviename: 'Collectors',
        airdate: '22 May 2021', 
        image: 'https://cdn.majorcineplex.com/uploads/movie/3183/thumb_3183.jpg?280420210500',
        desc: 'aka รวมกันเราฉก',
        length: 116,
        genre: ['adventure','crime'],
        avgrating: -1,
        reviewcount: 0,
        sumrating: 0,
        movierating: 'pg',
        likecount: 0
    },
    {
        moviename: 'Nobody',
        airdate: '24 May 2021', 
        image: 'https://cdn.majorcineplex.com/uploads/movie/3134/thumb_3134.jpg?280420210500',
        trailer: 'wZti8QKBWPo',
        desc: 'A bystander who intervenes to help a woman being harassed by a group of men becomes the target of a vengeful drug lord. Credit: IMDB',
        length: 92,
        genre: ['action','thriller'],
        avgrating: -1,
        reviewcount: 0,
        sumrating: 0,
        movierating: 'pg13',
        likecount: 0
    },
    {
        moviename: 'Seobok',
        airdate: '16 May 2021', 
        image: 'https://cdn.majorcineplex.com/uploads/movie/3092/thumb_3092.jpg?280420210500',
        trailer: '5vSr2TPr6w8',
        desc: '“Seo Bok” is an action thriller that will tell the story of the world’s first human clone, Seo Bok, and the many different forces who want to capture him in order to uncover the secret to eternal life.',
        length: 115,
        genre: ['action', 'thriller', 'scifi'],
        avgrating: 8,
        reviewcount: 1,
        sumrating: 8,
        movierating: 'pg13',
        likecount: 1
    },
    {
        moviename: 'Godzilla vs King Kong',
        airdate: '26 March 2021', 
        image: 'https://cdn.majorcineplex.com/uploads/movie/2746/thumb_2746.jpg?280420210500',
        trailer: 'odM92ap8_c0',
        desc: 'The epic next chapter in the cinematic Monsterverse pits two of the greatest icons in motion picture history against one another - the fearsome Godzilla and the mighty Kong - with humanity caught in the balance.',
        length: 113,
        genre: ['action', 'thriller', 'scifi'],
        avgrating: 8.25,
        reviewcount: 4,
        sumrating: 33,
        movierating: 'pg13',
        likecount: 12345
    },
    {
        moviename: 'Detective Conan The Scarlet Alibi',
        airdate: '1 April 2021', 
        image: 'https://cdn.majorcineplex.com/uploads/movie/3196/thumb_3196.jpg?280420210500',
        trailer: 'KW2tU0GIni8',
        desc: 'It\'s the compilation from the Anime of the story of Akaki Familly.Credit: IMDB',
        length: 93,
        genre: ['animation', 'crime'],
        avgrating: -1,
        reviewcount: 0,
        sumrating: 0,
        movierating: 'pg13',
        likecount: 0
    },
    {
        moviename: 'The Night Beyond the Tricornered Window',
        airdate: '1 July 2021', 
        image: 'https://cdn.majorcineplex.com/uploads/movie/3182/thumb_3182.jpg?100520210747',
        desc: 'Lorem ipsum',
        length: 0,
        genre: ['romance', 'thriller'],
        avgrating: -1,
        reviewcount: 0,
        sumrating: 0,
        movierating: 'pg',
        likecount: 0
    },
    {
        moviename: 'Earwig of the Witch',
        airdate: '1 July 2021', 
        image: 'https://cdn.majorcineplex.com/uploads/movie/3109/thumb_3109.jpg?180520210940',
        desc: 'Lorem ipsum',
        length: 0,
        genre: ['animation', 'fantasy'],
        avgrating: -1,
        reviewcount: 0,
        sumrating: 0,
        movierating: 'g',
        likecount: 0
    },
    {
        moviename: 'Fast and Furious 9',
        airdate: '15 July 2021', 
        image: 'https://cdn.majorcineplex.com/uploads/movie/2842/thumb_2842.jpg?140620211600',
        desc: 'Lorem ipsum',
        length: 143,
        genre: ['action', 'adventure', 'crime'],
        avgrating: -1,
        reviewcount: 0,
        sumrating: 0,
        movierating: 'g',
        likecount: 0
    },
    {
        moviename: 'The Suicide Squad',
        airdate: '29 July 2021', 
        image: 'https://cdn.majorcineplex.com/uploads/movie/3082/thumb_3082.jpg?040220210420',
        desc: 'Lorem ipsum',
        length: 0,
        genre: ['action', 'comedy'],
        avgrating: -1,
        reviewcount: 0,
        sumrating: 0,
        movierating: 'pg13',
        likecount: 0
    },
    {
        moviename: 'Paw Patrol: The Movie',
        airdate: '28 August 2021', 
        image: 'https://cdn.majorcineplex.com/uploads/movie/3097/thumb_3097.jpg?200120210441',
        desc: 'Lorem ipsum',
        length: 0,
        genre: ['animation'],
        avgrating: -1,
        reviewcount: 0,
        sumrating: 0,
        movierating: 'g',
        likecount: 0
    },
    {
        moviename: 'Peter Rabbit 2 The Runaway',
        airdate: '7 October 2021', 
        image: 'https://cdn.majorcineplex.com/uploads/movie/2754/thumb_2754.jpg?100620210325',
        desc: 'Lorem ipsum',
        length: 0,
        genre: ['animation', 'adventure', 'comedy'],
        avgrating: -1,
        reviewcount: 0,
        sumrating: 0,
        movierating: 'g',
        likecount: 0
    },
    {
        moviename: 'The Black Widow',
        airdate: '8 July 2021', 
        image: 'https://cdn.majorcineplex.com/uploads/movie/2769/thumb_2769.jpg?250520210827',
        desc: 'Lorem ipsum',
        length: 0,
        genre: ['action'],
        avgrating: -1,
        reviewcount: 0,
        sumrating: 0,
        movierating: 'pg13',
        likecount: 0
    },
    {
        moviename: 'CATS (2019)',
        airdate: '14 July 2019', 
        image: 'https://upload.wikimedia.org/wikipedia/en/c/cf/Cats_2019_poster.jpg',
        desc: 'A bad movie that should not be recommended',
        length: 110,
        genre: ['animation', 'comedy', 'drama', 'musical'],
        avgrating: catsscore,
        reviewcount: 3,
        sumrating: 10,
        movierating: 'g',
        likecount: 0
    }
];

samples.newslist = [
    {
        title: 'Godzilla vs Kong Available!',
        caption: 'It will be epic',
        image: '/seedimages/newsimage1.jpg',
        newsdate: new Date(2021, 2, 25, 12, 30, 00),
        contents: [
            {
                ctype: 'text', // avaiable types: text, image
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent bibendum interdum ex sit amet pellentesque. Cras quis quam nibh. Praesent id tristique mi. Integer fermentum faucibus pulvinar. Fusce non ligula pretium, egestas mi quis, semper orci. Maecenas quis tempus lectus.',
                order: 1
            },
            {
                ctype: 'text', // avaiable types: text, image
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent bibendum interdum ex sit amet pellentesque. Cras quis quam nibh. Praesent id tristique mi. Integer fermentum faucibus pulvinar. Fusce non ligula pretium, egestas mi quis, semper orci. Maecenas quis tempus lectus.',
                order: 2
            },
            {
                ctype: 'text', // avaiable types: text, image
                content: '',
                order: 3
            },
            {
                ctype: 'text', // avaiable types: text, image
                content: '',
                order: 4
            },
            {
                ctype: 'text', // avaiable types: text, image
                content: '',
                order: 5
            },
            {
                ctype: 'text', // avaiable types: text, image
                content: '',
                order: 6
            },
            {
                ctype: 'text', // avaiable types: text, image
                content: '',
                order: 7
            },
            {
                ctype: 'text', // avaiable types: text, image
                content: '',
                order: 8
            },
            {
                ctype: 'text', // avaiable types: text, image
                content: '',
                order: 9
            }
        ],
        viewcount: 0,
        likecount: 0,
        newstype: 'news',
        featured: true
    },
    {
        title: 'A Quiet Place 2 reached over 100 million dollars milestone',
        caption: '100M$',
        image: '/seedimages/newsimage2.jpg',
        newsdate: new Date(2021, 5, 13, 12, 30, 45),
        contents: [
            {
                ctype: 'text', // avaiable types: text, image
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent bibendum interdum ex sit amet pellentesque. Cras quis quam nibh. Praesent id tristique mi. Integer fermentum faucibus pulvinar. Fusce non ligula pretium, egestas mi quis, semper orci. Maecenas quis tempus lectus.',
                order: 1
            },
            {
                ctype: 'text', // avaiable types: text, image
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent bibendum interdum ex sit amet pellentesque. Cras quis quam nibh. Praesent id tristique mi. Integer fermentum faucibus pulvinar. Fusce non ligula pretium, egestas mi quis, semper orci. Maecenas quis tempus lectus.',
                order: 2
            },
            {
                ctype: 'text', // avaiable types: text, image
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent bibendum interdum ex sit amet pellentesque. Cras quis quam nibh. Praesent id tristique mi. Integer fermentum faucibus pulvinar. Fusce non ligula pretium, egestas mi quis, semper orci. Maecenas quis tempus lectus.',
                order: 3
            },
            {
                ctype: 'text', // avaiable types: text, image
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent bibendum interdum ex sit amet pellentesque. Cras quis quam nibh. Praesent id tristique mi. Integer fermentum faucibus pulvinar. Fusce non ligula pretium, egestas mi quis, semper orci. Maecenas quis tempus lectus.',
                order: 4
            },
            {
                ctype: 'text', // avaiable types: text, image
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent bibendum interdum ex sit amet pellentesque. Cras quis quam nibh. Praesent id tristique mi. Integer fermentum faucibus pulvinar. Fusce non ligula pretium, egestas mi quis, semper orci. Maecenas quis tempus lectus.',
                order: 5
            },
            {
                ctype: 'text', // avaiable types: text, image
                content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent bibendum interdum ex sit amet pellentesque. Cras quis quam nibh. Praesent id tristique mi. Integer fermentum faucibus pulvinar. Fusce non ligula pretium, egestas mi quis, semper orci. Maecenas quis tempus lectus.',
                order: 6
            },
            {
                ctype: 'text', // avaiable types: text, image
                content: '',
                order: 7
            },
            {
                ctype: 'text', // avaiable types: text, image
                content: '',
                order: 8
            },
            {
                ctype: 'text', // avaiable types: text, image
                content: '',
                order: 9
            }
        ],
        viewcount: 0,
        likecount: 0,
        newstype: 'news',
        featured: true
    }
];

module.exports = samples;