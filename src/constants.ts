import { Cell } from './types';

export const BOARD_SIZE = 40;

export const TUQAY_HEROES = [
  { title: "Бүреләр", description: "Бүреләрдән качканда адаштыгыз! Бер адым артка.", move: -1, image: "https://i.ibb.co/pvZ8Zm3j/photo-2026-04-01-09-14-41-jpg-202604010917.jpg" },
  { title: "Су анасы", description: "Су анасын тараксыз калдырмакчы идегеземе? 2 адым артка.", move: -2, image: "https://i.ibb.co/0ygkTtqJ/imresizer-ph-02.jpg" },
  { title: "Шүрәле", description: "Шүрәле белән кети-кети уйныйсыз! 3 адым артка.", move: -3, image: "https://i.ibb.co/qYyg9QbW/photo-2026-04-01-09-14-41-jpg-202604010920.jpg" },
  { title: "Акбай", description: "Акбай сезне куа башлады! 2 шакмакка артка.", move: -2, image: "https://i.ibb.co/93qbNMYJ/photo-2026-04-01-09-14-41-jpg-202604011204.jpg" },
  { title: "Дию", description: "Дию пәрие сезне су төбенә төшерде! 4 шакмакка артка.", move: -4, image: "https://i.ibb.co/svb0Z57P/photo-2026-04-01-09-14-41-jpg-202604011206.jpg" },
  { title: "Кисекбаш", description: "Куркыныч Кисекбаш! 5 шакмакка артка.", move: -5, image: "https://i.ibb.co/cPt477K/photo-2026-04-01-09-14-41-jpg-202604010924.jpg" },
  { title: "Күбәләк", description: "Күбәләк артыннан йөгереп киттегез! 1 шакмакка артка.", move: -1, image: "https://i.ibb.co/322F1Gg/photo-2026-04-01-09-14-41-jpg-202604011211.jpg" },
  { title: "Шаян песи", description: "Песи сезне тырнады! 3 шакмакка артка.", move: -3, image: "https://i.ibb.co/zTY9R3cS/photo-2026-04-01-09-14-41-jpg-202604011227.jpg" },
  { title: "Өй иясе", description: "Өй иясе сезне куркытты! 2 шакмакка артка.", move: -2, image: "https://i.ibb.co/Y4pDCYYx/photo-2026-04-01-09-14-41-jpg-202604011225-1.jpg" },
  { title: "Cәгъди абзый", description: "Кырда эшләргә калдыгыз! 3 шакмакка артка.", move: -3, image: "https://i.ibb.co/bM864dHf/photo-2026-04-01-09-14-41-jpg-202604011225.jpg" },
];

