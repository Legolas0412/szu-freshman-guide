import feiniaoStorefront from './assets/feiniao-storefront.jpg';
import feiniaoTable from './assets/feiniao-table.jpg';
import feiniaoDishes from './assets/feiniao-dishes.jpg';
import lidongLounge from './assets/lidong-yuehai-lounge.jpg';
import lidongStrength from './assets/lidong-yuehai-strength.jpg';
import lidongCardio from './assets/lidong-yuehai-cardio.jpg';
import lidongLogo from './assets/lidong-logo.png';
import lidongVideo from './assets/lidong-yuehai-tour.mp4';
import hongyiReadingRoom from './assets/hongyi-reading-room.jpg';
import hongyiExterior from './assets/hongyi-exterior.jpg';
import hongyiStudyArea from './assets/hongyi-study-area.jpg';

const assetUrl = (asset: string | { src: string }) => typeof asset === 'string' ? asset : asset.src;

export type MerchantCategory = '餐饮' | '运动娱乐' | '书香';

export type MerchantSample = {
  id: string;
  category: MerchantCategory;
  name: string;
  english: string;
  summary: string;
  scenes: string[];
  address: string;
  hours: string;
  phones?: string[];
  featured?: boolean;
  isSample?: boolean;
  previewImage?: string;
  video?: string;
  image: string;
  imageAlt: string;
  galleryImages?: { src: string; alt: string }[];
  details: string[];
};

export const merchantSamples: MerchantSample[] = [
  {
    id: 'feiniao-night-market',
    category: '餐饮',
    name: '飞鸟夜市·台湾小馆（南海明珠店）',
    english: 'TAIWAN BISTRO · NANHAI MINGZHU',
    summary: '想吃一顿热乎的台湾家常味，或和朋友轻松聚一聚，都可以来这里坐坐。',
    scenes: ['台湾料理', '家庭食堂', '朋友小聚'],
    address: '南山区南光路 75 号南海明珠 104C · 南山站 E1 口步行约 710 米',
    hours: '周二至周日 11:00—15:00、17:00—22:30',
    phones: ['18138879842', '13425436330'],
    featured: true,
    isSample: false,
    image: assetUrl(feiniaoStorefront),
    imageAlt: '飞鸟夜市台湾小馆南海明珠店门面',
    galleryImages: [
      { src: assetUrl(feiniaoStorefront), alt: '飞鸟夜市台湾小馆南海明珠店门面' },
      { src: assetUrl(feiniaoTable), alt: '飞鸟夜市台湾小馆餐点组合' },
      { src: assetUrl(feiniaoDishes), alt: '飞鸟夜市台湾小馆台湾风味餐点' },
    ],
    details: [
      '这里主打台湾家常料理与夜市风味，午餐、晚餐或朋友小聚都很合适。',
      '可以尝尝云朵卤肉饭、鸡腿饭、台湾香肠、盐酥小食，再搭配一杯饮品。',
      '木色空间配上暖光和绿植，氛围轻松，适合慢慢吃饭、自在聊天。',
      '饭点可能需要等位，出发前可以电话问问座位和当日餐点。',
      '餐厅位于南海明珠一层，从地铁南山站 E1 口步行约 710 米。',
      '周一通常休息，实际营业状态和当日供应以餐厅现场为准。',
    ],
  },
  {
    id: 'lidong-fitness-yuehai',
    category: '运动娱乐',
    name: '力动健身（粤海店）',
    english: 'LIDO FITNESS · YUEHAI',
    summary: '粤海校区周边的综合训练空间，配有有氧、力量和单功能器械区域。',
    scenes: ['有氧训练', '力量训练', '器械训练'],
    address: '阳光粤海大厦 4 楼 401 · 粤海门站 D2 口步行约 420 米',
    hours: '每日 10:00—22:00',
    phones: ['13726275989', '17722690184'],
    featured: true,
    isSample: false,
    previewImage: assetUrl(lidongLogo),
    video: assetUrl(lidongVideo),
    image: assetUrl(lidongStrength),
    imageAlt: '力动健身粤海店力量器械区',
    galleryImages: [
      { src: assetUrl(lidongLounge), alt: '力动健身粤海店休息区' },
      { src: assetUrl(lidongStrength), alt: '力动健身粤海店力量器械区' },
      { src: assetUrl(lidongCardio), alt: '力动健身粤海店临窗有氧区' },
      { src: assetUrl(lidongLogo), alt: '力动健身品牌标识' },
    ],
    details: [
      '有氧区配有椭圆机和跑步机，适合热身、心肺训练和日常慢跑。',
      '力量区配有自由深蹲架、史密斯架、卧推架、龙门架和坐姿高位下拉器。',
      '单功能器械区包含坐姿推胸器、坐姿推肩器、臀部训练器和蝴蝶机。',
      '店内另设淋浴间，支持按月付费，并有多名专业教练。',
      '门店配有史密斯机。具体开放情况、教练排班与器械使用安排请以门店现场信息为准。',
    ],
  },
  {
    id: 'nanshan-study-hongyi',
    category: '书香',
    name: '南山书房·弘毅阁（荔香公园）',
    english: 'NANSHAN STUDY · HONGYI PAVILION',
    summary: '藏在荔香公园里的安静阅读空间，适合自习、备考、阅读和短暂放空。',
    scenes: ['安静自习', '阅读充电', '备考复习'],
    address: '荔香公园西门公交站旁（荔香公园南站）· 南头古城站 E3 口步行约 430 米',
    hours: '周一至周日 08:00—23:00',
    phones: ['13043435621'],
    featured: true,
    isSample: false,
    image: assetUrl(hongyiReadingRoom),
    imageAlt: '南山书房弘毅阁室内阅读空间',
    galleryImages: [
      { src: assetUrl(hongyiReadingRoom), alt: '南山书房弘毅阁室内阅读空间' },
      { src: assetUrl(hongyiExterior), alt: '荔香公园内的南山书房弘毅阁外景' },
      { src: assetUrl(hongyiStudyArea), alt: '南山书房弘毅阁自习区域' },
    ],
    details: [
      '空间设有长桌、独立学习位和阶梯阅读区，可以阅读、自习，也适合集中准备考试。',
      '室内以暖光和浅色书架为主，窗外连接公园绿意，学习间隙也能到户外走走。',
      '热门时段座位可能紧张，建议提前了解预约要求并合理安排到访时间。',
      '书房靠近荔香公园西门公交站，从地铁 12 号线南头古城站 E3 口步行约 430 米。',
      '开放时间与预约规则可能调整，请以书房当日安排为准。',
    ],
  },
];
