const isProduction = process.env.NODE_ENV === 'production';

export default isProduction ? {date: 'git Last Modified'} : {};
