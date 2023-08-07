intent('What does this app do?', 'What can I do here?',
      reply('This is a news project.'));



const API_KEY = 'd34eb4e9a4c94b609c2d92a4d9dcbd9e';
let savedArticles = [];

intent('Give me the news from $(source* (.*))', (p) => {
    let NEWS_API_URL = `https://newsapi.org/v2/top-headlines?apiKey=${API_KEY}`;
    
    console.log(NEWS_API_URL);
    if (p.source.value) {
        NEWS_API_URL = `${NEWS_API_URL}&sources=${p.source.value.toLowerCase().split(" ").join('-')}`;

    }
    
    const headers = {
        'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36' // Replace 'Your-User-Agent-Name' with a name for your application
    };
    
    api.request(NEWS_API_URL, {headers}, (error, response, body) => {
        if (error) {
            console.error('Error:', error);
            p.play('Sorry, there was an error while fetching the news.');
            return;
        }
        console.log(body);
        const data = JSON.parse(body);

        if (!data.articles || data.articles.length === 0) {
            console.error('No articles found in the response.');
            p.play('Sorry, please try reading news from a different source.');
            return;
        }
        
        const articles = data.articles;
        savedArticles = articles;

        p.play({ command: 'newHeadlines', articles });
        p.play(`Here are the (latest|recent) ${p.source.value}.`);
    });
});
