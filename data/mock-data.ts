import {
  DiaryEntry,
  Family,
  FamilyLocation,
  FamilyReportThread,
  HomeShortcut,
  Message,
  PlaceRegistration,
  Profile,
  ScheduleItem,
  User
} from "@/types/domain";

export const users: User[] = [
  { id: "u1", email: "mama@example.com", name: "美咲" },
  { id: "u2", email: "papa@example.com", name: "健太" },
  { id: "u3", email: "haru@example.com", name: "はる" },
  { id: "u4", email: "grandma@example.com", name: "和子" }
];

export const profiles: Profile[] = [
  {
    userId: "u1",
    name: "美咲",
    familyRole: "親",
    avatar: "M",
    organization: "みどり保育園",
    activities: ["夕飯担当", "週末の買い出し"],
    bio: "帰宅が少し遅い日は、先に食べていて大丈夫です。",
    status: "今日は在宅ワーク",
    accentColor: "bg-blush"
  },
  {
    userId: "u2",
    name: "健太",
    familyRole: "親",
    avatar: "K",
    organization: "青葉商事",
    activities: ["保育園送迎", "ゴミ出し"],
    bio: "急ぎの連絡は予定カードにしてくれると助かります。",
    status: "19:00 ごろ帰宅予定",
    accentColor: "bg-sky"
  },
  {
    userId: "u3",
    name: "はる",
    familyRole: "子",
    avatar: "H",
    organization: "ひかり中学校 2年",
    activities: ["バスケ部", "英会話"],
    bio: "部活の連絡はテンプレで送るね。",
    status: "放課後は部活です",
    accentColor: "bg-mint"
  },
  {
    userId: "u4",
    name: "和子",
    familyRole: "祖父母",
    avatar: "W",
    organization: "自宅",
    activities: ["夕方見守り", "日記リアクション係"],
    bio: "みんなの様子が見られるのが楽しみです。",
    status: "今日は通院のあと家にいます",
    accentColor: "bg-lavender"
  }
];

export const family: Family = {
  id: "f1",
  name: "さくら家",
  inviteCode: "SAKURA72",
  members: [
    { id: "fm1", familyId: "f1", userId: "u1", roleLabel: "親", relationLabel: "お母さん" },
    { id: "fm2", familyId: "f1", userId: "u2", roleLabel: "親", relationLabel: "お父さん" },
    { id: "fm3", familyId: "f1", userId: "u3", roleLabel: "子", relationLabel: "長女" },
    { id: "fm4", familyId: "f1", userId: "u4", roleLabel: "祖父母", relationLabel: "おばあちゃん" }
  ]
};

export const messages: Message[] = [
  {
    id: "m1",
    familyId: "f1",
    authorId: "u1",
    category: "ご飯",
    body: "今夜は鮭のホイル焼きとお味噌汁です。19:15ごろに用意できます。",
    createdAt: "18:05",
    readBy: ["u2", "u3"],
    templateType: "meal",
    templatePayload: {
      title: "今日のご飯",
      fields: [
        { label: "メニュー", value: "鮭のホイル焼き / ほうれん草のおひたし / お味噌汁" },
        { label: "食べ始め", value: "19:15" },
        { label: "連絡", value: "温め直しできるので遅くても大丈夫" }
      ]
    }
  },
  {
    id: "m2",
    familyId: "f1",
    authorId: "u3",
    category: "部活・習い事",
    body: "部活が30分のびたので、帰るのは18:40くらいです。",
    createdAt: "16:55",
    readBy: ["u1", "u4"],
    templateType: "activity",
    templatePayload: {
      title: "部活・習い事の共有",
      fields: [
        { label: "内容", value: "バスケ部 練習試合前の延長練習" },
        { label: "終了予定", value: "18:10" },
        { label: "帰宅予定", value: "18:40" }
      ]
    }
  },
  {
    id: "m3",
    familyId: "f1",
    authorId: "u2",
    category: "買い物",
    body: "牛乳とバナナ、洗剤を帰りに買っていきます。",
    createdAt: "15:20",
    readBy: ["u1", "u4"]
  },
  {
    id: "m4",
    familyId: "f1",
    authorId: "u4",
    category: "家事",
    body: "洗濯物は取り込んであります。雨が降りそうだったので先にやっておきました。",
    createdAt: "14:10",
    readBy: ["u1", "u2", "u3"],
    templateType: "chore",
    templatePayload: {
      title: "家事連絡",
      fields: [
        { label: "対応", value: "洗濯物の取り込み" },
        { label: "状況", value: "たたむ前の状態で和室に置いてあります" }
      ]
    }
  }
];

