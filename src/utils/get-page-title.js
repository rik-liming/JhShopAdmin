import defaultSettings from '@/settings';

const title = defaultSettings.title || '嘉禾后台';

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return `${title}`;
}
