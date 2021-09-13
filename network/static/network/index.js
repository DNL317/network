document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('#following-link').addEventListener('click', () => load_posts_following());
    document.querySelector('#liked-link').addEventListener('click', () => load_posts_liked());

    load_posts();
})

function load_posts() {

    console.log("load_posts running");

    document.querySelector('#all-posts-display').style.display = 'block';
    document.querySelector('#profile-following-display').style.display = 'none';

    var show_page_num = 1;

    fetch('/all_posts')
    .then(response => response.json())
    .then(posts => {
        // Print posts
        console.log(posts);
        post_count = posts.length;
        var page_count = Math.ceil(post_count / 10);
        console.log(page_count);

        //hide previous page button by default
        document.querySelector('#previous').style.display = 'none';

        nav_button_listeners(show_page_num, page_count);

        //display page-nav for only pages that exist
        if (page_count < 3) {
            if (page_count < 2) {
                document.querySelector('#page-num-second').style.display = 'none';
            }
            document.querySelector('#page-num-third').style.display = 'none';
        }
        document.getElementById('page-num-first').style.fontWeight = "900";
        document.getElementById('page-num-first').style.textDecoration = "underline";

        create_pages(page_count, post_count, posts)
    });
}

function load_posts_profile(username_lookup) {

    console.log("load_posts_profile running");

    show_page_num = 1;

    document.querySelector('#all-posts-display').style.display = 'none';
    document.querySelector('#profile-following-display').style.display = 'block';
    document.querySelector('#follow-count-display').style.display = 'block';
    document.querySelector('#profile-name').innerHTML = username_lookup;

    fetch(`/${username_lookup}/profile`)
    .then(response => response.json())
    .then(profiles => {
        console.log(profiles);
        profiles.forEach(profile => show_follow_count(profile));
        follow_button(username_lookup, profiles);
    });
    

    fetch(`/${username_lookup}/posts`)
    .then(response => response.json())
    .then(posts => {
        console.log(posts);
        post_count = posts.length;
        page_count = Math.ceil(post_count / 10);
        console.log(`page_count is ${page_count}`);

        //hide previous page button by default
        document.querySelector('#previous').style.display = 'none';

        nav_links_display(show_page_num, page_count)
        nav_button_listeners(show_page_num, page_count);

        if (page_count < 3) {
            if (page_count < 2) {
                document.querySelector('#page-num-second').style.display = 'none';
            }
            document.querySelector('#page-num-third').style.display = 'none';
        }
        document.getElementById('page-num-first').style.fontWeight = "900";
        document.getElementById('page-num-first').style.textDecoration = "underline";

        create_pages(page_count, post_count, posts);
    });
}

function load_posts_following() {

    console.log("load_posts_following running");

    show_page_num = 1;

    document.querySelector('#all-posts-display').style.display = 'none';
    document.querySelector('#profile-following-display').style.display = 'block';
    document.querySelector('#profile-name').innerHTML = "Following";
    document.querySelector('#follow-count-display').style.display = 'none';
 

    fetch('following_posts')
    .then(response => response.json())
    .then(posts => {
        console.log(posts);
        post_count = posts.length;
        page_count = Math.ceil(post_count / 10);
        console.log(`page_count is ${page_count}`);

        //hide previous page button by default
        document.querySelector('#previous').style.display = 'none';

        nav_links_display(show_page_num, page_count);
        nav_button_listeners(show_page_num, page_count);

        if (page_count < 3) {
            if (page_count < 2) {
                document.querySelector('#page-num-second').style.display = 'none';
            }
            document.querySelector('#page-num-third').style.display = 'none';
        }
        document.getElementById('page-num-first').style.fontWeight = "900";
        document.getElementById('page-num-first').style.textDecoration = "underline";

        document.getElementById('page-num-second').style.fontWeight = "400";
        document.getElementById('page-num-second').style.textDecoration = "none";

        document.getElementById('page-num-third').style.fontWeight = "400";
        document.getElementById('page-num-third').style.textDecoration = "none";

        create_pages(page_count, post_count, posts);

    });
}

