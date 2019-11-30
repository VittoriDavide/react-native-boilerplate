import dark from './dark';
import light from './light';

const theme = mode => (mode === 'dark' ? dark : light);
export default theme;
