import firestore from '@react-native-firebase/firestore'

export const DATA = Array.from({ length: 20 }, (_, i) => ({
  id: `${i + 1}`,
  imgSource: { uri: `https://picsum.photos/200/200?random=${i}` }, // Random image with a unique signature
  name: `Item ${i + 1}`,
}));


export const data = [
  { id: '1', heading: 'Boosted Profile Visibility: ', text: 'Stand out in searches.' },
  { id: '2', heading: 'Unlimited Messaging: ', text: 'Chat freely with matches.' },
  { id: '3', heading: 'Advanced Filters: ', text: 'Find matches based on specific criteria.' },
  { id: '4', heading: 'Profile Verification: ', text: 'Build trust with verified profiles .' },
  { id: '5', heading: 'Expert Matchmaking Help: ', text: 'Get personalized support in your search.' },
  { id: '6', heading: 'Enhanced Search Options: ', text: 'Discover matches that truly fit your perference.' },
  { id: '7', heading: 'Real-Time-Notification: ', text: 'Stay updated on message and profile views.' },
  { id: '8', heading: 'Community Engagement: ', text: 'Connect with like-minded singles in our forums.' },
];

export const getFirstName = (name: string) => {
  return name.split(' ')[0];
};

export const getUsersAge = (date_of_birth: string): number => {
  const formattedDate = date_of_birth.replace(/(\d{4})\/(\d{2})\/(\d{2})/, '$1-$2-$3');
  
  const today = new Date();
  const birthDate = new Date(formattedDate);

  if (isNaN(birthDate.getTime())) {
    throw new Error("Invalid date format");
  }
  
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

export const getTodaysDate = () => {
  const today = new Date();

  const timeZoneOffset = today.getTimezoneOffset();
  const hoursOffset = Math.floor(Math.abs(timeZoneOffset) / 60);
  const minutesOffset = Math.abs(timeZoneOffset) % 60;
  const offsetSign = timeZoneOffset > 0 ? '-' : '+';
  const formattedOffset = `${offsetSign}${String(hoursOffset).padStart(2, '0')}:${String(minutesOffset).padStart(2, '0')}`;

  const formattedDate = today.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  });

  return `${formattedDate.replace(',', '')} UTC${formattedOffset}`;
}

export const compareDate = (firstDate, secondDate) => {
  const timestamp1 = firestore.Timestamp.fromDate(new Date(firstDate));
const timestamp2 = firestore.Timestamp.fromDate(new Date(secondDate));

if (timestamp1.seconds < timestamp2.seconds) {
    return true
} else if (timestamp1.seconds > timestamp2.seconds) {
   return false
}
};