export const schedules: ScheduleItem[] = [
  {
    id: "s1",
    familyId: "f1",
    title: "はる バスケ部",
    date: "4/12",
    dateValue: "2026-04-12",
    startTime: "16:00",
    endTime: "18:10",
    ownerId: "u3",
    placeId: "p2",
    type: "個人",
    sourceMessageId: "m2",
    note: "練習試合前で延長あり"
  },
  {
    id: "s2",
    familyId: "f1",
    title: "家族で夕飯",
    date: "4/12",
    dateValue: "2026-04-12",
    startTime: "19:15",
    endTime: "20:00",
    type: "家族",
    placeId: "p1",
    sourceMessageId: "m1"
  },
  {
    id: "s3",
    familyId: "f1",
    title: "和子さん 通院",
    date: "4/13",
    dateValue: "2026-04-13",
    startTime: "10:00",
    endTime: "11:30",
    ownerId: "u4",
    placeId: "p5",
    type: "個人"
  },
  {
    id: "s4",
    familyId: "f1",
    title: "週末の買い出し",
    date: "4/13",
    dateValue: "2026-04-13",
    startTime: "15:00",
    endTime: "16:00",
    ownerId: "u2",
    placeId: "p4",
    type: "家族"
  }
];

export const places: PlaceRegistration[] = [
  { id: "p1", familyId: "f1", name: "さくら家", category: "その他", address: "東京都世田谷区...", lat: 35.646, lng: 139.653, color: "bg-orange" },
  { id: "p2", familyId: "f1", name: "ひかり中学校", category: "学校", address: "東京都世田谷区...", lat: 35.648, lng: 139.66, color: "bg-mint" },
  { id: "p3", familyId: "f1", name: "スマイル英会話", category: "習い事", address: "東京都世田谷区...", lat: 35.644, lng: 139.658, color: "bg-lavender" },
  { id: "p4", familyId: "f1", name: "駅前スーパー", category: "その他", address: "東京都世田谷区...", lat: 35.642, lng: 139.649, color: "bg-sky" },
  { id: "p5", familyId: "f1", name: "みどりクリニック", category: "その他", address: "東京都世田谷区...", lat: 35.65, lng: 139.646, color: "bg-blush" }
];

export const familyLocations: FamilyLocation[] = [
  { id: "l1", userId: "u1", label: "自宅付近", updatedAt: "5分前", placeId: "p1" },
  { id: "l2", userId: "u2", label: "会社から移動中", updatedAt: "12分前" },
  { id: "l3", userId: "u3", label: "ひかり中学校 体育館", updatedAt: "3分前", placeId: "p2" },
  { id: "l4", userId: "u4", label: "みどりクリニック付近", updatedAt: "9分前", placeId: "p5" }
];