function load_posts_liked() {

    console.log("load_posts_liked running");

    show_page_num = 1;

    document.querySelector('#all-posts-display').style.display = 'none';
    document.querySelector('#profile-following-display').style.display = 'block';
    document.querySelector('#profile-name').innerHTML = "Liked Posts";
    document.querySelector('#follow-count-display').style.display = 'none';
 

    fetch('liked_posts')
    .then(response => response.json())
    .then(liked_posts => {
        console.log(liked_posts);
        post_count = liked_posts.length;
        page_count = Math.ceil(post_count / 10);
        console.log(`page_count is ${page_count}`);

        //hide previous page button by default
        document.querySelector('#previous').style.display = 'none';

        nav_links_display(show_page_num, page_count);
        nav_button_listeners(show_page_num, page_count);

        if (page_count < 3) {
            if (page_count < 2) {
                document.querySelector('#page-num-second').style.display = 'none';
            }
            document.querySelector('#page-num-third').style.display = 'none';
        }
        document.getElementById('page-num-first').style.fontWeight = "900";
        document.getElementById('page-num-first').style.textDecoration = "underline";

        document.getElementById('page-num-second').style.fontWeight = "400";
        document.getElementById('page-num-second').style.textDecoration = "none";

        document.getElementById('page-num-third').style.fontWeight = "400";
        document.getElementById('page-num-third').style.textDecoration = "none";

        create_pages(page_count, post_count, liked_posts);

    });
}

function nav_button_listeners(show_page_num, page_count) {

    if (page_count === 1) {
        document.querySelector('#next').style.display = 'none';
    }
    else {
        document.querySelector('#next').style.display = 'list-item';
    }

    //add event listener to Next button
    document.querySelector('#next').addEventListener('click', () => {
        console.log("'Next' was clicked");

        document.querySelector('#previous').style.display = 'list-item';

        if (typeof show_page_num !== 'undefined') {
            show_page_num++;
        }
        console.log(`page_count is ${page_count}`);
        nav_links_display(show_page_num, page_count)
        show_page(show_page_num, page_count);
    });

    //add event listeners to page number buttons
    page_numbers = document.getElementsByClassName('page-num');
    Array.from(page_numbers).forEach(page_number => {
        page_number.addEventListener('click', event => {
            show_page_num = event.target.innerHTML;
            console.log(show_page_num);

            nav_links_display(show_page_num, page_count)
            show_page(show_page_num, page_count);
        });
    });

    //add event listener to previous button
    document.querySelector('#previous').addEventListener('click', () => {
        console.log("'Previous' was clicked");

        document.querySelector('#next').style.display = 'list-item';

        if (typeof show_page_num !== 'undefined') {
            show_page_num--;
        }

        nav_links_display(show_page_num, page_count)
        show_page(show_page_num, page_count);
    });
}

function create_pages(page_count, post_count, posts) {

    console.log("create_pages running");
    document.getElementById('all-posts').innerHTML = "";
    pages = [];
    for (let i = 1; i <= page_count; i++) {
        new_page = document.createElement('div')
        new_page.id = `page${i}`
        pages.push(new_page);
        document.querySelector('#all-posts').append(new_page);
    }
    for (let i = 1; i <= post_count; i++) {
        show_posts(posts[i - 1], i, pages, page_count);
    }

    console.log(`${pages}`)

    //display page 1 of posts by default, and hide all other pages
    document.getElementById('page1').style.display = 'block';
    for (let j = 2; j <= page_count; j++) {
        document.getElementById(`page${j}`).style.display = 'none';
    }
}

