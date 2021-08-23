document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('#following-link').addEventListener('click', () => load_posts_following());

    load_posts();
})

function load_posts() {

    console.log("load_posts running");

    document.querySelector('#index-display').style.display = 'block';
    document.querySelector('#profile-display').style.display = 'none';
    document.querySelector('#following-display').style.display = 'none';


    fetch('/all_posts')
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

function load_posts_following() {

    console.log("load_posts_following running");

    document.querySelector('#index-display').style.display = 'none';
    document.querySelector('#profile-display').style.display = 'none';
    document.querySelector('#following-display').style.display = 'block';

    fetch('/profile_info')
    .then(response => response.json())
    .then(profiles_returned => {
        console.log(profiles_returned);
        profiles_returned.forEach(profile => {
    
            fetch('/all_posts')
            .then(response => response.json())
            .then(posts => {
                // Print posts
                console.log(posts);
                posts.forEach(post => show_posts_following(post, profile));
            });
        });
    });
}

function show_posts_following(post, profile) {
    
    console.log("show_posts_following running");
    console.log(post.poster);
    console.log(profile);
    console.log(profile.following_usernames);

    if (profile.following_usernames.includes(post.poster)) {
        
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

        document.querySelector('#following-posts').append(post_display);
    }
}

function load_posts_profile(username_lookup) {

    console.log("load_posts_profile running");

    document.querySelector('#index-display').style.display = 'none';
    document.querySelector('#profile-display').style.display = 'block';
    document.querySelector('#following-display').style.display = 'none';

    document.querySelector('#profile-name').innerHTML = username_lookup;

    fetch(`/${username_lookup}/profile`)
    .then(response => response.json())
    .then(profiles => {
        console.log(profiles);
        profiles.forEach(profile => show_follow_count(profile));
        follow_button(username_lookup, profiles);
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
    console.log(post.poster);

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

    document.querySelector('#followers').innerHTML = `${profile.followers}`;
    document.querySelector('#following').innerHTML = `${profile.following}`;
}

function follow(username_lookup) {

    console.log("follow running")
    fetch(`/${username_lookup}/follow`)
    .then(response => null)
}

function unfollow(username_lookup) {

    console.log("unfollow running")
    fetch(`/${username_lookup}/unfollow`)
    .then(response => null)
}

function update_followers() {

   const before_followers = document.querySelector('#followers').innerHTML;
   console.log(before_followers);
   var after_followers = parseInt(before_followers) + 1;
   after_followers = parseInt(after_followers);
   console.log(after_followers);
   document.querySelector('#followers').innerHTML = `${after_followers}`;
}

function update_followers_unfollow() {

    const before_followers = document.querySelector('#followers').innerHTML;
    console.log(before_followers);
    var after_followers = parseInt(before_followers) - 1;
    after_followers = parseInt(after_followers);
    console.log(after_followers);
    document.querySelector('#followers').innerHTML = `${after_followers}`;
}

function follow_button(username_lookup) {

    console.log("follow_button running")

    fetch('/profile_info')
    .then(response => response.json())
    .then(current_logged_profile => {
        console.log(current_logged_profile);
        current_logged_profile.forEach(profile => {
            if (username_lookup === profile.username) {
                console.log("own profile found - no follow button");
            }
            
            else if (profile.following_usernames.includes(username_lookup)) {

                console.log("unfollow button");
                const unfollow_button = document.createElement('button');    
                unfollow_button.innerHTML = "Unfollow";
                unfollow_button.style.width = '50px';
                unfollow_button.style.height = '25px';
                profile_header = document.querySelector('#profile-name');
                profile_header.append(unfollow_button);
                unfollow_button.addEventListener('click', () => {
                    unfollow(username_lookup);
                    update_followers_unfollow();
                })
            }

            else {
                console.log("not already follower - follow button");
                const follow_button = document.createElement('button');    
                follow_button.innerHTML = "Follow";
                follow_button.style.width = '50px';
                follow_button.style.height = '25px';
                profile_header = document.querySelector('#profile-name');
                profile_header.append(follow_button);
                follow_button.addEventListener('click', () => {
                    follow(username_lookup);
                    update_followers();
                });
            }

        });
    });
}