export const TUQAY_QUESTIONS = [
  { q: "Тукай кайда туган?", a: ["Кушлавыч", "Казан", "Уральск"], correct: 0 },
  { q: "Тукай ничәнче елда туган?", a: ["1886", "1890", "1875"], correct: 0 },
  { q: "Тукай ничә яшендә вафат булган?", a: ["27", "33", "45"], correct: 0 },
  { q: "Тукайның туган көне кайчан?", a: ["26 апрель", "30 август", "15 октябрь"], correct: 0 },

  { q: "Тукайның әнисе исеме?", a: ["Айбану, Бибимәмдүдә", "Гайшә"], correct: 0 },
  { q: "Тукайның әтисе кем булган?", a: ["Мулла", "Укытучы", "Крестьян"], correct: 0 },
  { q: "Габдулла Тукайга балачакта ничек иркәләп эндәшкәннәр?", a: ["Апуш", "Габдуллаҗан", "Тукай"], correct: 0 },

  { q: "Тукайның балачагы узган авыл?", a: ["Кырлай", "Кушлавыч", "Өчиле"], correct: 0 },
  { q: "Кырлайда Тукайны кем тәрбияләгән?", a: ["Сәгъди", "Әхмәт", "Гали"], correct: 0 },
  { q: "Тукай соңгы елларын кайда уздырган?", a: ["Казан", "Мәскәү", "Уфа"], correct: 0 },
  { q: "Тукайның беренче шигыре кайда басылган?", a: ["Уральск", "Казан", "Петербург"], correct: 0 },

  { q: "Татар теленең гимны булган шигыре?", a: ["Туган тел", "Бәйрәм", "Кыш"], correct: 0 },
  { q: "Тукайның 'Пар ат' шигыре нәрсә турында?", a: ["Казанга кайту", "Урман", "Мәхәббәт"], correct: 0 },
  { q: "\"Пар ат\" әсәрендә Казан ничек сурәтләнә?", a: ["Нурлы Казан", "Караңгы шәһәр", "Ят җир"], correct: 0 },

  { q: "Тукай иҗат иткән урман җене ничек атала?", a: ["Шүрәле", "Су анасы", "Кисекбаш"], correct: 0 },
  { q: "Су анасы турында әкият кайсы җирдә бара?", a: ["Кырлай", "Казан", "Арча"], correct: 0 },

  { q: "Тукай катнашкан көлкеле журнал ничек атала?", a: ["«Ялт-Йолт»", "«Казан»", "«Мәгариф»"], correct: 0 },

  { q: "Тукайның дусты композитор кем?", a: ["Салих Сәйдәшев", "Нәҗип Җиһанов", "Заһид Хәбибуллин"], correct: 0 },
  { q: "«Шүрәле» балетына музыканы кем язган?", a: ["Фәрит Яруллин", "Рөстәм Яхин", "Әнвәр Бакиров"], correct: 0 },

  // 🔥 НОВЫЕ ВОПРОСЫ

  { q: "Тукай нинди әдәби юнәлештә иҗат иткән?", a: ["Реализм", "Фантастика", "Детектив"], correct: 0 },
  { q: "Тукай кайсы телдә иҗат иткән?", a: ["Татар", "Рус", "Төрек"], correct: 0 },
  { q: "Тукайның әсәрләрендә төп тема нәрсә?", a: ["Халык тормышы", "Космос", "Техника"], correct: 0 },
  { q: "Тукай кайсы шәһәрдә укыган һәм эшләгән?", a: ["Уральск", "Мәскәү", "Киев"], correct: 0 },
  { q: "Тукайның шигырьләре күбрәк нинди була?", a: ["Тәрбияви", "Фәнни", "Спорт турында"], correct: 0 },
  { q: "Тукайның әсәрләре кемнәр өчен дә язылган?", a: ["Балалар һәм олылар", "Тик галимнәр өчен", "Тик спортчылар өчен"], correct: 0 },
  { q: "Тукай нинди жанрларда иҗат иткән?", a: ["Шигырь, әкият", "Роман гына", "Фильмнар"], correct: 0 },
  { q: "Тукайның иҗаты нәрсәгә зур йогынты ясаган?", a: ["Татар әдәбиятына", "Математикага", "Спортка"], correct: 0 },
  { q: "Тукай кайсы хастаханәдә дәваланган?", a: ["Клячкин больницасы", "Земство хастаханәсе", "Хәрби госпиталь"], correct: 0 },

  { q: "Тукай кайсы кунакханәдә яшәгән?", a: ["«Болгар» кунакханәсе", "«Казан» кунакханәсе", "«Идел» кунакханәсе"], correct: 0 },

  { q: "«Болгар» кунакханәсе кайсы шәһәрдә урнашкан?", a: ["Казан", "Уфа", "Оренбург"], correct: 0 },

  { q: "Тукайның сәламәтлеге нинди авыру аркасында какшаган?", a: ["Үпкә авыруы", "Йөрәк авыруы", "Грипп"], correct: 0 },

  { q: "Тукай кайсы зиратта җирләнгән?", a: ["Яңа бистә зираты", "Арча зираты", "Кырлай зираты"], correct: 0 },

  { q: "Тукай кайсы газеталарда эшләгән?", a: ["«Әл-ислах»", "«Вакыт»", "Нур"], correct: 0 },

  { q: "Тукай Казанга кайчан күчеп килә?", a: ["1907", "1895", "1915"], correct: 0 },

];

