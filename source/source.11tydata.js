export default process.env.NODE_ENV === 'production'
  ? {date: 'git Last Modified'}
  : {};
