# Movie Search App

A modern React application for searching movies with user authentication and favorites functionality. Built with React, Firebase, and The Movie Database (TMDB) API.

## Features

- **Movie Search**: Search for movies using The Movie Database API
- **Movie Details**: View detailed information about movies including cast, ratings, and synopsis
- **User Authentication**: Register and login functionality with Firebase Auth
- **Favorites System**: Save and manage your favorite movies
- **Responsive Design**: Mobile-friendly interface with modern UI/UX
- **Persistent Data**: User data and favorites stored locally and in Firebase

## Technologies Used

- **Frontend**: React 18, React Router DOM
- **Backend**: Firebase (Authentication & Firestore)
- **API**: The Movie Database (TMDB) API
- **Styling**: CSS3 with modern responsive design
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager
- Firebase account and project setup
- TMDB API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/gibcou/movie-search-app.git
cd movie-search-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory and add your API keys:
```env
REACT_APP_TMDB_API_KEY=your_tmdb_api_key_here
```

4. Configure Firebase:
Update the Firebase configuration in `src/firebase.js` with your project credentials.

5. Start the development server:
```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## Available Scripts

### `npm start`
Runs the app in development mode. The page will reload when you make changes.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run build`
Builds the app for production to the `build` folder. The build is minified and optimized for best performance.

### `npm run eject`
**Note: This is a one-way operation. Once you eject, you can't go back!**

## Project Structure

```
src/
├── components/
│   ├── Header.js          # Navigation header with auth menu
│   ├── Home.js            # Main search page
│   ├── MovieCard.js       # Movie display card with favorite button
│   ├── MovieDetails.js    # Detailed movie information page
│   ├── Login.js           # User login form
│   ├── Register.js        # User registration form
│   ├── Favorites.js       # User's favorite movies page
│   └── Footer.js          # Application footer
├── contexts/
│   └── AuthContext.js     # Authentication context provider
├── firebase.js            # Firebase configuration
├── App.js                 # Main application component
└── App.css               # Application styles
```

## Features Overview

### Authentication
- User registration with email and password
- Secure login/logout functionality
- Protected routes for authenticated users
- Persistent login state

### Movie Search
- Real-time search using TMDB API
- Movie cards with posters, titles, and ratings
- Detailed movie pages with cast information
- Responsive grid layout

### Favorites System
- Add/remove movies from favorites
- Dedicated favorites page
- Persistent favorites storage
- Visual indicators for favorited movies

## API Integration

This app uses The Movie Database (TMDB) API for movie data. You'll need to:
1. Create an account at [TMDB](https://www.themoviedb.org/)
2. Generate an API key
3. Add the key to your environment variables

## Firebase Setup

The app uses Firebase for:
- User authentication
- Firestore database for user data
- Real-time data synchronization

Make sure to configure your Firebase project with:
- Authentication enabled (Email/Password provider)
- Firestore database rules configured
- Web app registered with Firebase

## Deployment

The app can be deployed to various platforms:

### Netlify/Vercel
1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Configure environment variables on the platform

### Firebase Hosting
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Login: `firebase login`
3. Initialize: `firebase init hosting`
4. Deploy: `firebase deploy`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Built with ❤️ using React and Firebase**
