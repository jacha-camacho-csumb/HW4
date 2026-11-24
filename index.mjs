import express from 'express';
import fetch from 'node-fetch';
import si from 'systeminformation';

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

const topics = {
  operatingSystems: {
    title: 'Operating Systems',
    image: '/img/operating-systems.jpg',
    intro: 'An operating system is the main software that manages a computer or mobile device. It controls hardware resources, provides a way for people to interact with a device, and gives applications services they need to run.',
    cards: [
      ['Process management', 'The OS starts programs, gives them time to use the processor, and helps them share system resources.'],
      ['Memory management', 'It tracks memory use and assigns space to programs while helping keep their data separate.'],
      ['File management', 'It organizes files and folders and controls how programs and users access stored information.']
    ]
  },
  programmingLanguages: {
    title: 'Programming Languages',
    image: '/img/prog-lang.png',
    intro: 'Programming languages give developers a structured way to write instructions that computers can execute. Different languages are designed for different kinds of problems and development environments.',
    cards: [
      ['Readable syntax', 'Languages use rules and keywords that make instructions understandable to people.'],
      ['Different levels', 'Low-level languages work close to hardware, while high-level languages help developers work faster.'],
      ['Many uses', 'Languages can build websites, mobile apps, games, data tools, and operating systems.']
    ]
  },
  databases: {
    title: 'Databases',
    image: '/img/db.png',
    intro: 'A database is an organized collection of information. Database systems help applications store, find, update, and protect data efficiently.',
    cards: [
      ['Organization', 'Tables, documents, or other structures keep related information together.'],
      ['Queries', 'Applications use queries to find specific records and produce useful results.'],
      ['Reliability', 'Database systems help control access and preserve data when many users work at once.']
    ]
  },
  mobileApps: {
    title: 'Mobile App Development',
    image: '/img/mobile.png',
    intro: 'Mobile app development is the process of designing and building software for phones and tablets. Mobile developers consider touch input, small screens, device sensors, and changing network connections.',
    cards: [
      ['User experience', 'Mobile interfaces need clear layouts and controls that work well with touch.'],
      ['Device features', 'Apps can use cameras, location services, notifications, and other built-in features.'],
      ['Performance', 'Efficient code helps an app respond quickly while conserving battery and data.']
    ]
  }
};

function renderTopic(res, topic) {
  res.render('topic', { topic });
}

app.get('/', (req, res) => res.render('index'));
app.get('/operating-systems', (req, res) => renderTopic(res, topics.operatingSystems));
app.get('/programming-languages', (req, res) => renderTopic(res, topics.programmingLanguages));
app.get('/databases', (req, res) => renderTopic(res, topics.databases));
app.get('/mobile-app-development', (req, res) => renderTopic(res, topics.mobileApps));

// Node package: systeminformation supplies actual OS and hardware information
app.get('/package-demo', async (req, res) => {
  const [os, system, cpu, memory] = await Promise.all([
    si.osInfo(),
    si.system(),
    si.cpu(),
    si.mem()
  ]);
  res.render('package-demo', { os, system, cpu, memory });
});

// Web API:
app.get('/api-demo', async (req, res) => {
  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=36.6002&longitude=-121.8947&current=temperature_2m,relative_humidity_2m,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&timezone=America%2FLos_Angeles';
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Open-Meteo returned ${response.status}`);
    const weather = await response.json();
    res.render('api-demo', { weather });
  } catch (error) {
    res.status(500).render('error', { message: 'The weather service is temporarily unavailable.' });
  }
});

app.use((req, res) => res.status(404).render('error', { message: 'That page does not exist.' }));

app.listen(port, () => console.log(`HW4 - Express app running at http://localhost:${port}`));
