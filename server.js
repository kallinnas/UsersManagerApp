const express = require('express');
const path = require('path');
const app = express();

// Serve the static files from the Angular dist directory
app.use(express.static(path.join(__dirname, 'dist/users-manager-app')));

// Redirect all requests to the Angular app
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/users-manager-app/browser/index.html'));
});

// Start the app by listening on the default Railway port
const PORT = process.env.PORT || 4200;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
