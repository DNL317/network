document.addEventListener('DOMContentLoaded', load_posts)

function load_posts() {

    console.log("load_posts running");

    document.querySelector('#index-display').style.display = 'block';
    document.querySelector('#profile-display').style.display = 'none';


    fetch(`/all_posts`)
    .then(response => response.json())
    .then(posts => {
        // Print posts
        console.log(posts);
        posts.forEach(post => show_posts(post));
    });
}

function show_posts(post) {

    console.log("show_posts running")
    //create 'main' div (will add content to it below), and store it in a variable
    const post_display = document.createElement('div');
    post_display.id = 'post';
    post_display.className = 'col-lg-10 col-md-20 col-sm-30 border';
    
    console.log("step 1: div created")
    //create new element for link to profiles, add it to the 'main' div
    const post_poster = document.createElement('div');
    post_poster.id = 'post-poster';
    post_poster.innerHTML = post.poster;
    post_poster.addEventListener('click', event => {
        username_lookup = event.target.innerHTML;
        load_posts_profile(username_lookup);
    });
    post_display.append(post_poster);  

    console.log("step 2 done")
    //create new div to display post, add it to the 'main' div
    const post_body = document.createElement('div');
    post_body.id = 'post-body';
    post_body.innerHTML = post.body;
    post_display.append(post_body);

    console.log("step 3 done")
    //create new div to display timestamp, add it to the 'main' div
    const post_timestamp = document.createElement('div');
    post_timestamp.id = 'post-timestamp';
    post_timestamp.innerHTML = post.timestamp;
    post_display.append(post_timestamp);

    console.log("step 4 done")
    //create new div to display # of likes, add it to the 'main' div
    const post_likes = document.createElement('div');
    post_likes.id = 'post-likes';
    post_likes.innerHTML = `Likes: ${post.likes}`;
    post_display.append(post_likes);

    console.log("step 5 done");
    document.querySelector('#all-posts').append(post_display);

    console.log("post appended");
}

function load_posts_profile(username_lookup) {

    console.log("load_posts_profile running");

    document.querySelector('#index-display').style.display = 'none';
    document.querySelector('#profile-display').style.display = 'block';

    document.querySelector('#profile-name').innerHTML = username_lookup;

    fetch(`/${username_lookup}`)
    .then(response => response.json())
    .then(profiles => {
        console.log(profiles);
        profiles.forEach(profile => show_follow_count(profile));
    });
    

    fetch('/all_posts')
    .then(response => response.json())
    .then(posts => {
        // Print posts
        console.log(posts);
        posts.forEach(post => show_posts_profile(post, username_lookup));
    });
}

function show_posts_profile(post, username_lookup) {
    
    console.log("show_posts_profile running");

    if (post.poster === username_lookup) {
        
        //create 'main' div (will add content to it below), and store it in a variable
        const post_display = document.createElement('div');
        post_display.id = 'post';
        post_display.className = 'col-lg-10 col-md-20 col-sm-30 border';
        
        //create new element for link to profiles, add it to the 'main' div
        const post_poster = document.createElement('div');
        post_poster.id = 'post-poster';
        post_poster.innerHTML = post.poster;
        post_display.append(post_poster);

        //create new div to display post, add it to the 'main' div
        const post_body = document.createElement('div');
        post_body.id = 'post-body';
        post_body.innerHTML = post.body;
        post_display.append(post_body);

        //create new div to display timestamp, add it to the 'main' div
        const post_timestamp = document.createElement('div');
        post_timestamp.id = 'post-timestamp';
        post_timestamp.innerHTML = post.timestamp;
        post_display.append(post_timestamp);


        //create new div to display # of likes, add it to the 'main' div
        const post_likes = document.createElement('div');
        post_likes.id = 'post-likes';
        post_likes.innerHTML = `Likes: ${post.likes}`;
        post_display.append(post_likes);


        document.querySelector('#profile-posts').append(post_display);
    }
}


function show_follow_count(profile) {

    document.querySelector('#followers').innerHTML = `Followers: ${profile.followers}`;
    document.querySelector('#following').innerHTML = `Following: ${profile.following}`;
}