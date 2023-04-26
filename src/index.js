import dotenv from 'dotenv'
import Discord from 'discord.js';
import dataset from './data.json' assert { type: "json" };
import cron from 'node-cron';

// dotenv 로드
dotenv.config();

// client 인스턴스 생성
const client = new Discord.Client({ intents: ['Guilds', 'GuildMessages'] });
client.login(process.env.DISCORD_TOKEN);

// ready 이벤트 발생시
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  try {
    const channel = client.channels.cache.get(process.env.DISCORD_CHANNEL_ID);

    // 스케줄러로 설정 시간에 공지
    dataset.map(data => {
      cron.schedule(data.cronExp ?? '0 0 9 * * *', () => {
        channel.send(genDdayMessage(data))
      });
    });
  } catch (error) {
    console.error(error);
  }
});

//#region 메시지 출력 utils function
function genDdayMessage(info = {}) {
  const { title, description, date, text, icon } = info;
  const str = `
${title ?? '📅 일정 공지'}
${description}
  
${ 
  Array.isArray(date) ? 
  genDdayList(date) : 
  `${icon ? `${icon} `: ''}${text} D-${getDateDif(date, getToday())}`
}
`;
  return str;
}

function genDdayList(dateList = []) {
  return dateList.map(({ text, date, icon }) => 
      `${icon ? `${icon} `: ''}${text} D-${getDateDif(date, getToday())}`)
      .join('\n');
}
//#endregion

//#region 시간 계산 utils function
function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getDateTime(date) {
  return new Date(date).getTime();
}

function getDateDif(first, second) {
  if (!first || !second) {
    return 0;
  }
  return Math.abs((getDateTime(first) - getDateTime(second)) / (1000 * 60 * 60 * 24));
}
//#endregion