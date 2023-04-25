import dotenv from 'dotenv'
import Discord from 'discord.js';

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

    // 최초로 1번 공지
    channel.send(`
📅 일정 공지
정보처리기사 실기

√ 시험 접수 D-${getDateDif(process.env.EXAM_REGISTER, getToday())}
√ 시험 D-${getDateDif(process.env.EXAM_DATE, getToday())}  
    `)

    // 매일 공지
    setInterval(() => {
      channel.send(`
📅 일정 공지
정보처리기사 실기

√ 시험 접수 D-${getDateDif(process.env.EXAM_REGISTER, getToday())}
√ 시험 D-${getDateDif(process.env.EXAM_DATE, getToday())}  
      `);
    }, (1000 * 60 * 60 * 24));
  } catch (error) {
    console.error(error);
  }
});

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