function nav_links_display(show_page_num, page_count) {
    console.log('nav_links_display running');
    console.log(`page_count is ${page_count}`);
    console.log(`show_page_num is now ${show_page_num}`);


    if (parseInt(page_count) === 2) {

        if (parseInt(show_page_num) === 1) {
            document.querySelector('#previous').style.display = 'none';
            document.querySelector('#next').style.display = 'list-item';
            document.querySelector('#page-num-first').innerHTML = "1";
            document.querySelector('#page-num-second').innerHTML = "2";
        }

        else {
            document.querySelector('#previous').style.display = 'list-item';
            document.querySelector('#next').style.display = 'none';
            document.querySelector('#page-num-first').innerHTML = "1";
            document.querySelector('#page-num-second').innerHTML = "2";
        }

    }

    else {
        if (parseInt(show_page_num) !== 1) {
            document.querySelector('#previous').style.display = 'list-item';
        }
        else {
            document.querySelector('#previous').style.display = 'none';
            document.querySelector('#next').style.display = 'none';
        }
    
        if (parseInt(show_page_num) === parseInt(page_count)) {
            document.querySelector('#next').style.display = 'none';
            document.querySelector('#previous').style.display = 'list-item';
        }
        else {
            document.querySelector('#next').style.display = 'list-item';
        }
    
        if (parseInt(show_page_num) !== 1 && parseInt(show_page_num) !== parseInt(page_count)) {
            document.querySelector('#page-num-second').innerHTML = parseInt(show_page_num);
            document.querySelector('#page-num-first').innerHTML = parseInt(show_page_num) - 1;
            document.querySelector('#page-num-third').innerHTML = parseInt(show_page_num) + 1;
        }
    
        else if (parseInt(show_page_num) === 1) {
            document.querySelector('#previous').style.display = 'none';
            document.querySelector('#next').style.display = 'list-item';
            document.querySelector('#page-num-first').innerHTML = 1;
            document.querySelector('#page-num-second').innerHTML = 2;
            document.querySelector('#page-num-third').innerHTML = 3;
        }
    
        else {
            document.querySelector('#next').style.display = 'none';
            document.querySelector('#previous').style.display = 'list-item';
            document.querySelector('#page-num-third').innerHTML = parseInt(page_count);
            document.querySelector('#page-num-second').innerHTML = parseInt(page_count) - 1;
            document.querySelector('#page-num-first').innerHTML = parseInt(page_count) - 2;
        }
    }

    page_numbers = document.getElementsByClassName('page-num');
    Array.from(page_numbers).forEach(page_number => {
        if (parseInt(page_number.innerHTML) === parseInt(show_page_num)) {
            page_number.style.fontWeight = "900";
            page_number.style.textDecoration = "underline";
        }
        else {
            page_number.style.fontWeight = "400";
            page_number.style.textDecoration = "none";
        }
    });
}

function show_page(show_page_num, page_count) {

    for (let i = 1; i <= page_count; i++) {
        document.getElementById(`page${i}`).style.display = 'none';
    }
    document.getElementById(`page${show_page_num}`).style.display = 'block';
}

function show_posts(post, i, pages, page_count) {

    //create 'main' div (will add content to it below), and store it in a variable
    const post_display = document.createElement('div');
    post_display.id = `post${i}`;
    post_display.className = 'col-lg-10 col-md-20 col-sm-30 border';
    
    //create new element for link to profiles, add it to the 'main' div
    const post_poster = document.createElement('div');
    post_poster.className = 'post-poster';
    post_poster.innerHTML = post.poster;
    post_poster.addEventListener('click', event => {
        document.getElementById('all-posts-display').style.display = 'none';
        document.getElementById('profile-following-display').style.display = 'block';
        username_lookup = event.target.innerHTML;
        load_posts_profile(username_lookup);
    });
    post_display.append(post_poster);  

    //create new div to display post, add it to the 'main' div
    const post_body = document.createElement('div');
    post_body.id = `post-body-${post.id}`;
    post_body.className = 'post-body';
    post_body.innerHTML = post.body;
    post_display.append(post_body);

    //create new div to display timestamp, add it to the 'main' div
    const post_timestamp = document.createElement('div');
    post_timestamp.id = 'post-timestamp';
    post_timestamp.innerHTML = post.timestamp;
    post_display.append(post_timestamp);

    //create new div to display # of likes and heart icon, add it to the 'main' div
    const likes_div = document.createElement('div');
    likes_div.id = `likes-div-${post.id}`;

    const post_likes = document.createElement('div');
    post_likes.id = 'post-likes';
    post_likes.style = 'display: inline';
    post_likes.innerHTML = `Likes: ${post.likes}  `;
    
    const like_icon = document.createElement('i');
    like_icon.id = `like_icon_${post.id}`;
    if (post.liked_by.includes(current_user)) {
        like_icon.className = 'fas fa-heart red-color';
    }
    else {
        like_icon.className = 'far fa-heart red-color';
    }

    like_icon.addEventListener('click', () => {
        console.log("heart icon clicked");
        if (like_icon.className == 'far fa-heart red-color') {
            like_icon.className = 'fas fa-heart red-color';
            post.likes++;
            post_likes.innerHTML = `Likes: ${post.likes}  `;
            var post_liked_id = post.id;
            like(post_liked_id);
        }
        else {
            like_icon.className = 'far fa-heart red-color';
            post.likes--;
            post_likes.innerHTML = `Likes: ${post.likes}  `;
            var post_unliked_id = post.id;
            unlike(post_unliked_id);
        }
    })

    likes_div.append(post_likes)
    likes_div.append(like_icon);
    post_display.append(likes_div);

    if (post.poster === current_user) {
        const edit_button = document.createElement('button');
        edit_button.id = 'edit-button';
        edit_button.setAttribute('type', 'button')
        edit_button.className = `btn btn-link`;
        edit_button.innerHTML = 'Edit';
        edit_button.addEventListener('click', () => {
            console.log("edit button clicked");
            console.log(post);
            edit_button.style.display = 'none';
            edit_post(post);
        });
        post_display.append(edit_button); 
    }

    //append post to correct page 
    var page_identifier = Math.ceil(i / 10) - 1;
    pages[page_identifier].append(post_display);
}