export const diaryEntries: DiaryEntry[] = [
  {
    id: "d1",
    familyId: "f1",
    authorId: "u3",
    date: "2026-04-12",
    mood: "がんばった",
    visibility: "family",
    todayStory: "部活で3ポイントシュートが2回入ってうれしかったです。",
    happyMoment: "友だちと帰り道に新しいパン屋さんを見つけたこと。",
    concern: "数学の宿題がまだ終わっていません。",
    messageToFamily: "夕飯のあと少しだけ一緒に見てくれるとうれしいです。",
    reactions: [
      { id: "r1", entryId: "d1", userId: "u1", emoji: "👏" },
      { id: "r2", entryId: "d1", userId: "u4", emoji: "😊" }
    ]
  },
  {
    id: "d2",
    familyId: "f1",
    authorId: "u4",
    date: "2026-04-11",
    mood: "おだやか",
    visibility: "guardians",
    todayStory: "病院の帰りに桜がまだ少し咲いていて春らしい気分でした。",
    happyMoment: "みんなの予定が見えて安心できたこと。",
    concern: "午後は少し疲れたので、明日はゆっくりします。",
    messageToFamily: "夜はあたたかくして過ごしてね。",
    reactions: [
      { id: "r3", entryId: "d2", userId: "u2", emoji: "🌸" },
      { id: "r4", entryId: "d2", userId: "u3", emoji: "🫶" }
    ]
  }
];

export const familyReports: FamilyReportThread[] = [
  {
    id: "fr1",
    familyId: "f1",
    kind: "ご飯連絡",
    title: "今夜のご飯 参加確認",
    summary: "ご飯ができた連絡に対して、食べる・取り置き・いらないの返答をツリーで確認しています。",
    status: "進行中",
    createdAt: "18:08",
    requiresResponse: true,
    actions: [
      {
        id: "fra1",
        authorId: "u1",
        label: "ご飯できました",
        body: "19:15から食べられます。遅い人は取り置きできます。",
        createdAt: "18:08",
        tone: "info"
      },
      {
        id: "fra2",
        parentId: "fra1",
        authorId: "u3",
        label: "取り置き希望",
        body: "部活がのびたので先に取っておいてください。",
        createdAt: "18:11",
        tone: "response"
      },
      {
        id: "fra3",
        parentId: "fra2",
        authorId: "u1",
        label: "対応済み",
        body: "了解です。温め直しできるようにしておきます。",
        createdAt: "18:12",
        tone: "done"
      }
    ]
  },
  {
    id: "fr2",
    familyId: "f1",
    kind: "外泊届",
    title: "土曜の外泊届",
    summary: "友だち宅への宿泊希望。保護者確認と送迎時間の整理が必要です。",
    status: "確認待ち",
    createdAt: "17:30",
    requiresResponse: true,
    actions: [
      {
        id: "frb1",
        authorId: "u3",
        label: "外泊希望",
        body: "土曜に美咲ちゃんの家へ泊まってもいいですか。朝の部活集合が早いです。",
        createdAt: "17:30",
        tone: "request"
      },
      {
        id: "frb2",
        parentId: "frb1",
        authorId: "u2",
        label: "確認中",
        body: "連絡先と送迎時間を確認して返事します。",
        createdAt: "17:42",
        tone: "response"
      }
    ]
  },
  {
    id: "fr3",
    familyId: "f1",
    kind: "欠食届",
    title: "お父さんの欠食届",
    summary: "会食で夕飯不要。ご飯量の調整に使える家庭内届出です。",
    status: "完了",
    createdAt: "12:10",
    requiresResponse: false,
    actions: [
      {
        id: "frc1",
        authorId: "u2",
        label: "夕飯不要",
        body: "今日は会食があるので夕飯はいりません。",
        createdAt: "12:10",
        tone: "info"
      },
      {
        id: "frc2",
        parentId: "frc1",
        authorId: "u1",
        label: "了解",
        body: "ありがとう。1人分減らして準備します。",
        createdAt: "12:18",
        tone: "done"
      }
    ]
  }
];

export const shortcuts: HomeShortcut[] = [
  { id: "sc1", label: "報連相を出す", description: "欠食届や外泊届をツリーで共有", href: "/reports" },
  { id: "sc2", label: "予定を追加", description: "学校や通院予定を記録", href: "/calendar" },
  { id: "sc3", label: "ご飯を投稿", description: "今日のご飯をテンプレで共有", href: "/messages" },
  { id: "sc4", label: "場所を確認", description: "家族の位置と登録地点を見る", href: "/locations" }
];
