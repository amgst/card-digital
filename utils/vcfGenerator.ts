
import { CardData } from '../types';

export const downloadVcf = (data: CardData) => {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${data.name}
ORG:${data.company}
TITLE:${data.title}
TEL;TYPE=CELL:${data.phone}
EMAIL;TYPE=INTERNET:${data.email}
URL:${data.website}
NOTE:${data.bio}
END:VCARD`;

  const blob = new Blob([vcard], { type: 'text/vcard' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${data.name.replace(/\s+/g, '_')}.vcf`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