function like(post_liked_id) {
    post_liked_id = post_liked_id.toString();
    fetch(`/${post_liked_id}/like`)
    .then(response => null);
}

function unlike(post_unliked_id) {
    post_unliked_id = post_unliked_id.toString();
    fetch(`/${post_unliked_id}/unlike`)
    .then(response => null);
}

function edit_post(post) {

    const content_div = document.getElementById(`post-body-${post.id}`);
    content_div.innerHTML = "";

    const edit_form = document.createElement('div');
    const form_input = document.createElement('input');
    form_input.setAttribute('type', 'textarea');
    form_input.setAttribute('name', 'post-body');
    text_to_edit = post.body;
    form_input.setAttribute('value', text_to_edit);
    const save_button = document.createElement('input');
    save_button.setAttribute('type', 'submit');
    save_button.setAttribute('value', 'Save');
    save_button.addEventListener('click', () => {
        const new_body = form_input.value;
        console.log(`${new_body}`);

        fetch('/', {
            method: 'PUT',
            headers: {
                'X-CSRFTOKEN': getCookie("csrftoken")
            },
            body: body = JSON.stringify({
                post_id: post.id,
                new_body: new_body,
            })
        })
        .then(() => {
            content_div.innerHTML = new_body;
            edit_form.remove()
        })
    });
    
    const cancel_button = document.createElement('input');
    cancel_button.setAttribute('type', 'submit');
    cancel_button.setAttribute('value', 'Cancel');
    cancel_button.addEventListener('click', () => {
        content_div.innerHTML = text_to_edit;
        edit_form.remove();
        document.getElementById('edit-button').style.display = 'block';
    });

    edit_form.append(form_input);
    edit_form.append(save_button);
    edit_form.append(cancel_button);
    content_div.append(edit_form);

}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length == 2) return parts.pop().split(';').shift();
}

function show_follow_count(profile) {

    document.querySelector('#followers').innerHTML = `${profile.followers}`;
    document.querySelector('#following').innerHTML = `${profile.following}`;
}

function follow(username_lookup) {

    console.log("follow running")
    fetch(`/${username_lookup}/follow`)
    .then(response => null);
}

function unfollow(username_lookup) {

    console.log("unfollow running")
    fetch(`/${username_lookup}/unfollow`)
    .then(response => null);
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

        const unfollow_button = document.createElement('button');  
        unfollow_button.id = "unfollow-button";
        unfollow_button.innerHTML = "Unfollow";
        unfollow_button.style.width = '50px';
        unfollow_button.style.height = '25px';
        profile_header = document.querySelector('#profile-name');
        profile_header.append(unfollow_button);
        unfollow_button.addEventListener('click', () => {
            document.getElementById('follow-button').style.display = 'block';
            document.getElementById('unfollow-button').style.display = 'none';
            unfollow(username_lookup);
            update_followers_unfollow();
        console.log("unfollow button created");
        });

        const follow_button = document.createElement('button');
        follow_button.id = "follow-button";    
        follow_button.innerHTML = "Follow";
        follow_button.style.width = '50px';
        follow_button.style.height = '25px';
        profile_header = document.querySelector('#profile-name');
        profile_header.append(follow_button);
        follow_button.addEventListener('click', () => {
            document.getElementById('follow-button').style.display = 'none';
            document.getElementById('unfollow-button').style.display = 'block';
            follow(username_lookup);
            update_followers();
        console.log("follow button created");
        });

        current_logged_profile.forEach(profile => {

            if (username_lookup === profile.username) {
                document.getElementById('unfollow-button').style.display = 'none';
                document.getElementById('follow-button').style.display = 'none';
            }

            else if (profile.following_usernames.includes(username_lookup)) {
                document.getElementById('unfollow-button').style.display = 'block';
                document.getElementById('follow-button').style.display = 'none';
            }

            else {
                document.getElementById('follow-button').style.display = 'block';
                document.getElementById('unfollow-button').style.display = 'none';
            }
            
        });
    });
}