export const BACKUP_QUESTIONS = [
  { q: "Тукайның фамилиясе нинди?", a: ["Тукаев", "Мөхәммәтҗанов", "Габдуллин"], correct: 0 },
  { q: "Тукайның 'Милли моңнар' шигыре нәрсә турында?", a: ["Халык язмышы", "Табигать", "Мәктәп"], correct: 0 },
  { q: "Тукайның 'Бала белән Күбәләк' шигырендә бала нәрсә сорый?", a: ["Ничек яшисең?", "Кая очасың?", "Нәрсә ашыйсың?"], correct: 0 },
  { q: "Тукайның 'Кәҗә белән Сарык' әкиятендә алар нәрсә таба?", a: ["Бүре башы", "Алтын", "Ашамлык"], correct: 0 },
  { q: "Тукайның 'Шурале' әкиятендә Былтыр каян килә?", a: ["Авылдан", "Шәһәрдән", "Урманнан"], correct: 0 },
  { q: "Г. Тукайның Кырлай авылында яшәгән йорты хәзер нинди вазифа башкара?", a: ["Музей", "Мәктәп", "Китапханә"], correct: 0 },
  { q: "Тукайның «Кәҗә белән Сарык» әкиятендә дуслар нәрсә пешерәләр?", a: ["Ботка", "Аш", "Ипи"], correct: 0 },
  { q: "«Су анасы» әкиятендә малай алтын таракны көннең кайсы вакытында таба?", a: ["Көн уртасында", "Төнлә", "Иртән"], correct: 0 },
  { q: "Г. Тукай вафатыннан соң Казанның кайсы зиратында җирләнгән?", a: ["Яңа Татар бистәсе зиратында", "Иске Татар бистәсе зиратында", "Арча зиратында"], correct: 0 },
  { q: "Шагыйрьнең «Милли моңнар» әсәрендә татар халкының нинди милли җыры искә алына?", a: ["«Әллүки»", "«Тәфтиләү»", "«Кара урман»"], correct: 0 },
  { q: "Тукайның «Кызыклы шәкерт» шигырендә Акбай нинди хәрәкәт ясарга өйрәнә?", a: ["Арт аякларында басып торырга", "Биергә", "Йөгерергә"], correct: 0 },
  { q: "Шагыйрь вафат булган Г.А.Клячкин хастаханәсе Казанның кайсы урамында урнашкан?", a: ["Островский урамында", "Бауман урамында", "Тукай урамында"], correct: 0 },
];

const shuffleAnswers = (options: string[], correctIndex: number): { options: string[], correctAnswer: number } => {
  const indexed = options.map((opt, i) => ({ opt, isCorrect: i === correctIndex }));
  // Fisher-Yates shuffle
  for (let i = indexed.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indexed[i], indexed[j]] = [indexed[j], indexed[i]];
  }
  const newCorrect = indexed.findIndex(x => x.isCorrect);
  return { options: indexed.map(x => x.opt), correctAnswer: newCorrect };
};

export const generateBoard = (): Cell[] => {
  const board: Cell[] = [];

  let heroPositions = new Set<number>();
  let attempts = 0;

  while (heroPositions.size < 10 && attempts < 1000) {
    const p = Math.floor(Math.random() * (BOARD_SIZE - 4)) + 2; // Keep away from start/finish

    // Ensure at least 1 empty space between any two traps
    let isTooClose = false;
    for (let neighbor of [-2, -1, 0, 1, 2]) {
      if (heroPositions.has(p + neighbor)) {
        isTooClose = true;
        break;
      }
    }

    if (!isTooClose) {
      heroPositions.add(p);
    }
    attempts++;
  }

  const questionPositions = new Set<number>();
  while (questionPositions.size < 20) {
    const p = Math.floor(Math.random() * (BOARD_SIZE - 2)) + 1;
    if (!heroPositions.has(p)) {
      questionPositions.add(p);
    }
  }

  let heroIdx = 0;
  let qIdx = 0;

  for (let i = 0; i < BOARD_SIZE; i++) {
    if (i === 0) {
      board.push({ id: i, type: 'start', title: 'Старт', description: 'Тукай дөньясына рәхим итегез!' });
      continue;
    }
    if (i === BOARD_SIZE - 1) {
      board.push({ id: i, type: 'finish', title: 'Финиш', description: 'Сез җиңүче! Алтын карта сезнеке!' });
      continue;
    }

    if (heroPositions.has(i)) {
      const hero = TUQAY_HEROES[heroIdx % TUQAY_HEROES.length];
      board.push({
        id: i,
        type: 'hero',
        title: hero.title,
        description: hero.description,
        heroImage: hero.image || `https://picsum.photos/seed/${hero.title}_tuqay/200/200`
      });
      heroIdx++;
    } else if (questionPositions.has(i)) {
      const q = TUQAY_QUESTIONS[qIdx % TUQAY_QUESTIONS.length];
      const shuffled = shuffleAnswers(q.a, q.correct);
      board.push({
        id: i,
        type: 'question',
        title: `Сорау #${qIdx + 1}`,
        description: q.q,
        options: shuffled.options,
        correctAnswer: shuffled.correctAnswer,
        heroImage: (q as any).image // Optional image for questions
      });
      qIdx++;
    } else {
      board.push({
        id: i,
        type: 'safe',
        title: `Шакмак ${i}`,
        description: 'Буш шакмак. Монда бернәрсә дә эшләргә кирәк түгел.'
      });
    }
  }

  return board;
};
