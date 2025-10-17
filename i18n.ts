import {getRequestConfig} from 'next-intl/server';

export default getRequestConfig(async ({locale}) => {
  try {
    const messages = (await import(`./messages/${locale}.json`)).default;
    return {messages};
  } catch (error) {
    const fallback = (await import('./messages/uz.json')).default;
    return {messages: fallback};
  }
});



