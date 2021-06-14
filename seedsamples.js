var catsscore = 10 / 3;
var samples = {};

samples.movielist = [
    {
        moviename: 'Iron man',
        airdate: '31 April 2021',
        image: 'https://upload.wikimedia.org/wikipedia/en/0/00/Iron_Man_poster.jpg',
        trailer: '8hYlB38asDY',
        desc: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?',
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
        desc: 'Fatality',
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
        desc: 'Minariiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii',
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
        desc: 'A bystander who intervenes to help a woman being harassed by a group of men becomes the target of a vengeful drug lord.\nCredit: IMDB',
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
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' ,
        length: 113,
        genre: ['action', 'thriller', 'scifi'],
        avgrating: 8.25,
        reviewcount: 4,
        sumrating: 33,
        movierating: 'pg13',
        likecount: 12345
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
        title: 'Doge hahaha',
        caption: 'Can\'t find better bg',
        image: 'https://wallpaper.dog/large/20475179.jpg',
        newsdate: new Date(2021, 5, 10, 12, 30, 45),
        contents: [
            {
                ctype: 'text', // avaiable types: text, image
                content: 'Lx.',
                order: 1
            },
            {
                ctype: 'text', // avaiable types: text, image
                content: 'Dogeeeeeeeeeeeeeeeeee',
                order: 2
            }
        ],
        viewcount: 0,
        likecount: 0,
        newstype: 'news',
        featured: true
    },
    {
        title: 'Just a second news',
        caption: 'Can\'t find better bg too',
        image: 'https://wallpaper.dog/large/20475179.jpg',
        newsdate: new Date(2021, 5, 11, 12, 30, 45),
        contents: [
            {
                ctype: 'text', // avaiable types: text, image
                content: 'EEEEEEEEEEEEEEE EEEE.',
                order: 1
            },
            {
                ctype: 'text', // avaiable types: text, image
                content: 'EEEEEEE',
                order: 2
            }
        ],
        viewcount: 0,
        likecount: 0,
        newstype: 'news',
        featured: true
    }
];

module.exports = samples;