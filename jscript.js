// Constants
const addMovieForm = document.getElementById('addMovieForm');
const titleInput = document.getElementById('title');
const castInput = document.getElementById('cast');
const movieList = document.getElementById('movieList');
const getMoviesButton = document.getElementById('getMoviesButton');
const deleteMoviesButton = document.getElementById('deleteMoviesButton');
const successMessage = document.getElementById('successMessage');

// Event listeners
addMovieForm.addEventListener('submit', handleAddIconClick);
getMoviesButton.addEventListener('click', handleGetMovies);
deleteMoviesButton.addEventListener('click', handleDeleteMovies);


// Add this line to your JavaScript code to create and display the "Add" icon:
const addIconPlaceholder = document.getElementById('addIconPlaceholder');
createAddIcon(addIconPlaceholder);


// Functions
async function handleAddIconClick(e) {
    e.preventDefault();
    const title = titleInput.value;
    const cast = castInput.value;

    try {
        const response = await fetch('http://localhost:8080/api/create_movie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, cast }),
        });

        if (response.ok) {
            titleInput.value = '';
            castInput.value = '';
            loadMovies();
            displaySuccessMessage('Movie added successfully!');
        } else {
            handleRequestError(response);
        }
    } catch (error) {
        console.error('Error adding movie:', error);
    }
console.log('Add icon clicked');
}

async function handleGetMovies() {
    loadMovies();
    displaySuccessMessage('Movies fetched successfully!');
}

async function handleDeleteMovies() {
    try {
        const response = await fetch('http://localhost:8080/api/movie', {
            method: 'GET',
        });

        if (response.ok) {
            loadMovies(true); // Show delete buttons
            displaySuccessMessage('Which Movie you want to delete?');
        } else {
            handleRequestError(response);
        }
    } catch (error) {
        console.error('Error deleting movies:', error);
    }
}

async function loadMovies(showDeleteButtons = false) {
    try {
        const response = await fetch('http://localhost:8080/api/movie');

        if (response.ok) {
            const data = await response.json();
            renderMovies(data.data, showDeleteButtons);
        } else {
            handleRequestError(response);
        }
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

function renderMovies(movies, showDeleteButtons) {
    movieList.innerHTML = '';
    movies.forEach((movie) => {
        const li = document.createElement('li');
        const bulletIcon = createBulletIcon();

        // Create a span for movie info
        const movieInfo = document.createElement('span');
        movieInfo.innerHTML = `<strong><em>Title:</strong> ${movie.Title}&nbsp;&nbsp;&nbsp;<strong>Cast:</strong> ${movie.Cast}</em>`;
        li.appendChild(bulletIcon);        
        li.appendChild(movieInfo);
        

        if (showDeleteButtons) {
            const binIcon = createDeleteIcon(movie.ID);
            li.appendChild(binIcon);
        }

        movieList.appendChild(li);
    });
}

function createAddIcon(id) {
    const addIcon = document.createElement('img');
    addIcon.src = 'add.png';
    addIcon.alt = 'Add';
    addIcon.className = 'add-icon';
    addIcon.style.marginLeft = '5px'
    addIcon.style.width = '18px'
    addIcon.style.height = '16px'
    addIcon.addEventListener('click', handleAddIconClick);
    addIconPlaceholder.appendChild(addIcon);   
}

function createBulletIcon() {
    const bulletIcon = document.createElement('img');
    bulletIcon.src = 'bullet-point.png';
    bulletIcon.alt = 'Bullet';
    bulletIcon.className = 'bullet-point';
    return bulletIcon;
}

function createDeleteIcon(id) {
    const binIcon = document.createElement('img');
    //binIconContainer.style.display = 'flex';
    //binIcon.style.justifyContent = 'flex-end';
    binIcon.src = 'bin.png'; // Replace with the actual path to your bin icon image
    binIcon.alt = 'Bin';
    binIcon.className = 'delete-icon';
    
    binIcon.addEventListener('click', () => deleteMovie(id));
    return binIcon;
}

async function deleteMovie(id) {
    try {
        const response = await fetch(`http://localhost:8080/api/delete_movie/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            displaySuccessMessage('Movie deleted successfully!');
            loadMovies(true);
        } else {
            handleRequestError(response);
        }
    } catch (error) {
        console.error('Error deleting movie:', error);
    }
}
let successMessageTime;
function displaySuccessMessage(message) {
    clearTimeout(successMessageTime);   //clears previous msg time

    successMessage.textContent = message;
    successMessage.style.display = 'block';
    successMessage.style.fontSize = "18px";
    successMessage.style.marginTop = '10px';
    successMessageTime = setTimeout(() => {
        successMessage.style.display = 'none';
    }, 2000);
}

function handleRequestError(response) {
    console.error(`Request failed. Status: ${response.status}`);
    response.text().then((errorText) => {
        console.error('Error message:', errorText);
    });
}

// delete icon hover func
// Select all delete icons
const deleteIcons = document.querySelectorAll('.delete-icon');

// Add event listeners for hover
deleteIcons.forEach((deleteIcon) => {
    deleteIcon.addEventListener('mouseenter', () => {
        // Get the associated input IDs from the data attribute
        const associatedInputIds = deleteIcon.getAttribute('data-inputs').split(' ');

        // Change the background of the associated inputs
        associatedInputIds.forEach((inputId) => {
            const inputElement = document.getElementById(inputId);
            inputElement.style.backgroundColor = '#757573'; // Change to the desired background color
        });
    });

    deleteIcon.addEventListener('mouseleave', () => {
        // Get the associated input IDs from the data attribute
        const associatedInputIds = deleteIcon.getAttribute('data-inputs').split(' ');

        // Restore the background of the associated inputs
        associatedInputIds.forEach((inputId) => {
            const inputElement = document.getElementById(inputId);
            inputElement.style.backgroundColor = '#fff'; // Reset to default background color
        });
    });
});
