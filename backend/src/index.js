import app from './app';

const PORT = parseInt(process.env.PORT, 10) || 3000;
app.listen(PORT, () => {
  console.log('Server listening on port', PORT);
});
